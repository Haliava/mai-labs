export const createAuditLog = async (auditLogRepository, { userId, featureFlagId, action }) => {
  const timestamp = new Date();
  return await auditLogRepository.create({ userId, featureFlagId, action, timestamp });
};

export const getAuditLogs = async (auditLogRepository) => {
  return await auditLogRepository.findAll();
}
