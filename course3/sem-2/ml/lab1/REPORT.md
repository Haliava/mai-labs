# Отчёт по лабораторной работе

## Свёрточные нейронные сети
### Студенты:

| ФИО                    | Роль в проекте              | Оценка |
| ---------------------- | --------------------------- | ------ |
| Фомин Иван Дмитриевич | Разработка и реализация всех этапов проекта |        |
> *Комментарии проверяющего*

## Теория

Данная работа посвящена исследованию и применению методов глубокого обучения для задач анализа и синтеза изображений домашних животных. В качестве центральной технологии выступают **свёрточные нейронные сети (CNN)**, дополненные техниками переноса обучения, интерпретации моделей и генеративно-состязательными подходами.

### 1. Свёрточные Нейронные Сети (CNN) и компьютерное зрение

**Компьютерное зрение** ставит целью научить машины "понимать" визуальную информацию. Ключевой задачей является **классификация изображений**, т.е. присвоение изображению метки соответствующего класса (в данном случае "кошка", "собака" или конкретная порода).

**Свёрточные нейронные сети (CNN)** являются специализированным типом нейронных сетей, архитектура которых идеально подходит для обработки данных с пространственной структурой, таких как изображения. Они эмулируют иерархическую природу обработки визуальной информации в биологических системах.

Основные строительные блоки CNN:

*   **Свёрточные Слои (Convolutional Layers):** Выполняют операцию свёртки, применяя набор обучаемых **фильтров (ядер)** к входным данным. Каждый фильтр действует как детектор локальных признаков (грани, текстуры, углы). Скользя по изображению, фильтр создает **карту признаков (feature map)**, указывающую на наличие и расположение детектируемого признака. Важной особенностью является **совместное использование весов (weight sharing)**: один и тот же фильтр применяется ко всем частям изображения, что значительно уменьшает количество параметров и делает модель инвариантной к положению признака. Часто используется **дополнение (padding)** для сохранения пространственного размера и обработки краев.

*   **Функции Активации (Activation Functions):** Вводят нелинейность после свёрточных слоев. **ReLU (Rectified Linear Unit)** – наиболее популярный выбор благодаря своей простоте ($f(x) = \max(0, x)$) и способности смягчать проблему затухающих градиентов.

*   **Слои Субдискретизации (Pooling Layers):** Уменьшают пространственное разрешение карт признаков, делая представление более робастным и компактным. **MaxPooling** выбирает максимальное значение в локальных областях, сохраняя наиболее выраженные признаки и обеспечивая инвариантность к небольшим деформациям.

*   **Полносвязные Слои (Fully Connected / Dense Layers):** Обычно располагаются в конце сети. Перед ними **слой выравнивания (Flatten)** преобразует многомерные карты признаков в вектор. Полносвязные слои объединяют извлеченные высокоуровневые признаки для финальной классификации.

### 2. Обработка Данных и Подготовка к Обучению

Качество работы модели глубокого обучения во многом зависит от подготовки данных.

*   **Используемые Библиотеки:**
    *   **TensorFlow & Keras:** Основа для построения и обучения моделей. Keras предоставляет удобный API (`Sequential`, `layers`, `compile`, `fit`, `callbacks`).
    *   **Scikit-learn (sklearn):** Применялась для разделения данных (`train_test_split`), кодирования меток (`LabelEncoder`) и расчета метрик (`metrics`).
    *   **OpenCV (cv2) / PIL:** Использовались для базовых операций с изображениями (чтение, изменение размера, конвертация цвета).
    *   **NumPy:** Для эффективных вычислений с массивами данных.
    *   **Matplotlib & Seaborn:** Для визуализации данных и результатов.

*   **Ключевые Этапы Предобработки:**
    *   **Изменение Размера (Resizing):** Приведение всех изображений к единому размеру, требуемому моделью.
    *   **Нормализация Пикселей:** Масштабирование значений пикселей в стандартный диапазон (например, [0, 1] или [-1, 1]) для стабилизации обучения.
    *   **Кодирование Меток (Label Encoding):** Преобразование текстовых названий классов в числовые индексы.
    *   **One-Hot Encoding (при необходимости):** Представление целочисленных меток в виде бинарных векторов.

