import { db } from '../../db.js';

class FeatureFlagRepository {
    async create({ name, description, status, organizationId }) {
        const query = `
            INSERT INTO feature_flags (name, description, status, organization_id)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        return await db.one(query, [name, description, status, organizationId]);
    }

    async findAll() {
        const query = 'SELECT * FROM feature_flags';
        return await db.any(query);
    }

    async findById(id) {
        const query = 'SELECT * FROM feature_flags WHERE id = $1';
        return await db.oneOrNone(query, [id]);
    }

    async findByOrganization(organizationId) {
        const query = `
            SELECT * FROM feature_flags 
            WHERE organization_id = $1`;
        return await db.manyOrNone(query, [organizationId]);
    }

    async findByOrganizationAndName(organizationId, name) {
        const query = `
            SELECT * FROM feature_flags 
            WHERE organization_id = $1 and name = $2`;
        return await db.manyOrNone(query, [organizationId, name]);
    }

    async update(id, { name, description, status }) {
        const query = `
            UPDATE feature_flags 
            SET name = $1, description = $2, status = $3
            WHERE id = $4 RETURNING *`;
        return await db.oneOrNone(query, [name, description, status, id]);
    }

    async delete(id) {
        const query = 'DELETE FROM feature_flags WHERE id = $1 RETURNING *';
        return await db.oneOrNone(query, [id]);
    }
}

export const featureFlagRepository = new FeatureFlagRepository();
