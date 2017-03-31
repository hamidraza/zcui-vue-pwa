import Vue       from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/**
 * Import all pages here
 */
import homePage from '~/pages/home';

const routes = [
  { path: '/', component: homePage, name: 'HomePage' },
];

export default new VueRouter({
  mode: 'history',
  routes
});
