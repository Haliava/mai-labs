import express from 'express'

import * as auditLogController from '../controllers/auditLogController.js'

export const logsRoutes = express.Router();

logsRoutes.get('/', auditLogController.getAuditLogs);
