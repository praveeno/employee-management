// Handle HTTP errors since delete won't.
export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const emailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

export function convertNestedObjectToFlat(nestedObj) {
  return Object.keys(nestedObj).reduce((prev, objKey) => {
    let obj;
    const value = nestedObj[objKey];
    if (typeof value == 'object') {
      obj = Object.keys(value).reduce((previous, nestedKey) => {
        const obj = { [`${objKey}.${nestedKey}`]: value[nestedKey] };
        return { ...previous, ...obj };
      }, {});
    } else {
      obj = { [objKey]: value };
    }
    return { ...prev, ...obj };
  }, {});
}
// it will handle just 1 nesting for now
// making {"address.street": 1} => {"address": {"street": 1}}
export function convertFlatObjectToNested(flatObj) {
  return Object.keys(flatObj).reduce((prev, current) => {
    const nestedKeys = current.split('.');
    let prevBuiltObj = null;
    // here converting {"address.street": 1} => {"address": {"street": 1}}
    if (prev[nestedKeys[0]]) {
      prevBuiltObj = prev[nestedKeys[0]];
    }
    let _obj;
    if (nestedKeys.length > 1) {
      if (prevBuiltObj) {
        prev[nestedKeys[0]][nestedKeys[1]] = flatObj[current];
        prevBuiltObj = prev;
      } else {
        prevBuiltObj = { [nestedKeys[0]]: { [nestedKeys[1]]: flatObj[current] } };
      }
      _obj = prevBuiltObj;
    } else {
      _obj = { [current]: flatObj[current] };
    }

    return { ...prev, ..._obj };
  }, {});
}

export function containValue(obj) {
  const data = Object.values(obj);
  return data.some(val => val && val.length > 0);
}
