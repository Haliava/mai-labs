import { invalidateCache, invalidateCacheByPattern, withCache } from './cacheService.js';

import { notifyFeatureFlagChange } from './notificationService.js';

// Уменьшаем время жизни кэша для feature flags (с 5 минут до 30 секунд)
const DEFAULT_TTL = 30;

/**
 * Функция для принудительной инвалидации всех кэшей, связанных с feature flags
 * @param {Number} organizationId - ID организации 
 */
const forceInvalidateAllFeatureFlagCaches = async (organizationId) => {
  console.log(`Invalidating feature flag caches for org ${organizationId}`);
  // Инвалидируем кэш конкретной организации
  await invalidateCache(`feature-flags:org:${organizationId}`);
  // Инвалидируем общий кэш всех feature flags
  await invalidateCache('feature-flags:all');
  // Также инвалидируем все кэши по шаблону (для случая, если есть другие связанные кэши)
  await invalidateCacheByPattern('feature-flag:*');
  await invalidateCacheByPattern('feature-flags:*');
};

const _createFeatureFlag = async (featureFlagRepository, auditLogRepository, featureFlagData, userId) => {
  const { name, description, status, organizationId } = featureFlagData;

  const newFeatureFlag = await featureFlagRepository.create({ name, description, status, organizationId });

  await auditLogRepository.create({
    userId,
    featureFlagId: newFeatureFlag.id,
    action: 'create',
    timestamp: new Date()
  });

  return newFeatureFlag;
};

const _getAllFeatureFlags = async (featureFlagRepository) => {
  return await featureFlagRepository.findAll();
};

const _getAllFeatureFlagsByOrgId = async (featureFlagRepository, orgId) => {
  return await featureFlagRepository.findByOrganization(orgId);
};

const _getFeatureFlagById = async (featureFlagRepository, id) => {
  return await featureFlagRepository.findById(id);
};

const _updateFeatureFlag = async (featureFlagRepository, id, auditLogRepository, updatedData, userId) => {
  const updatedFeatureFlag = await featureFlagRepository.update(id, updatedData);
  if (!updatedFeatureFlag) {
    throw new Error('Feature flag not found');
  }

  await auditLogRepository.create({
    userId,
    featureFlagId: id,
    action: 'update',
    timestamp: new Date()
  });

  return updatedFeatureFlag;
};

const _deleteFeatureFlag = async (featureFlagRepository, id, auditLogRepository, userId) => {
  console.log(id, userId)
  await auditLogRepository.create({
    userId,
    featureFlagId: id,
    action: 'delete',
    timestamp: new Date()
  });

  const deletedFeatureFlag = await featureFlagRepository.delete(id);
  if (!deletedFeatureFlag) {
    throw new Error('Feature flag not found');
  }

  return deletedFeatureFlag;
};

export const createFeatureFlag = async (featureFlagRepository, auditLogRepository, featureFlagData, userId) => {
  const featureFlag = await _createFeatureFlag(featureFlagRepository, auditLogRepository, featureFlagData, userId);
  
  // Используем новую функцию для принудительной инвалидации всех кэшей
  await forceInvalidateAllFeatureFlagCaches(featureFlag.organizationId);
  
  await notifyFeatureFlagChange(
    featureFlag.id,
    featureFlag.name,
    featureFlag.status,
    featureFlag.organizationId,
    featureFlag.description || 'Создан новый фичефлаг'
  );
  
  return featureFlag;
};

// Версии с кэшированием - уменьшен TTL
export const getAllFeatureFlags = withCache(
  _getAllFeatureFlags,
  () => 'feature-flags:all',
  DEFAULT_TTL,
);

export const getAllFeatureFlagsByOrgId = withCache(
  _getAllFeatureFlagsByOrgId,
  (featureFlagRepository, orgId) => `feature-flags:org:${orgId}`,
  DEFAULT_TTL,
);

export const getFeatureFlagById = withCache(
  _getFeatureFlagById,
  (featureFlagRepository, id) => `feature-flag:${id}`,
  DEFAULT_TTL,
);

export const updateFeatureFlag = async (featureFlagRepository, id, auditLogRepository, updatedData, userId) => {
  const oldFeatureFlag = await _getFeatureFlagById(featureFlagRepository, id);
  const updatedFeatureFlag = await _updateFeatureFlag(featureFlagRepository, id, auditLogRepository, updatedData, userId);
  
  // Используем новую функцию для принудительной инвалидации всех кэшей
  await forceInvalidateAllFeatureFlagCaches(updatedFeatureFlag.organizationId);
  
  if (oldFeatureFlag.status !== updatedFeatureFlag.status) {
    await notifyFeatureFlagChange(
      updatedFeatureFlag.id,
      updatedFeatureFlag.name,
      updatedFeatureFlag.status,
      updatedFeatureFlag.organizationId,
      updatedFeatureFlag.description || `Изменен статус фичефлага с ${oldFeatureFlag.status} на ${updatedFeatureFlag.status}`
    );
  }
  
  return updatedFeatureFlag;
};

export const deleteFeatureFlag = async (featureFlagRepository, id, auditLogRepository, userId) => {
  const featureFlag = await _getFeatureFlagById(featureFlagRepository, id);
  const deletedFeatureFlag = await _deleteFeatureFlag(featureFlagRepository, id, auditLogRepository, userId);
  
  if (featureFlag) {
    // Используем новую функцию для принудительной инвалидации всех кэшей
    await forceInvalidateAllFeatureFlagCaches(featureFlag.organizationId);
    
    await notifyFeatureFlagChange(
      id,
      featureFlag.name || 'unknown',
      false,
      featureFlag.organizationId,
      'Фичефлаг был удален'
    );
  }
  
  return deletedFeatureFlag;
};
