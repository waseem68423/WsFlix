<template>
  <q-page class="q-pa-lg">
    <div class="text-h4">Admin Dashboard</div><q-separator class="q-my-md" />
    <p>Welcome to the WsFlix administration panel.</p>
    <q-btn to="/admin/add-product" color="primary" icon="add" label="Add a New Product" unelevated />
    
    <div class="text-h5 q-mt-xl">Recent Orders</div>
    <div v-if="loading"><q-spinner-dots color="primary" size="40px" /></div>
    <q-list v-else bordered separator>
      <q-expansion-item v-for="order in orders" :key="order.id" group="orders">
        <template v-slot:header>
          <q-item-section>
            <q-item-label>Order #{{ order.id.substring(0, 8) }}</q-item-label>
            <q-item-label caption>{{ order.customerName }} - ${{ order.totalPrice }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :label="order.status" color="orange" />
          </q-item-section>
        </template>
        <q-card><q-card-section>
          <p><strong>Customer:</strong> {{ order.customerName }} ({{ order.user.username }})</p>
          <p><strong>Phone:</strong> {{ order.customerPhone }}</p>
          <p><strong>Address:</strong> {{ order.deliveryAddress }}</p>
          <q-separator class="q-my-sm" />
          <p><strong>Items:</strong></p>
          <ul><li v-for="item in order.items" :key="item.id">{{ item.product.name }} (Qty: {{ item.quantity }})</li></ul>
        </q-card-section></q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
const orders = ref([]);
const loading = ref(true);
onMounted(async () => {
  try { orders.value = (await api.get('/orders')).data; }
  catch (e) { console.error("Failed to fetch orders", e); }
  finally { loading.value = false; }
});
</script>