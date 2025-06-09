<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 q-mb-xs">Admin Dashboard</div>
    <p class="text-grey-7">Welcome to the WsFlix administration panel.</p>
    
    <q-btn 
      to="/admin/add-product" 
      color="primary" 
      icon="add" 
      label="Add a New Product" 
      unelevated 
      class="q-my-md"
    />

    <q-separator class="q-mb-lg" />

    <div class="text-h5 q-mb-md">Recent Orders</div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <p class="q-mt-md">Loading orders...</p>
    </div>

    <!-- No Orders State -->
    <div v-else-if="orders.length === 0" class="text-center text-grey q-pa-xl">
      <q-icon name="inbox" size="4em" />
      <p class="q-mt-md text-h6">No orders have been placed yet.</p>
    </div>

    <!-- Orders Display State -->
    <div v-else class="q-gutter-y-md">
      <!-- We use q-expansion-item to make a nice collapsible list -->
      <q-expansion-item
        v-for="order in orders"
        :key="order.id"
        group="orders"
        class="shadow-1 overflow-hidden"
        style="border-radius: 8px"
        header-class="bg-white"
        expand-icon-class="text-primary"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="receipt_long" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ order.customerName }}</q-item-label>
            <q-item-label caption>
              Order #{{ order.id.substring(0, 8) }} • Total: ${{ order.totalPrice }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <q-chip :label="order.status" color="orange-6" text-color="white" size="sm" class="text-weight-bold" />
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="bg-grey-1">
            <div class="text-h6 q-mb-sm">Order Details</div>
            <p><strong>Date Placed:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
            <p><strong>Deliver To:</strong> {{ order.deliveryAddress }}</p>
            <p><strong>Customer Phone:</strong> {{ order.customerPhone }}</p>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 text-weight-medium">Items Ordered:</div>
            <q-list bordered separator class="q-mt-sm">
              <q-item v-for="item in order.items" :key="item.productId">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>Price: ${{ item.price }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>Qty: {{ item.quantity }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const orders = ref([]);
const loading = ref(true);

// This function will fetch all orders from the backend
const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    orders.value = response.data;
  } catch (error) {
    console.error("Failed to fetch orders", error);
    $q.notify({
      color: 'negative',
      message: 'Could not load orders. Please try again later.'
    });
  } finally {
    loading.value = false;
  }
};

// onMounted is a lifecycle hook that runs automatically when the page loads
onMounted(() => {
  fetchOrders();
});
</script>