*   **Разделение Выборки (Train/Test Split):** Данные делятся на обучающий набор (для подбора весов модели) и тестовый набор (для независимой оценки). Применялась **стратификация** для сохранения пропорций классов, что критично при несбалансированных данных.

### 3. Процесс Обучения и Оценки Модели

*   **Обучение с Учителем (Supervised Learning):** Модель обучается на размеченных данных (изображения + метки).
*   **Функции Потерь (Loss Functions):** Количественная мера ошибки модели:
    *   `BinaryCrossentropy`: Для задач с двумя классами.
    *   `SparseCategoricalCrossentropy` / `CategoricalCrossentropy`: Для задач с более чем двумя классами.
*   **Оптимизация:** Процесс минимизации функции потерь путем корректировки весов модели. Использовался оптимизатор **Adam**, известный своей эффективностью и адаптивной настройкой скорости обучения.
*   **Цикл Обучения:** Процесс итеративного обновления весов:
    *   **Эпохи (Epochs):** Один полный проход по всему обучающему набору данных.
    *   **Пакеты (Batches):** Обучающие данные обрабатываются небольшими группами (пакетами) для эффективности и стабильности. Веса обновляются после каждого пакета.
*   **Предотвращение Переобучения (Overfitting):**
    *   **Dropout:** Метод регуляризации, случайным образом обнуляющий часть нейронных связей во время обучения.
    *   **Ранняя Остановка (Early Stopping):** Коллбэк Keras, прекращающий обучение, если производительность на валидационной выборке перестает улучшаться.
    *   **Сохранение Лучшей Модели (`ModelCheckpoint`):** Коллбэк Keras для сохранения весов модели, показавшей наилучший результат на валидационной выборке.
*   **Оценка Производительности:**
    *   **Метрики:** Accuracy, Top-K Accuracy, Loss.
    *   **Матрица Ошибок (Confusion Matrix):** Визуализация ошибок классификации между классами.
    *   **Кривые Обучения:** Графики зависимости потерь и метрик от эпохи для анализа процесса обучения.

### 4. Перенос Обучения (Transfer Learning)

Обучение глубоких CNN с нуля ресурсоемко. **Transfer Learning** позволяет использовать модели, предварительно обученные на больших датасетах (например, ImageNet), как основу для решения новой задачи.

*   **Принцип:** Низкоуровневые и среднеуровневые признаки (грани, текстуры), изученные на ImageNet, универсальны и полезны для других визуальных задач.
*   **Используемые Архитектуры:**
    *   **VGG (VGG-16, VGG-19):** Отличаются последовательной и глубокой архитектурой с малыми (3x3) фильтрами. Хорошо извлекают признаки.
    *   **ResNet (ResNet50):** Используют **остаточные блоки (residual blocks)** с **пропускающими соединениями (skip connections)**, что позволяет эффективно обучать очень глубокие сети, решая проблему затухания градиентов.
*   **Подход Реализации:**
    1.  **Загрузка Базы:** Предобученная модель загружается без классификационной "головы" (`include_top=False`).
    2.  **Заморозка:** Веса базовой модели замораживаются (`layer.trainable = False`).
    3.  **Новая Голова:** Добавляется новый классификатор, адаптированный под целевую задачу.
    4.  **Обучение Головы:** Обучаются только веса новой головы.
    5.  **(Опционально) Тонкая Настройка (Fine-tuning):** Верхние слои базовой модели размораживаются (`layer.trainable = True`), и вся сеть дообучается с **очень низкой скоростью обучения**, чтобы адаптировать признаки к новому датасету, не разрушая накопленные знания.

### 5. Генерация Изображений: GAN и DCGAN

**Генеративно-Состязательные Сети (GAN)** – это подход к генеративному моделированию, основанный на соревновании двух сетей:
*   **Генератор (G):** Учится создавать реалистичные данные (изображения) из случайного шума (вектора из **латентного пространства**).
*   **Дискриминатор (D):** Учится отличать реальные данные от сгенерированных (фальшивых).

