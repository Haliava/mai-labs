from prometheus_client import Counter, Histogram, Gauge

# ------------------------------------
# --- Общие метрики приложения ---
# ------------------------------------
APP_VERSION = Gauge(
    "app_version",
    "Application version",
    ["version"]
)

# ------------------------------------
# --- Метрики базы данных (PostgreSQL) ---
# ------------------------------------
DB_QUERY_DURATION_SECONDS = Histogram(
    "db_query_duration_seconds",
    "Database query duration in seconds",
    ["query_type", "table", "success"] 
)

DB_ERRORS_TOTAL = Counter(
    "db_errors_total",
    "Total database errors",
    ["error_type", "operation"]
)

DB_TRANSACTIONS_TOTAL = Counter(
    "db_transactions_total",
    "Total database transactions",
    ["status"] # e.g., committed, rolled_back
)

# ------------------------------------
# --- Метрики Elasticsearch ---
# ------------------------------------
ES_REQUESTS_TOTAL = Counter(
    "es_requests_total",
    "Total requests to Elasticsearch",
    ["operation", "index", "status"] # status: success, error
)

ES_REQUEST_DURATION_SECONDS = Histogram(
    "es_request_duration_seconds",
    "Elasticsearch request duration in seconds",
    ["operation", "index"]
)

ES_INDEXING_DOCUMENTS_TOTAL = Counter(
    "es_indexing_documents_total",
    "Total documents indexed in Elasticsearch",
    ["index"]
)

# ------------------------------------
# --- Бизнес-метрики ---
# ------------------------------------
ORDERS_CREATED_TOTAL = Counter(
    "orders_created_total",
    "Total orders created"
)

ORDERS_STATUS_CHANGED_TOTAL = Counter(
    "orders_status_changed_total",
    "Total order status changes",
    ["old_status", "new_status"]
)

ORDERS_COMPLETED_TOTAL = Counter(
    "orders_completed_total",
    "Total orders completed"
)

# Используйте Histogram для отслеживания распределения сумм заказов
ORDERS_AMOUNT_HISTOGRAM = Histogram(
    "orders_amount_total", # Название оставлено как total для совместимости с вашим списком, но это гистограмма
    "Distribution of order amounts",
    labelnames=(), # Нет дополнительных меток для самого Histogram, если не нужно разделять по валюте и т.д.
    buckets=[10, 50, 100, 200, 500, 1000, 2000, 5000] # Примерные бакеты, настройте под свои данные
)


PRODUCTS_VIEWED_TOTAL = Counter(
    "products_viewed_total",
    "Total product views",
    ["product_id", "category_id"]
)

USER_REGISTRATIONS_TOTAL = Counter(
    "user_registrations_total",
    "Total user registrations"
)

USER_LOGINS_TOTAL = Counter(
    "user_logins_total",
    "Total user logins",
    ["status"] # success, failure
)

USER_PROFILE_UPDATES_TOTAL = Counter(
    "user_profile_updates_total",
    "Total user profile updates"
)

PAYMENTS_PROCESSED_TOTAL = Counter(
    "payments_processed_total",
    "Total payments processed",
    ["status", "payment_method"] # status: success, failed
)

ITEMS_ADDED_TO_CART_TOTAL = Counter(
    "items_added_to_cart_total",
    "Total items added to cart",
    ["product_id"]
)

# --- Метрики состояния приложения (Python/System) ---
# Стандартные метрики, такие как python_gc_collections_total, обычно предоставляются
# библиотекой prometheus_client (через GC_COLLECTOR) или prometheus-fastapi-instrumentator.
# Удаляем явное определение, чтобы избежать конфликтов и дублирования.

# Можно добавить информацию о версии при старте приложения
# Пример: APP_VERSION.labels(version="1.0.0").set(1)

# TODO: Подумать об APP_UPTIME_SECONDS (можно реализовать через Gauge и периодическое обновление)
# TODO: Подумать об APP_TASK_QUEUE_LENGTH (если есть фоновые задачи, например Celery) 