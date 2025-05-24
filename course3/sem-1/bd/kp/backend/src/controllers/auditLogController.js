import { auditLogRepository } from '../repository/audit_log.js';
import {
  getAuditLogs as getAuditLogsService
} from '../services/auditLogService.js';

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await getAuditLogsService(auditLogRepository);
    res.status(200).json(logs);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}