Обучение представляет собой **антагонистическую игру**, где G стремится обмануть D, а D – не быть обманутым.

**DCGAN (Deep Convolutional GAN)** – это архитектурный стандарт для GAN, генерирующих изображения:
*   Использует **Conv2DTranspose** (апсемплинг) в Генераторе и **Conv2D** (даунсемплинг) в Дискриминаторе.
*   Применяет **BatchNormalization** / **LayerNormalization** для стабилизации.
*   Использует **ReLU/LeakyReLU** и **Tanh/Sigmoid** в качестве активаций.
*   Избегает полносвязных слоев в основной части.

Для реализации GAN активно использовались API `tf.data` для создания эффективных конвейеров загрузки и предобработки данных.

---

## Ход работы и Результаты

### Этап 1: Базовая CNN для Pet Faces

Первым шагом стала разработка и оценка CNN, обученной "с нуля", для классификации на датасете "Pet Faces". Были поставлены две задачи: бинарная (кошка/собака) и мультиклассовая (35 пород).

**Подготовка:**
*   Датасет: "Pet Faces" (Oxford-IIIT Pet Dataset, обрезанный до морд животных).
*   Размер изображений: `(128, 128)`.
*   Нормализация: Пиксели в диапазоне [0, 1].
*   Разделение: Обучающая (2568) / Тестовая (643), стратифицированное.
*   Метки: Использовались Label Encoder метки.

**Архитектура CNN:**
Была создана единая базовая архитектура, включающая:
* Предобученная база MobileNetV2 без верхних слоев, с замороженными весами
* GlobalAveragePooling2D для обработки карт признаков
* Полносвязные слои с Dropout для классификации

На основе этой базы строились:
*   **Бинарный классификатор:** 
    * Последний слой: Dense(1) с активацией sigmoid
    * Функция потерь: binary_crossentropy
    * 64 нейрона в предпоследнем слое с Dropout(0.2)

*   **Мультиклассовый классификатор:** 
    * Последний слой: Dense(35) с активацией softmax
    * Функция потерь: sparse_categorical_crossentropy
    * 128 нейронов в предпоследнем слое с Dropout(0.3)

**Обучение:**
*   Оптимизатор: Adam с дефолтными параметрами
*   Потери: binary_crossentropy (бинарная) и sparse_categorical_crossentropy (мультикласс)
*   Коллбэки: EarlyStopping и ModelCheckpoint для сохранения лучшей модели

**Результаты:**

*   **Бинарная Классификация (Кошка/Собака):**
    *   Обучение остановлено на 5 эпохе
    *   **Test Accuracy:** 97.67%
    *   Матрица ошибок показывает отличное разделение между классами кошек и собак

*   **Мультиклассовая Классификация (Породы):**
    *   Обучение остановлено на 5 эпохе 
    *   **Test Accuracy:** 80.72%
    *   **Test Top-3 Accuracy:** 94.87%
    *   Результаты удовлетворительные для модели, учитывая сложность задачи и ограниченный объем данных

**Анализ обучения:**
* Бинарная классификация оказалась значительно проще и быстрее достигла высокой точности
* Для мультиклассовой задачи наблюдалась тенденция к переобучению, которую удалось контролировать с помощью Dropout и ранней остановки
* Кривые обучения показали стабильное снижение потерь и рост точности на валидационной выборке в течение первых 3-4 эпох

**Выводы по этапу:** 
Даже при ограниченном объеме данных модель на основе MobileNetV2 с переносом обучения показала хорошие результаты. Бинарная классификация (кошка/собака) достигла почти идеальной точности около 98%, а мультиклассовая классификация пород достигла точности около 81%, что является хорошим результатом учитывая 35 классов. Использование предобученных весов существенно ускорило обучение и повысило эффективность модели.

### Этап 2: Transfer Learning для Oxford Pets

На этом этапе решалась задача классификации 37 пород на датасете "Oxford-IIIT Pet Dataset" с использованием **Transfer Learning** (VGG16, VGG19, ResNet50).

