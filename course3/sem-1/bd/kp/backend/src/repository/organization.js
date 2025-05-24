import { db } from '../../db.js'

class OrganizationRepository {
    async create({ name }) {
        const query = `
            INSERT INTO organizations (name) 
            VALUES ($1) RETURNING *`;
        return await db.one(query, [name]);
    }

    async findAll() {
        const query = 'SELECT * FROM organizations';
        return await db.any(query);
    }

    async findById(id) {
        const query = 'SELECT * FROM organizations WHERE id = $1';
        return await db.oneOrNone(query, [id]);
    }

    async update(id, { name }) {
        const query = `
            UPDATE organizations 
            SET name = $1 
            WHERE id = $2 RETURNING *`;
        return await db.oneOrNone(query, [name, id]);
    }

    async delete(id) {
        const query = 'DELETE FROM organizations WHERE id = $1 RETURNING *';
        return await db.oneOrNone(query, [id]);
    }
}

export const organizationRepository = new OrganizationRepository();
