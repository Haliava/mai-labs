import { db } from '../../db.js'

class AuditLogRepository {
    async create({ userId, featureFlagId, action, timestamp }) {
        console.log(userId, featureFlagId, action, timestamp )
        const query = `
            INSERT INTO audit_logs (user_id, feature_flag_id, action, timestamp)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        return await db.one(query, [userId, featureFlagId, action, timestamp]);
    }

    async findAll() {
        const query =  `SELECT * FROM audit_logs`;
        return await db.manyOrNone(query);
    }
}

export const auditLogRepository = new AuditLogRepository();
