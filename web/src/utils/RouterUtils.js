/* global window */
export function isObject(str) {
  return str instanceof Object;
}

export function getJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function getJSONString(json) {
  try {
    return JSON.stringify(json);
  } catch (e) {
    return json[0];
  }
}

export function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function getQueryStringObj(querySegments) {
  const qsLen = querySegments.length;
  const qs = qsLen > 1 ? querySegments[1] : '';
  if (qs !== '') {
    const hasQuery = qs
      .split('&')
      .filter(s => s)
      .reduce((obj, keyValue) => {
        const [key, value] = keyValue.split('=');
        return { ...obj, [key]: getJSON(value) };
      }, {});
    return hasQuery;
  }
  return {};
}

export function constructUrl(route, location) {
  const { path } = route;
  const query = route.query || {};
  const ignoredQueryKeys = {};

  const segments = path.split('/').map((segment) => {
    if (segment.indexOf(':') === 0) {
      const key = segment.slice(1);
      ignoredQueryKeys[key] = 1;
      return query[key];
    }

    return segment;
  });
  const hasQuery = location === '' ? '' : getQueryStringObj(window.location.href.split('?'));
  const queryString = Object.keys(query)
    .filter(key => !(key in ignoredQueryKeys))
    .reduce((s, key, i) => {
      let value = '';
      const newQuery = isJSON(query[key]) ? getJSON(query[key]) : query[key];
      if (Object.keys(hasQuery).indexOf(key) > -1) {
        if (newQuery) {
          if (hasQuery[key].id !== newQuery.id) {
            value = hasQuery[key];
          }
        }
      }
      if (newQuery !== undefined && isObject(newQuery)) {
        value = newQuery;
        return `${s}${i !== 0 ? '&' : ''}${key}=${getJSONString(value)}`;
      }
      return `${s}${i !== 0 ? '&' : ''}${key}=${query[key]}`;
    }, '');
  return `${segments.join('/')}${queryString ? `?${queryString}` : ''}`;
}
