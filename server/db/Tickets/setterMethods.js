const {getCustomFieldName} = require('../sharedZDFunctions');

const via = function({source}){
  if (source && source.rel === 'follow_up'){
    this.setDataValue('follow_up_id', source.from.ticket_id);
  }
};

const custom_fields = function(fields){
  fields.forEach(({id, value}) => {
    const customeFieldName = getCustomFieldName(id);
    if (customeFieldName){
      return this.setDataValue(customeFieldName, value);
    }
  });
};

const satisfaction_rating = function({score}){
  this.setDataValue('satisfaction_rating', score);
};

module.exports = {
  via,
  custom_fields,
  satisfaction_rating
};
