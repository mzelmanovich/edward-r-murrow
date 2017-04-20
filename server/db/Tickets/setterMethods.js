const via = function({source}){
  if (source && source.rel === 'follow_up'){
    this.setDataValue('follow_up_id', source.from.ticket_id);
  }
};

module.exports = {
  via
};
