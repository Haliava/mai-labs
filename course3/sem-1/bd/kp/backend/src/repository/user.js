import { db } from '../../db.js'

class UserRepository {
    async create({ email, password, role }) {
        const query = `
            INSERT INTO users (email, password, role) 
            VALUES ($1, $2, $3) RETURNING *`;
        return await db.one(query, [email, password, role]);
    }

    async findAll() {
        const query = 'SELECT * FROM users';
        return await db.any(query);
    }

    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        return await db.oneOrNone(query, [id]);
    }

    async update(id, { email, password, role }) {
        const query = `
            UPDATE users 
            SET email = $1, password = $2, role = $3 
            WHERE id = $4 RETURNING *`;
        return await db.oneOrNone(query, [email, password, role, id]);
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        return await db.oneOrNone(query, [id]);
    }
}

export const userRepository = new UserRepository();
