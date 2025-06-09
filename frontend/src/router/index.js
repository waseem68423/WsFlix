import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { store } from '../store/store'; // Import our global store

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and change VUE_ROUTER_MODE in quasar.conf.js instead!
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // This is the navigation guard to protect routes
  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isLoggedIn = store.isLoggedIn;

    if (requiresAuth && !isLoggedIn) {
      // If a route requires you to be logged in, and you are not,
      // redirect to the login page.
      next({ name: 'Login' });
    } else {
      // Otherwise, allow the navigation to proceed.
      next();
    }
  });

  return Router;
});