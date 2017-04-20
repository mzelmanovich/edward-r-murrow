const conn = require('./conn');

const attrs = {
  id: { type: conn.Sequelize.BIGINT, primaryKey: true },
  name: conn.Sequelize.STRING,
  created_at: conn.Sequelize.DATE,
  updated_at: conn.Sequelize.DATE
};

const Organizations = conn.define('organization', attrs, { underscored: true, timestamps: false });

module.exports = Organizations;
