from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from prometheus_fastapi_instrumentator import PrometheusFastApiInstrumentator

from config.database import DatabaseManager
from config.routers import RouterManager
from config.settings import MEDIA_DIR, AppConfig
#from config.elasticsearch import es

# Import your metrics
try:
    from .core.metrics import APP_VERSION # Assuming main.py is in apps/
except ImportError:
    from apps.core.metrics import APP_VERSION # Fallback

from apps.search.routers import router as search_router
from apps.orders.routers import router as orders_router


# -------------------
# --- Init Models ---
# -------------------

DatabaseManager().create_database_tables()

# --------------------
# --- Init FastAPI ---
# --------------------

app = FastAPI()

# Add Prometheus instrumentator
instrumentator = PrometheusFastApiInstrumentator().instrument(app)

# ------------------
# --- Middleware ---
# ------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

# -------------------
# --- Static File ---
# -------------------

# add static-file support, for see images by URL
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

# --------------------
# --- Init Routers ---
# --------------------

RouterManager(app).import_routers()
app.include_router(search_router)
app.include_router(orders_router)

@app.on_event("startup")
async def startup_event():
    # Expose Prometheus /metrics endpoint
    instrumentator.expose(app, include_in_schema=False, should_gzip=True)
    
    # Set application version metric
    app_config = AppConfig.get_config()
    APP_VERSION.labels(version=app_config.app_version).set(1)

    # Синхронизация данных
    from apps.analytics.etl.products_etl import sync_products_to_elasticsearch
    try:
        await sync_products_to_elasticsearch()
    except Exception as e:
        print(f"⚠️ Ошибка синхронизации с Elasticsearch: {e}")