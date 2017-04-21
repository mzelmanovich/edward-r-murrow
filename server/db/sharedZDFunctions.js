const getCustomFieldName = function(feildId){
  if (feildId === 23684505){
    return 'esc_type';
  }

  if (feildId === 23746995){
    return 'user_story_id';
  }

  if (feildId === 23778369){
    return 'esc_status';
  }

  if (feildId === 24667426){
    return 'esc_tam';
  }

  if (feildId === 24736606){
    return 'esc_tt';
  }

  if (feildId === 23308995){
    return 'category';
  }
  return null;
};

module.exports = {
  getCustomFieldName
};
