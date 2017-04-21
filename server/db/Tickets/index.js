const conn = require('../conn');

const attrs = {
  id: { type: conn.Sequelize.BIGINT, primaryKey: true },
  url: conn.Sequelize.STRING,
  external_id: conn.Sequelize.BIGINT,
  status: conn.Sequelize.STRING,
  type: conn.Sequelize.STRING,
  subject: conn.Sequelize.STRING,
  priority: conn.Sequelize.STRING,
  due_at: conn.Sequelize.DATEONLY,
  is_public: conn.Sequelize.BOOLEAN,
  created_at: conn.Sequelize.DATE,
  updated_at: conn.Sequelize.DATE,
  follow_up_id: conn.Sequelize.BIGINT,
  esc_tam: conn.Sequelize.STRING,
  esc_tt: conn.Sequelize.STRING,
  user_story_id: conn.Sequelize.STRING,
  esc_type: conn.Sequelize.STRING,
  esc_status: conn.Sequelize.STRING,
  category: conn.Sequelize.STRING,
  satisfaction_rating: conn.Sequelize.STRING
};

const setterMethods = require('./setterMethods');
const instanceMethods = require('./instanceMethods');

const Tickets = conn.define('ticket', attrs, { underscored: true, timestamps: false, setterMethods, instanceMethods });

module.exports = Tickets;
