/* @flow */

import Vue  from 'vue';
import Vuex from 'vuex';

import App   from './app.vue';
import store from '~/store';
import router from '~/routes';

Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
