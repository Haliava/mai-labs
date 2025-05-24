DROP TABLE IF EXISTS user_organization;
DROP TABLE IF EXISTS organization_settings;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS access_controls;
DROP TABLE IF EXISTS feature_flags;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS organizations;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN NOT NULL,
    organization_id INTEGER NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    feature_flag_id INTEGER NOT NULL,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (feature_flag_id) REFERENCES feature_flags(id) ON DELETE CASCADE
);

CREATE TABLE access_controls (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    permissions VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE user_organization (
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, organization_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE organization_settings (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
