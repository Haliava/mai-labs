import { db } from '../../db.js'

class UserOrganizationRepository {
    async addUserToOrganization(userId, organizationId) {
        const query = `
            INSERT INTO user_organization (user_id, organization_id)
            VALUES ($1, $2) RETURNING *`;
        return await db.one(query, [userId, organizationId]);
    }

    async removeUserFromOrganization(userId, organizationId) {
        const query = `
            DELETE FROM user_organization
            WHERE user_id = $1 AND organization_id = $2 RETURNING *`;
        return await db.oneOrNone(query, [userId, organizationId]);
    }

    async findOrganizationsByUser(userId) {
        const query = `
            SELECT o.* 
            FROM organizations o
            JOIN user_organization uo ON o.id = uo.organization_id
            WHERE uo.user_id = $1`;
        return await db.any(query, [userId]);
    }

    async findUsersByOrganization(organizationId) {
        const query = `
            SELECT u.* 
            FROM users u
            JOIN user_organization uo ON u.id = uo.user_id
            WHERE uo.organization_id = $1`;
        return await db.any(query, [organizationId]);
    }
}

export const userOrganizationRepository = new UserOrganizationRepository();