**Подготовка:**
*   Датасет: "Oxford-IIIT Pet".
*   Разделение: Обучающая (4729) / Валидационная (1183) / Тестовая (1478), стратифицированное.
*   Классы: 37 пород.
*   Предобработка: `tf.data` пайплайн, аугментация данных (поворот, отражение, масштабирование), нормализация специфичная для каждой модели

**Архитектура (Transfer Learning):**
*   Базовые модели: VGG16, VGG19, ResNet50 (предобученные на ImageNet, `include_top=False`).
*   Веса базы заморожены (`trainable=False`).
*   Новая "голова": `GlobalAveragePooling2D` -> Dense(128, ReLU) -> Dropout(0.5) -> Dense(37, softmax)

**Обучение:**
*   Оптимизатор: Adam с learning_rate=0.001
*   Потери: sparse_categorical_crossentropy
*   Метрики: accuracy, top-3 accuracy, top-5 accuracy
*   Коллбэки: EarlyStopping (monitor='val_accuracy', patience=5), ModelCheckpoint, ReduceLROnPlateau

**Результаты и Сравнение:**

| Модель   | Лучшая Val Accuracy | Test Accuracy |
| :------- | :------------------ | :------------ |
| VGG16    | 55.71%              | 55.43%        |
| VGG19    | 56.24%              | 55.81%        |
| **ResNet50** | **91.38%**      | **90.87%**    |

Модель на базе **ResNet50** показала наилучший результат, значительно превосходя VGG архитектуры.

**Детальная Оценка ResNet50:**
*   **Test Accuracy:** 90.87%
*   **Test Top-3 Accuracy:** 98.24%
*   **Test Top-5 Accuracy:** 99.59%
*   **Бинарная Точность (Кошка/Собака, производная):** 99.73%
*   **Анализ ошибок:** Большинство ошибок возникали между визуально схожими породами (например, разные породы терьеров). Наблюдалась тенденция улучшения различения внутри класса (кошка/собака) по сравнению с межклассовыми ошибками.
*   **Вывод:** ResNet50 с skip-соединениями обеспечивает лучшее извлечение признаков и устойчивость к проблеме затухающих градиентов, что существенно улучшает результаты для сложных задач классификации.

**Визуализация активаций:**
Дополнительно проведена визуализация карт активации модели с использованием GradCAM. Результаты показали, что модель корректно фокусируется на морде животного, с особым вниманием к ключевым визуальным признакам пород (форма глаз, ушей, носа).

**Выводы по этапу:**
Применение Transfer Learning с замороженной базовой моделью значительно повышает точность классификации пород. ResNet50 продемонстрировал наилучшую производительность благодаря своей архитектуре с остаточными соединениями. Высокие показатели Top-3 и Top-5 Accuracy (>98%) говорят о том, что даже в случаях неточной классификации, модель уверенно сужает варианты до нескольких визуально схожих пород.

### Этап 3: Генерация Изображений (DCGAN)

Третьим этапом стала реализация **DCGAN** для генерации синтетических изображений питомцев на основе датасета Oxford Pets. Были реализованы две версии GAN: базовый (DCGAN 32x32) и улучшенный (standalone версия).

#### Базовая DCGAN:

**Подготовка Данных:**
*   Размер: `(32, 32)`.
*   Нормализация: **`[-1, 1]`**.
*   Пайплайн: `tf.data` с `map`, `shuffle`, `batch`, `prefetch`.
*   Использованы 2000 изображений для ускорения обучения.

**Архитектура:**
*   **Генератор:** 
    * Вход: случайный шум (100, латентное пространство)
    * Полносвязный слой -> reshape до (4, 4, 256)
    * Последовательные Conv2DTranspose слои с BatchNormalization и LeakyReLU
    * Выход: Conv2D с tanh активацией, размерность (32, 32, 3)

*   **Дискриминатор:** 
    * Вход: изображение (32, 32, 3)
    * Последовательные Conv2D слои с LeakyReLU и Dropout
    * Выход: Dense(1) без активации для логитов

**Обучение:**
* Оптимизатор: Adam(lr=2e-4, beta_1=0.5) для обеих сетей
* Функция потерь: binary_crossentropy
* 15 эпох, batch_size=32
* Поочередное обучение дискриминатора и генератора

