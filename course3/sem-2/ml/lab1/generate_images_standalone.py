import glob
import imageio

import kagglehub
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import vgg16, vgg19, resnet50
from tensorflow.python.eager import context
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os
import re
import time
import math

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, ConfusionMatrixDisplay

_ = tf.Variable([1])

context._context = None
context._create_context()

tf.config.optimizer.set_jit(True)
tf.config.threading.set_inter_op_parallelism_threads(8)
tf.config.threading.set_intra_op_parallelism_threads(8)

policy = tf.keras.mixed_precision.Policy('mixed_bfloat16')
tf.keras.mixed_precision.set_global_policy(policy)

IMG_SIZE_GAN = 48
LATENT_DIM = 64
EPOCHS_GAN = 20
BATCH_SIZE_GAN = 48
BUFFER_SIZE_GAN = 5000
MAX_IMAGES = 4000
GAN_STORAGE = "gan-results-standalone"

if not os.path.exists(GAN_STORAGE):
    os.makedirs(GAN_STORAGE)

print(f"Результаты GAN будут сохраняться в: {GAN_STORAGE}")

def get_species(filename):
    first_letter = filename[0].upper()
    if first_letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']:
        return 'dog'
    else:
        return 'cat'

def load_pet_images_dataset():
    """Загружает и подготавливает датасет изображений животных из Oxford Pets Dataset."""
    print("Загрузка датасета...")
    dataset_path = kagglehub.dataset_download("tanlikesmath/the-oxfordiiit-pet-dataset")
    images_dir = os.path.join(dataset_path, "images")
    print(f"Количество изображений в источнике: {len(os.listdir(images_dir))}")
    
    image_paths = []
    breed_labels = []
    species_labels = []
    breeds = set()
    processed_files = 0
    skipped_files = 0
    
    all_files = [f for f in os.listdir(images_dir) if f.lower().endswith('.jpg')]
    print(f"Найдено JPG файлов: {len(all_files)}")
    
    if len(all_files) > MAX_IMAGES:
        import random
        random.shuffle(all_files)
        selected_files = all_files[:MAX_IMAGES]
        print(f"Для ускорения обучения используем только {MAX_IMAGES} изображений")
    else:
        selected_files = all_files
    
    for filename in selected_files:
        file_path = os.path.join(images_dir, filename)
        if os.path.isdir(file_path):
            skipped_files += 1
            continue
    
        breed = getattr(re.match(r'^([A-Za-z_]+)_\d+\.jpg$', filename), 'group', lambda _: '')(1)
        species = get_species(filename)
    
        if breed is None or species is None:
            skipped_files += 1
            continue
    
        image_paths.append(file_path)
        breed_labels.append(breed)
        species_labels.append(species)
        breeds.add(breed)
        processed_files += 1
    
    print(f"Обработано {processed_files} файлов")
    print(f"Пропущено {skipped_files} файлов")
    
    def preprocess(path):
        try:
            img = tf.io.read_file(path)
            img = tf.image.decode_jpeg(img, channels=3)
            img = tf.image.resize(tf.image.convert_image_dtype(img, tf.float32), [IMG_SIZE_GAN, IMG_SIZE_GAN])
            img = (img * 2) - 1
            return img
        except tf.errors.InvalidArgumentError:
            print(f"Ошибка чтения изображения: {path}")
            return tf.zeros([IMG_SIZE_GAN, IMG_SIZE_GAN, 3])
    
    dataset = tf.data.Dataset.from_tensor_slices(image_paths)
    dataset = dataset.map(preprocess, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.cache()
    dataset = dataset.shuffle(BUFFER_SIZE_GAN).batch(BATCH_SIZE_GAN).prefetch(tf.data.AUTOTUNE)
    
    print(f"Датасет подготовлен: {len(image_paths)} изображений")
    
    for batch in dataset.take(1):
        print(f"Форма батча: {batch.shape}")
        break
    
    return dataset

def build_generator():
    inputs = keras.Input(shape=(LATENT_DIM,))
    
    x = layers.Dense(4 * 4 * 256, use_bias=False)(inputs)
    x = layers.Reshape((4, 4, 256))(x)
    
    x = layers.Conv2DTranspose(128, (4, 4), strides=(2, 2), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU(0.2)(x)
    
    x = layers.Conv2DTranspose(64, (4, 4), strides=(2, 2), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU(0.2)(x)
    
    x = layers.Conv2DTranspose(32, (4, 4), strides=(3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU(0.2)(x)
    
    outputs = layers.Conv2D(3, (3, 3), padding='same', activation='tanh')(x)
    
    model = keras.Model(inputs=inputs, outputs=outputs, name="generator")
    return model

def build_discriminator():
    inputs = keras.Input(shape=(IMG_SIZE_GAN, IMG_SIZE_GAN, 3))
    
    x = layers.Conv2D(32, (4, 4), strides=(2, 2), padding='same')(inputs)
    x = layers.LeakyReLU(0.2)(x)
    x = layers.Dropout(0.3)(x)
    
    x = layers.Conv2D(64, (4, 4), strides=(2, 2), padding='same')(x)
    x = layers.LeakyReLU(0.2)(x)
    x = layers.Dropout(0.3)(x)
    
    x = layers.Conv2D(128, (4, 4), strides=(3, 3), padding='same')(x)
    x = layers.LeakyReLU(0.2)(x)
    x = layers.Dropout(0.3)(x)
    
    x = layers.Flatten()(x)
    outputs = layers.Dense(1)(x)
    
    model = keras.Model(inputs=inputs, outputs=outputs, name="discriminator")
    return model

# Функции потерь и оптимизаторы
cross_entropy = tf.keras.losses.BinaryCrossentropy(from_logits=True)

def discriminator_loss(real_output, fake_output):
    real_loss = cross_entropy(tf.ones_like(real_output), real_output)
    fake_loss = cross_entropy(tf.zeros_like(fake_output), fake_output)
    total_loss = real_loss + fake_loss
    return total_loss

def generator_loss(fake_output):
    return cross_entropy(tf.ones_like(fake_output), fake_output)

# Оптимизаторы - настраиваем параметры для лучшей сходимости
generator_optimizer = tf.keras.optimizers.Adam(2e-4, beta_1=0.5)
discriminator_optimizer = tf.keras.optimizers.Adam(2e-4, beta_1=0.5)

# Функция для создания случайного шума
def generate_random_noise(batch_size, latent_dim):
    return tf.random.normal([batch_size, latent_dim])

# Функция для генерации и сохранения изображений
def generate_and_save_images(model, epoch, test_input):
    predictions = model(test_input, training=False)
    
    fig = plt.figure(figsize=(4, 4))
    
    for i in range(predictions.shape[0]):
        plt.subplot(4, 4, i+1)
        # Денормализация изображений
        img = (predictions[i].numpy() + 1) / 2.0
        plt.imshow(img)
        plt.axis('off')
    
    plt.savefig(os.path.join(GAN_STORAGE, f'image_at_epoch_{epoch:04d}.png'))
    plt.close()

# Основная функция обучения с использованием @tf.function для ускорения
@tf.function
def train_step(generator, discriminator, images):
    batch_size = tf.shape(images)[0]
    noise = generate_random_noise(batch_size, LATENT_DIM)
    
    with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
        generated_images = generator(noise, training=True)
        
        real_output = discriminator(images, training=True)
        fake_output = discriminator(generated_images, training=True)
        
        gen_loss = generator_loss(fake_output)
        disc_loss = discriminator_loss(real_output, fake_output)
        
    gradients_of_generator = gen_tape.gradient(gen_loss, generator.trainable_variables)
    gradients_of_discriminator = disc_tape.gradient(disc_loss, discriminator.trainable_variables)
    
    generator_optimizer.apply_gradients(zip(gradients_of_generator, generator.trainable_variables))
    discriminator_optimizer.apply_gradients(zip(gradients_of_discriminator, discriminator.trainable_variables))
    
    return gen_loss, disc_loss

# Основной цикл обучения с улучшенной стратегией
def train_gan(dataset):
    # Создание моделей
    generator = build_generator()
    discriminator = build_discriminator()
    
    # Сидовый шум для визуализации прогресса (фиксированный)
    seed = generate_random_noise(16, LATENT_DIM)
    
    # Время начала обучения
    start_time = time.time()
    
    # Для раннего останова с более гибкими настройками
    best_loss = float('inf')
    patience = 5  # Увеличиваем терпение, чтобы дать модели больше времени для схождения
    patience_counter = 0
    early_stop = False
    
    # Сохранение истории для графиков
    history = {
        'gen_loss': [],
        'disc_loss': [],
        'epoch_times': []
    }
    
    # Оценка количества шагов в эпохе
    steps_per_epoch = MAX_IMAGES // BATCH_SIZE_GAN + (1 if MAX_IMAGES % BATCH_SIZE_GAN > 0 else 0)
    
    for epoch in range(EPOCHS_GAN):
        if early_stop:
            print(f"Раннее остановка на эпохе {epoch}")
            break
            
        epoch_start_time = time.time()
        
        total_gen_loss = 0
        total_disc_loss = 0
        steps = 0
        
        # Перед каждой эпохой выводим оценку времени
        print(f"Начало эпохи {epoch+1}/{EPOCHS_GAN}...")
        
        for image_batch in dataset:
            gen_loss, disc_loss = train_step(generator, discriminator, image_batch)
            total_gen_loss += gen_loss
            total_disc_loss += disc_loss
            steps += 1
            
            # Выводим прогресс каждые 20 шагов
            if steps % 20 == 0:
                elapsed = time.time() - epoch_start_time
                eta = (elapsed / steps) * (steps_per_epoch - steps)
                print(f'Эпоха {epoch+1}, шаг {steps}/{steps_per_epoch}, {elapsed:.1f}s, ETA: {eta:.1f}s: Gen: {gen_loss:.4f}, Disc: {disc_loss:.4f}', end='\r')
        
        # Вычисление средних потерь за эпоху
        avg_gen_loss = total_gen_loss / steps
        avg_disc_loss = total_disc_loss / steps
        
        # Сохраняем историю для графиков
        epoch_time = time.time() - epoch_start_time
        history['gen_loss'].append(avg_gen_loss)
        history['disc_loss'].append(avg_disc_loss)
        history['epoch_times'].append(epoch_time)
        
        # Проверка для раннего останова с более гибкими критериями
        # Обеспечиваем более стабильный тренд снижения потерь
        if len(history['gen_loss']) > 3:  # Смотрим на тренд за последние 3 эпохи
            recent_avg = sum(history['gen_loss'][-3:]) / 3
            if recent_avg < best_loss:
                best_loss = recent_avg
                patience_counter = 0
            else:
                patience_counter += 1
                if patience_counter >= patience:
                    early_stop = True
        else:
            if avg_gen_loss < best_loss:
                best_loss = avg_gen_loss
            
        # Вывод статистики
        print(f'Epoch {epoch+1}/{EPOCHS_GAN}, Gen Loss: {avg_gen_loss:.4f}, Disc Loss: {avg_disc_loss:.4f}, Time: {epoch_time:.2f}s')
        
        # Сохранение изображений каждые 3 эпохи или в последнюю эпоху
        if (epoch + 1) % 3 == 0 or epoch == EPOCHS_GAN - 1 or early_stop:
            generate_and_save_images(generator, epoch + 1, seed)
    
    # Общее время обучения
    total_time = time.time() - start_time
    print(f'Общее время обучения: {total_time:.2f} секунд')
    print(f'Среднее время на эпоху: {total_time / (epoch + 1):.2f} секунд')
    
    # Построение графика истории обучения
    try:
        plt.figure(figsize=(12, 5))
        plt.subplot(1, 2, 1)
        plt.plot(history['gen_loss'], label='Generator')
        plt.plot(history['disc_loss'], label='Discriminator')
        plt.title('Loss During Training')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        plt.plot(history['epoch_times'])
        plt.title('Epoch Times')
        plt.xlabel('Epoch')
        plt.ylabel('Time (s)')
        
        plt.tight_layout()
        plt.savefig(os.path.join(GAN_STORAGE, 'training_history.png'))
        print(f"График обучения сохранен в {os.path.join(GAN_STORAGE, 'training_history.png')}")
    except Exception as e:
        print(f"Ошибка при создании графика: {e}")
    
    # Сохранение финальной модели
    try:
        model_save_path = os.path.join(GAN_STORAGE, 'generator_model.keras')
        generator.save(model_save_path)
        print(f"Модель сохранена в {model_save_path}")
    except Exception as e:
        print(f"Ошибка при сохранении модели: {e}")
        print("Продолжаем без сохранения модели")
    
    return generator

# Функция для генерации новых изображений с помощью обученной модели
def generate_new_images(generator, num_images=16):
    noise = generate_random_noise(num_images, LATENT_DIM)
    generated_images = generator(noise, training=False)
    
    # Денормализация и отображение
    fig = plt.figure(figsize=(4, 4))
    for i in range(num_images):
        plt.subplot(4, 4, i+1)
        img = (generated_images[i].numpy() + 1) / 2.0
        plt.imshow(img)
        plt.axis('off')
    
    plt.savefig(os.path.join(GAN_STORAGE, 'final_generated_images.png'))
    plt.close()
    return generated_images

# Функция для улучшения качества сгенерированных изображений и повышения разрешения
def enhance_and_upscale_images(generated_images, target_size=128):
    """
    Улучшает качество сгенерированных изображений и повышает их разрешение
    """
    print(f"Улучшение качества изображений и повышение разрешения до {target_size}x{target_size}...")
    
    enhanced_images = []
    
    # Обрабатываем каждое изображение
    for i, img in enumerate(generated_images):
        # Денормализация из [-1, 1] в [0, 1]
        img = (img.numpy() + 1) / 2.0
        
        # Повышаем разрешение с помощью бикубической интерполяции
        upscaled = tf.image.resize(
            img, [target_size, target_size], 
            method=tf.image.ResizeMethod.BICUBIC
        ).numpy()
        
        # Применяем небольшую постобработку для улучшения четкости
        enhanced = upscaled * 1.1  # Увеличиваем контраст
        enhanced = np.clip(enhanced, 0, 1)  # Обрезаем значения до диапазона [0, 1]
        
        enhanced_images.append(enhanced)
        
        # Сохраняем отдельные улучшенные изображения
        plt.figure(figsize=(5, 5))
        plt.imshow(enhanced)
        plt.axis('off')
        plt.tight_layout()
        plt.savefig(os.path.join(GAN_STORAGE, f'enhanced_image_{i+1}.png'), bbox_inches='tight', pad_inches=0.1)
        plt.close()
    
    # Создаем сетку из всех улучшенных изображений
    fig = plt.figure(figsize=(12, 12))
    for i, enhanced in enumerate(enhanced_images[:16]):  # Показываем максимум 16 изображений
        plt.subplot(4, 4, i+1)
        plt.imshow(enhanced)
        plt.axis('off')
    
    plt.savefig(os.path.join(GAN_STORAGE, 'enhanced_images_grid.png'))
    plt.close()
    print(f"Улучшенные изображения сохранены в {GAN_STORAGE}")
    
    return enhanced_images

# Функция для отображения реальных изображений из датасета
def visualize_real_images(dataset, num_images=16):
    """
    Отображает реальные изображения из датасета для сравнения с генерируемыми
    """
    real_images = []
    for images in dataset.take(1):
        real_images = images[:num_images]
        break
    
    fig = plt.figure(figsize=(4, 4))
    for i in range(min(num_images, len(real_images))):
        plt.subplot(4, 4, i+1)
        # Денормализация изображений
        img = (real_images[i].numpy() + 1) / 2.0
        plt.imshow(img)
        plt.axis('off')
    
    plt.savefig(os.path.join(GAN_STORAGE, 'real_images.png'))
    plt.close()
    print(f"Реальные изображения сохранены в {os.path.join(GAN_STORAGE, 'real_images.png')}")

# Запуск обучения GAN
if __name__ == "__main__":
    print("Запуск обучения GAN для генерации изображений животных...")
    
    # Загружаем датасет и визуализируем реальные изображения
    dataset = load_pet_images_dataset()
    visualize_real_images(dataset)
    
    # Обучаем GAN
    generator = train_gan(dataset)
    
    print("Генерация финальных изображений...")
    generated_images = generate_new_images(generator)
    
    # Улучшаем качество и повышаем разрешение сгенерированных изображений
    enhanced_images = enhance_and_upscale_images(generated_images, target_size=128)
    
    print(f"Все результаты сохранены в директории: {GAN_STORAGE}")
    

