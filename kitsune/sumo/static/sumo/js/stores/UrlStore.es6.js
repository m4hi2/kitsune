/* globals _:false */

/**
 * A shim to treat the URL query string as a Store. Listens to actions
 * to update the query string, including pushstate calls, and responds
 * to popstate events from the browser, translating them into store
 * update events.
 */

import BaseStore from './BaseStore.es6.js';
import Dispatcher from '../Dispatcher.es6.js';
import {actionTypes} from '../constants/UrlConstants.es6.js';
import {getQueryParamsAsDict, queryParamStringFromDict} from '../utils/urls.es6.js';

class _UrlStore extends BaseStore {
  get(key) {
    return getQueryParamsAsDict()[key];
  }
}

// Stores are singletons.
const UrlStore = new _UrlStore();

UrlStore.dispatchToken = Dispatcher.register((action) => {
  let params, qs;
  switch (action.type) {
    case actionTypes.UPDATE_QUERY_STRING:
      params = _.extend({}, getQueryParamsAsDict(), action.params);
      qs = queryParamStringFromDict(params);
      window.history.pushState(params, null, qs);
      UrlStore.emitChange();
      break;

    case actionTypes.UPDATE_QUERY_STRING_DEFAULTS:
      params = _.extend({}, action.params, getQueryParamsAsDict());
      qs = queryParamStringFromDict(params);
      window.history.replaceState(params, null, qs);
      UrlStore.emitChange();
      break;

    default:
      // do nothing
  }
});

/* When the user clicks back/forward, the store will return different
 * values, so notify all listeners. */
window.addEventListener('popstate', function() {
  UrlStore.emitChange();
});

export default UrlStore;
