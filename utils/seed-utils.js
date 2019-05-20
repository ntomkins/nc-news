const timeToDate = data => {
  return data.map(item => {
    let dateStr = new Date(item.created_at);
    const { created_at, ...otherKeys } = item;
    otherKeys.created_at = dateStr;
    return otherKeys;
  });
};

const renameKey = (array, keyToChange, newKey) => {
  return array.map(obj => {
    const { [keyToChange]: oldKey, ...otherKeys } = obj;
    return { [newKey]: oldKey, ...otherKeys };
  });
};

const createRef = (array, key, value) => {
  return array.reduce((objRef, item) => {
    objRef[item[key]] = item[value];
    return objRef;
  }, {});
};

const refArray = (array, refObj, oldKey, newKey) => {
  return array.map(item => {
    item[newKey] = refObj[item[oldKey]];
    const { [oldKey]: changedKey, ...otherKeys } = item;
    return otherKeys;
  });
};

module.exports = { timeToDate, createRef, refArray, renameKey };
