const conn = require('./conn');
const {getCustomFieldName} = require('../rest apis/zendesk').catchpointsystems;

const arraySetter = function(value){
  return function(val){
    if (Array.isArray(val)){
      val = val.join(',');
    }
    if (typeof val === 'object'){
      val = null;
    }
    this.setDataValue(value, val);
  };
};

const attrs = {
  id: { type: conn.Sequelize.BIGINT, primaryKey: true },
  type: conn.Sequelize.STRING,
  body: conn.Sequelize.TEXT,
  public: conn.Sequelize.BOOLEAN,
  subject: conn.Sequelize.STRING,
  previous_value: { type:
      conn.Sequelize.STRING,
    set: arraySetter('previous_value')
  },
  value: { type:
      conn.Sequelize.STRING,
    set: arraySetter('value')
  },
  field_name: conn.Sequelize.STRING,
  created_at: conn.Sequelize.DATE,
  updated_at: conn.Sequelize.DATE
};


const instanceMethods = {
  getCustomFieldName: function(){
    const fieldName = getCustomFieldName(this.field_name * 1);
    if (fieldName){
      return fieldName;
    }
    return this.field_name;
  }
};

const Events = conn.define('event', attrs, { underscored: true, timestamps: false, instanceMethods });

module.exports = Events;
