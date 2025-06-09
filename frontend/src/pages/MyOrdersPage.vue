<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 q-mb-lg">My Orders</div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <p class="q-mt-md">Loading your orders...</p>
    </div>

    <!-- No Orders State -->
    <div v-else-if="orders.length === 0" class="text-center text-grey q-pa-xl">
      <q-icon name="receipt_long" size="4em" />
      <p class="q-mt-md text-h6">You haven't placed any orders yet.</p>
      <q-btn to="/" color="primary" label="Start Shopping" unelevated />
    </div>

    <!-- Orders Display State -->
    <div v-else class="q-gutter-y-md">
      <q-card v-for="order in orders" :key="order.id" flat bordered>
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-bold">Order #{{ order.id.substring(0, 8) }}</div>
              <div class="text-caption text-grey">Placed on {{ new Date(order.createdAt).toLocaleDateString() }}</div>
            </div>
            <q-chip :label="order.status" :color="getStatusColor(order.status)" text-color="white" size="sm" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list>
            <q-item v-for="item in order.items" :key="item.productId" class="q-py-sm">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>Qty: {{ item.quantity }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-medium">${{ (item.price * item.quantity).toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-right">
          <div class="text-h6">Total: ${{ order.totalPrice }}</div>
        </q-card-section>
      </q-card>
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

const fetchUserOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    orders.value = response.data;
  } catch (error) {
    console.error("Failed to fetch user orders", error);
    $q.notify({
      color: 'negative',
      message: 'Could not load your orders.'
    });
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status) => {
  if (status === 'Done') return 'positive';
  if (status === 'Shipped') return 'blue';
  if (status === 'Canceled') return 'negative';
  return 'orange-6'; // Default for 'Pending'
};

onMounted(() => {
  fetchUserOrders();
});
</script>