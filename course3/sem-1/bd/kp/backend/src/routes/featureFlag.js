import * as featureFlagController from '../controllers/feaureFlagController.js'

import express from 'express'
import { flushAllCache } from '../services/cacheService.js'

export const featureFlagRoutes = express.Router();

// Маршрут для сброса кэша
featureFlagRoutes.post('/flush-cache', async (req, res) => {
  try {
    await flushAllCache();
    res.status(200).json({ message: 'Cache successfully flushed' });
  } catch (error) {
    console.error('Error flushing cache:', error);
    res.status(500).json({ error: error.message });
  }
});

featureFlagRoutes.post('/', featureFlagController.createFeatureFlag);
featureFlagRoutes.get('/', featureFlagController.getAllFeatureFlags);
// Специфичные маршруты должны идти перед общими
featureFlagRoutes.get('/byOrg/:id', featureFlagController.getAllFeatureFlagsByOrgId);
featureFlagRoutes.get('/:id', featureFlagController.getFeatureFlagById);
featureFlagRoutes.put('/:id', featureFlagController.updateFeatureFlag);
featureFlagRoutes.delete('/:id', featureFlagController.deleteFeatureFlag);
