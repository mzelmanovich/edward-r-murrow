const conn = require('./conn');
const zd = require('../../apis/Zendesk');

const attrs = {
    id: { type: conn.Sequelize.INTEGER, primaryKey: true },
    email: conn.Sequelize.STRING,
    name: conn.Sequelize.STRING,
    active: conn.Sequelize.BOOLEAN,
    role: conn.Sequelize.STRING,
    created_at: conn.Sequelize.DATE,
    updated_at: conn.Sequelize.DATE
};

const Users = conn.define('user', attrs, { underscored: true, timestamps: false });

module.exports = Users;
