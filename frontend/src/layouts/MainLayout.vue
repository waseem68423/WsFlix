<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-deep-purple-8">
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration: none; font-weight: bold;">
            WsFlix
          </router-link>
        </q-toolbar-title>
        <q-space />
        <q-btn flat round dense to="/cart" class="q-mr-md">
          <q-badge color="orange" floating transparent v-if="store.cartCount > 0">
            {{ store.cartCount }}
          </q-badge>
          <q-icon name="shopping_cart" />
        </q-btn>
        
        <!-- Not Logged In View: Buttons to open the dialog -->
        <div v-if="!store.isLoggedIn">
          <q-btn flat dense @click="showAuthDialog('login')" label="Login" class="q-mr-sm" />
          <q-btn color="orange" unelevated @click="showAuthDialog('register')" label="Register" />
        </div>
        
        <!-- Logged In View -->
        <div v-else>
          <q-btn-dropdown flat dense :label="`Hi, ${store.user.name}`">
            <q-list>
              <!-- Admin-Only Links -->
              <template v-if="store.isAdmin">
                <q-item clickable v-close-popup to="/admin">
                  <q-item-section><q-item-label>Admin Dashboard</q-item-label></q-item-section>
                </q-item>
                <q-item clickable v-close-popup to="/admin/add-product">
                  <q-item-section><q-item-label>Add Product</q-item-label></q-item-section>
                </q-item>
              </template>

              <!-- Customer-Only Links -->
              <template v-else>
                 <q-item clickable v-close-popup to="/">
                  <q-item-section><q-item-label>Explore Products</q-item-label></q-item-section>
                </q-item>
                 <q-item clickable v-close-popup to="/my-orders">
                  <q-item-section><q-item-label>My Orders</q-item-label></q-item-section>
                </q-item>
              </template>

              <q-separator />

              <!-- Logout for Everyone -->
              <q-item clickable v-close-popup @click="logout">
                <q-item-section><q-item-label>Logout</q-item-label></q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

      </q-toolbar>
    </q-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- The Auth Dialog Component, controlled by this layout -->
    <AuthDialog v-model="authDialogOpen" :start-tab="authDialogTab" />

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from 'src/store/store';
import AuthDialog from 'components/AuthDialog.vue'; // Import the new component

const router = useRouter();
const authDialogOpen = ref(false);
const authDialogTab = ref('login');

const showAuthDialog = (tab) => {
  authDialogTab.value = tab;
  authDialogOpen.value = true;
};

const logout = () => {
  store.logout();
  router.push('/'); // Go to homepage after logout
};
</script>