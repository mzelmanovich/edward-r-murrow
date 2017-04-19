const conn = require('../conn');

const attrs = {
    id: { type: conn.Sequelize.INTEGER, primaryKey: true },
    url: conn.Sequelize.STRING,
    external_id: conn.Sequelize.INTEGER,
    status: conn.Sequelize.STRING,
    type: conn.Sequelize.STRING,
    subject: conn.Sequelize.STRING,
    priority: conn.Sequelize.STRING,
    due_at: conn.Sequelize.DATEONLY,
    is_public: conn.Sequelize.BOOLEAN,
    created_at: conn.Sequelize.DATE,
    updated_at: conn.Sequelize.DATE
};

const Tickets = conn.define('ticket', attrs, { underscored: true, timestamps: false });

module.exports = Tickets;
