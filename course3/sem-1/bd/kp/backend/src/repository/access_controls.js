import { db } from '../../db.js'

class AccessControlRepository {
    async create({ userId, organizationId, permissions }) {
        const query = `
            INSERT INTO access_controls (user_id, organization_id, permissions)
            VALUES ($1, $2, $3) RETURNING *`;
        return await db.one(query, [userId, organizationId, permissions]);
    }

    async findAll() {
        const query = 'SELECT * FROM access_controls';
        return await db.any(query);
    }

    async findById(id) {
      const query = 'SELECT * FROM access_controls WHERE id = $1';
      return await db.oneOrNone(query, [id]);
    } 

    async findByUserId(userId) {
        const query = `SELECT * FROM access_controls WHERE user_id = $1`;
        return await db.oneOrNone(query, [userId]);
    }

    async update(id, { permissions }) {
        const query = `
            UPDATE access_controls 
            SET permissions = $1 
            WHERE id = $2 RETURNING *`;
        return await db.oneOrNone(query, [permissions, id]);
    }

    async delete(id) {
        const query = 'DELETE FROM access_controls WHERE id = $1 RETURNING *';
        return await db.oneOrNone(query, [id]);
    }
}

export const accessControlRepository = new AccessControlRepository();
