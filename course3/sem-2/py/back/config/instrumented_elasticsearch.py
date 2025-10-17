import time
from elasticsearch import AsyncElasticsearch, exceptions as es_exceptions
import os

try:
    # Attempt relative import, typical for package structures
    from ..apps.core.metrics import ES_REQUESTS_TOTAL, ES_REQUEST_DURATION_SECONDS, ES_INDEXING_DOCUMENTS_TOTAL
except ImportError:
    # Fallback for scenarios where the script might be run directly or a different path context
    from apps.core.metrics import ES_REQUESTS_TOTAL, ES_REQUEST_DURATION_SECONDS, ES_INDEXING_DOCUMENTS_TOTAL

class InstrumentedAsyncElasticsearch:
    def __init__(self, es_client: AsyncElasticsearch):
        self._client = es_client

    async def _execute_es_call(self, es_operation_func, operation_name: str, index_name: str = "_all", *args, **kwargs):
        start_time = time.time()
        status = "success"
        try:
            response = await es_operation_func(*args, **kwargs)
            # For indexing operations, count the number of documents
            if operation_name == "index" and kwargs.get('document'):
                ES_INDEXING_DOCUMENTS_TOTAL.labels(index=index_name).inc()
            elif operation_name == "bulk" and kwargs.get('operations'):
                 # For bulk, we need to parse the operations to determine index names and count
                op_count = 0
                indices = set()
                for op in kwargs.get('operations', []):
                    if isinstance(op, dict): # Check if op is a dictionary (header)
                        action = list(op.keys())[0] # e.g., "index", "create", "update", "delete"
                        if action in ["index", "create", "update"]:
                            op_count+=1
                            # Try to get index from header, fallback to default index_name if not present
                            indices.add(op[action].get("_index", index_name))
                if op_count > 0: # only inc if there were actual document operations
                    for idx in indices: # Increment per affected index
                         ES_INDEXING_DOCUMENTS_TOTAL.labels(index=idx).inc(op_count / len(indices) if indices else 1) # Average count if multiple indices
            return response
        except es_exceptions.ElasticsearchException as e:
            status = "error"
            # You might want to map specific Elasticsearch exceptions to more generic error types if needed
            # For now, we use the exception class name.
            # ES_ERRORS_TOTAL.labels(error_type=type(e).__name__, operation=operation_name, index=index_name).inc()
            # Decided to use status on ES_REQUESTS_TOTAL as per initial metric definition
            raise e # Re-throw the exception after metrics
        finally:
            duration = time.time() - start_time
            ES_REQUEST_DURATION_SECONDS.labels(operation=operation_name, index=index_name).observe(duration)
            ES_REQUESTS_TOTAL.labels(operation=operation_name, index=index_name, status=status).inc()

    async def search(self, index="_all", **kwargs):
        # The 'index' parameter in client.search() can be a string, list, or tuple.
        # For simplicity in metrics, we'll join them if it's a list/tuple or use as is.
        effective_index = index
        if isinstance(index, (list, tuple)):
            effective_index = ",".join(index) if index else "_all" # handle empty list/tuple
        elif index is None: # If index is None, Elasticsearch defaults to all indices
            effective_index = "_all"

        return await self._execute_es_call(self._client.search, "search", effective_index, index=index, **kwargs)

    async def index(self, index, document, **kwargs):
        # The 'index' parameter is required for the index API.
        return await self._execute_es_call(self._client.index, "index", index, index=index, document=document, **kwargs)

    async def get(self, index, id, **kwargs):
        return await self._execute_es_call(self._client.get, "get", index, index=index, id=id, **kwargs)

    async def delete(self, index, id, **kwargs):
        return await self._execute_es_call(self._client.delete, "delete", index, index=index, id=id, **kwargs)
        
    async def bulk(self, operations, index=None, **kwargs):
        # The 'index' parameter for bulk is optional at the top level, 
        # can be specified per operation.
        # We will pass the top-level index if provided, otherwise default to "_bulk_multiple_indices"
        # The _execute_es_call will try to parse individual indices from operations for ES_INDEXING_DOCUMENTS_TOTAL
        effective_index = index if index else "_bulk_operation"
        return await self._execute_es_call(self._client.bulk, "bulk", effective_index, operations=operations, index=index, **kwargs)

    async def ping(self, **kwargs):
        # Ping doesn't usually target a specific index in the same way, using a generic label
        return await self._execute_es_call(self._client.ping, "ping", "_internal", **kwargs)

    async def close(self):
        await self._client.close()

    # You can add other Elasticsearch client methods here as needed, following the same pattern.
    # For example: update, delete_by_query, etc.

# It's good practice to provide an initialized instance if this module will be imported directly.
# However, it's better to initialize it where the original 'es' client is initialized.
# For now, this class is defined. We will modify back/config/elasticsearch.py to use it. 