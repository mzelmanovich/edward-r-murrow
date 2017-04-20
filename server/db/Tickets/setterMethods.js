const via = function({source}){
  if (source && source.rel === 'follow_up'){
    this.setDataValue('follow_up_id', source.from.ticket_id);
  }
};

const custom_fields = function(fields){
  fields.forEach(({id, value}) => {
    if (id === 23684505){
      return this.setDataValue('esc_type', value);
    }

    if (id === 23746995){
      return this.setDataValue('user_story_id', value);
    }

    if (id === 23778369){
      return this.setDataValue('esc_status', value);
    }

    if (id === 24667426){
      return this.setDataValue('esc_tam', value);
    }

    if (id === 24736606){
      return this.setDataValue('esc_tt', value);
    }

    if (id === 23308995){
      return this.setDataValue('category', value);
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
