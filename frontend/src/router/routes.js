const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // The login and register routes are now removed.
      { path: '', name: 'Home', component: () => import('pages/IndexPage.vue') },
      { path: 'cart', name: 'Cart', component: () => import('pages/CartPage.vue') },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('pages/CheckoutPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'order-success',
        name: 'OrderSuccess',
        component: () => import('pages/OrderSuccessPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'my-orders',
        name: 'MyOrders',
        component: () => import('pages/MyOrdersPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: () => import('pages/Admin/AdminDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'admin/add-product',
        name: 'AddProduct',
        component: () => import('pages/Admin/AddProduct.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;