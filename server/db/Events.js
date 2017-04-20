const conn = require('./conn');

const attrs = {
  id: { type: conn.Sequelize.BIGINT, primaryKey: true },
  type: conn.Sequelize.STRING,
  body: conn.Sequelize.TEXT,
  public: conn.Sequelize.BOOLEAN,
  subject: conn.Sequelize.STRING,
  previous_value: { type:
      conn.Sequelize.STRING,
    set: function(val){
        if (Array.isArray(val)){
          val = val.join(',');
        }
        this.setDataValue('previous_value', val);
      }
  },
  value: { type:
      conn.Sequelize.STRING,
    set: function(val){
        if (Array.isArray(val)){
          val = val.join(',');
        }
        this.setDataValue('value', val);
      }
  },
  field_name: conn.Sequelize.STRING,
  created_at: conn.Sequelize.DATE,
  updated_at: conn.Sequelize.DATE
};


const Events = conn.define('event', attrs, { underscored: true, timestamps: false });

module.exports = Events;