*   Результаты:
    * Epoch 1/15, Gen Loss: 0.8011, Disc Loss: 1.2092
    * Epoch 5/15, Gen Loss: 1.7008, Disc Loss: 0.8362
    * Epoch 10/15, Gen Loss: 0.9918, Disc Loss: 1.2012
    * Epoch 15/15, Gen Loss: 0.7551, Disc Loss: 1.3740
    * Общее время обучения: 762.93 секунд

**Результаты:**
* Базовая DCGAN начала генерировать распознаваемые очертания животных после 5-й эпохи
* К 15-й эпохе генератор создавал изображения с четкими контурами морд животных
* Однако присутствовали артефакты и общее качество изображений было низким из-за малого разрешения и ограниченной глубины модели

#### Улучшенная DCGAN (Standalone):

**Улучшения:**
* Увеличенное разрешение: 48x48 пикселей
* Более глубокая архитектура обеих сетей с дополнительными слоями
* Использование mixed_bfloat16 для ускорения вычислений
* Применение более агрессивной аугментации для дискриминатора
* Расширенный латентный вектор (64 размерности) для улучшения разнообразия
* Post-processing для улучшения качества генерируемых изображений
* Увеличенное количество эпох (20)

**Результаты:**
* Значительно улучшенное качество генерируемых изображений
* Четкое формирование узнаваемых черт животных - глаза, уши, носы
* Более стабильное обучение с меньшими колебаниями функции потерь
* Успешное формирование цветовых паттернов, характерных для разных пород
* Созданы реалистичные изображения с разрешением до 128x128 после применения методов увеличения разрешения

**Анализ прогресса обучения:**
* Ранние эпохи (1-5): формирование базовых форм и цветовых паттернов
* Средние эпохи (6-15): улучшение деталей и четкости черт морды
* Последние эпохи (16-20): тонкая настройка текстуры и деталей
* Наблюдалась стабилизация потерь генератора около значений 0.6-0.8
* Mode collapse (коллапс мод) удалось избежать благодаря регуляризации дискриминатора через Dropout

**Выводы по этапу:** Успешно реализованы и обучены две DCGAN модели. Основные выводы:
1. DCGAN эффективно справляется с задачей генерации изображений животных, создавая узнаваемые структуры морд
2. Увеличение размера и глубины сети существенно улучшает качество генерации
3. Критически важным является баланс между генератором и дискриминатором - именно их "здоровая конкуренция" обеспечивает прогресс в обучении
4. Применение post-processing методов позволяет получить высококачественные изображения, сохраняя при этом разумные вычислительные затраты

## Вывод

Проект успешно охватил три ключевые задачи в области анализа и синтеза изображений домашних животных с использованием свёрточных нейронных сетей:

1.  **Базовая Классификация:** Реализована и протестирована базовая CNN-модель для классификации морд животных на основе MobileNetV2. Достигнуты высокие результаты как для бинарной задачи (98% точности), так и для многоклассовой классификации (81% точности при 35 классах), что демонстрирует эффективность даже простых CNN-архитектур для задач средней сложности.

2.  **Продвинутая Классификация:** Эффективно применен **Transfer Learning**. **ResNet50** показал наилучшую производительность (91% точности) среди трех протестированных архитектур для классификации 37 пород животных. Анализ ошибок и достижение 99.6% Top-5 Accuracy подтверждают надежность и точность классификации. Визуализация активаций продемонстрировала, что модель корректно фокусируется на характерных признаках пород.

3.  **Генерация Изображений:** Реализованы две версии **DCGAN**, способные генерировать новые изображения питомцев. Улучшенная версия продемонстрировала более качественные результаты с разрешением до 128x128 пикселей. Прогресс обучения и стабильность потерь подтверждают корректность реализации состязательной парадигмы. Сгенерированные изображения содержат характерные породные черты и могут применяться для аугментации данных в будущих проектах.

В целом, проект демонстрирует многогранность применения глубокого обучения в задачах компьютерного зрения, от классификации до генерации контента, и подтверждает эффективность современных архитектур и методик для работы с визуальными данными.

