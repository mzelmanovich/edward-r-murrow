const via = function({source}){
  if (source && source.rel === 'follow_up'){
    console.log(source.from.ticket_id);
    this.setDataValue('follow_up_id', source.from.ticket_id);
  }
};

module.exports = {
  via
};
