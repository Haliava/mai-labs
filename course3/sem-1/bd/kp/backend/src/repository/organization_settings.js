import { db } from '../../db.js';

class OrganizationSettingsRepository {
    async create({ organizationId, settingKey, settingValue }) {
        const query = `
            INSERT INTO organization_settings (organization_id, setting_key, setting_value)
            VALUES ($1, $2, $3) RETURNING *`;
        return await db.one(query, [organizationId, settingKey, settingValue]);
    }

    async findById(id) {
        const query = `SELECT * FROM organization_settings WHERE id = $1`;
        return await db.oneOrNone(query, [id]);
    }

    async findAllByOrganizationId(organizationId) {
        const query = `SELECT * FROM organization_settings WHERE organization_id = $1`;
        return await db.any(query, [organizationId]);
    }

    async update(id, updatedData) {
        const { settingKey, settingValue } = updatedData;
        const query = `
            UPDATE organization_settings
            SET setting_key = $1, setting_value = $2
            WHERE id = $3 RETURNING *`;
        return await db.oneOrNone(query, [settingKey, settingValue, id]);
    }

    async delete(id) {
        const query = `DELETE FROM organization_settings WHERE id = $1 RETURNING *`;
        return await db.oneOrNone(query, [id]);
    }
}

export const organizationSettingsRepository = new OrganizationSettingsRepository();
