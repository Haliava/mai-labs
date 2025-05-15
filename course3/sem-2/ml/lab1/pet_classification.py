import numpy as np
import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

IMG_SIZE = 128
BATCH_SIZE = 32
EPOCHS = 5
TEST_SIZE = 0.2
RANDOM_STATE = 42

def load_dataset(dataset_path):
    images = []
    binary_labels = []  # 0 for cat, 1 for dog
    breed_labels = []
    breed_names = []
    
    class_dirs = sorted(os.listdir(dataset_path))
    
    for i, class_dir in enumerate(class_dirs):
        class_path = os.path.join(dataset_path, class_dir)
        if not os.path.isdir(class_path):
            continue
            
        # Extract pet type (cat or dog) from directory name
        pet_type = 1 if class_dir.startswith('dog_') else 0
        breed_name = class_dir
        
        if breed_name not in breed_names:
            breed_names.append(breed_name)
            
        print(f"Loading {breed_name} images...")
        
        for img_file in os.listdir(class_path):
            if not img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
                
            img_path = os.path.join(class_path, img_file)
            try:
                # Load and preprocess image
                img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
                img_array = img_to_array(img) / 255.0  # Normalize to [0,1]
                
                images.append(img_array)
                binary_labels.append(pet_type)
                breed_labels.append(breed_names.index(breed_name))
            except Exception as e:
                print(f"Error loading {img_path}: {e}")
    
    return np.array(images), np.array(binary_labels), np.array(breed_labels), breed_names

# Create a simple CNN model for binary classification
def create_binary_model():
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    # Freeze the base model
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Create a simple CNN model for breed classification
def create_breed_model(num_classes):
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    # Freeze the base model
    base_model.trainable = False
    
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Calculate Top-K accuracy
def top_k_accuracy(y_true, y_pred, k=3):
    top_k_preds = np.argsort(-y_pred, axis=1)[:, :k]
    matches = [y_true[i] in top_k_preds[i] for i in range(len(y_true))]
    return np.mean(matches)

# Plot confusion matrix
def plot_confusion_matrix(y_true, y_pred, class_names, title):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title(title)
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(f'{title.lower().replace(" ", "_")}.png')
    plt.close()

def main():
    dataset_path = './petfaces'
    
    # Load dataset
    print("Loading dataset...")
    X, y_binary, y_breed, breed_names = load_dataset(dataset_path)
    
    # Split the dataset into training and testing sets
    X_train, X_test, y_binary_train, y_binary_test, y_breed_train, y_breed_test = train_test_split(
        X, y_binary, y_breed, test_size=TEST_SIZE, stratify=y_breed, random_state=RANDOM_STATE
    )
    
    print(f"Dataset loaded: {len(X_train)} training samples, {len(X_test)} testing samples")
    
    # Binary classification (Cat vs Dog)
    print("\n--- Binary Classification (Cat vs Dog) ---")
    binary_model = create_binary_model()
    binary_model.fit(
        X_train, y_binary_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_test, y_binary_test)
    )
    
    # Evaluate binary model
    binary_preds_prob = binary_model.predict(X_test)
    binary_preds = (binary_preds_prob > 0.5).astype(int).flatten()
    binary_accuracy = accuracy_score(y_binary_test, binary_preds)
    
    print(f"\nBinary Classification Results:")
    print(f"Test Accuracy: {binary_accuracy:.4f}")
    
    # Plot binary confusion matrix
    plot_confusion_matrix(y_binary_test, binary_preds, ['Cat', 'Dog'], "Binary Classification Confusion Matrix")
    
    # Breed classification
    print("\n--- Breed Classification ---")
    num_breeds = len(breed_names)
    breed_model = create_breed_model(num_breeds)
    breed_model.fit(
        X_train, y_breed_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_test, y_breed_test)
    )
    
    # Evaluate breed model
    breed_preds_prob = breed_model.predict(X_test)
    breed_preds = np.argmax(breed_preds_prob, axis=1)
    breed_accuracy = accuracy_score(y_breed_test, breed_preds)
    top3_accuracy = top_k_accuracy(y_breed_test, breed_preds_prob, k=3)
    
    print(f"\nBreed Classification Results:")
    print(f"Test Accuracy: {breed_accuracy:.4f}")
    print(f"Top-3 Accuracy: {top3_accuracy:.4f}")
    
    # Plot breed confusion matrix (simplified for display)
    simplified_breed_names = [name.replace('cat_', '').replace('dog_', '') for name in breed_names]
    plot_confusion_matrix(y_breed_test, breed_preds, simplified_breed_names, "Breed Classification Confusion Matrix")
    
if __name__ == "__main__":
    main() 