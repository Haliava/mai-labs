import {
  createFeatureFlag as createFeatureFlagService,
  deleteFeatureFlag as deleteFeatureFlagService,
  getAllFeatureFlagsByOrgId as getAllFeatureFlagsByOrgIdService,
  getAllFeatureFlags as getAllFeatureFlagsService,
  getFeatureFlagById as getFeatureFlagByIdService,
  updateFeatureFlag as updateFeatureFlagService,
} from '../services/featureFlagService.js';
import { invalidateCache, invalidateCacheByPattern } from '../services/cacheService.js';

import { auditLogRepository } from '../repository/audit_log.js';
import { featureFlagRepository } from '../repository/feature_flag.js';

export const createFeatureFlag = async (req, res) => {
    try {
        const newFeatureFlag = await createFeatureFlagService(
          featureFlagRepository,
          auditLogRepository,
          req.body,
          req.body.user.id
        );
        res.status(201).json(newFeatureFlag);
    } catch (error) {
        console.error('Error creating feature flag:', error);
        res.status(400).json({ error: error.message });
    }
};

export const getAllFeatureFlags = async (req, res) => {
    try {
        const featureFlags = await getAllFeatureFlagsService(featureFlagRepository);
        res.status(200).json(featureFlags);
    } catch (error) {
        console.error('Error getting all feature flags:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllFeatureFlagsByOrgId = async (req, res) => {
    try {
        // Принудительно сбрасываем кэш перед получением данных
        await invalidateCache(`feature-flags:org:${req.params.id}`);
        
        // Для отладки
        console.log(`Request for feature flags by org ID: ${req.params.id}`);
        
        const featureFlags = await getAllFeatureFlagsByOrgIdService(featureFlagRepository, req.params.id);
        
        if (!featureFlags || featureFlags.length === 0) {
            console.log(`No feature flags found for org ID: ${req.params.id}`);
            return res.status(200).json([]);
        }
        
        console.log(`Found ${featureFlags.length} feature flags for org ID: ${req.params.id}`);
        res.status(200).json(featureFlags);
    } catch (error) {
        console.error(`Error getting feature flags by org ID ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};

export const getFeatureFlagById = async (req, res) => {
    try {
        const featureFlag = await getFeatureFlagByIdService(featureFlagRepository, req.params.id);
        if (!featureFlag) {
            return res.status(404).json({ message: 'Feature flag not found' });
        }
        res.status(200).json(featureFlag);
    } catch (error) {
        console.error(`Error getting feature flag by ID ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};

export const updateFeatureFlag = async (req, res) => {
    try {
        const updatedFeatureFlag = await updateFeatureFlagService(
          featureFlagRepository,
          req.params.id,
          auditLogRepository,
          req.body,
          req.body.user.id,
        );
        
        // После обновления, принудительно инвалидируем все связанные кэши
        await invalidateCacheByPattern('feature-flag:*');
        await invalidateCacheByPattern('feature-flags:*');
        
        if (!updatedFeatureFlag) {
            return res.status(404).json({ message: 'Feature flag not found' });
        }
        
        res.status(200).json(updatedFeatureFlag);
    } catch (error) {
        console.error(`Error updating feature flag ID ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteFeatureFlag = async (req, res) => {
    try {
        const deletedFeatureFlag = await deleteFeatureFlagService(
          featureFlagRepository,
          req.params.id,
          auditLogRepository,
          req.body.user.id,
        );
        
        // После удаления, принудительно инвалидируем все связанные кэши
        await invalidateCacheByPattern('feature-flag:*');
        await invalidateCacheByPattern('feature-flags:*');
        
        if (!deletedFeatureFlag) {
            return res.status(404).json({ message: 'Feature flag not found' });
        }
        
        res.status(200).json(deletedFeatureFlag);
    } catch (error) {
        console.error(`Error deleting feature flag ID ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};
