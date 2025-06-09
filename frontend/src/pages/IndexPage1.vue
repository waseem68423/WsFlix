<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h4 q-mb-md">Explore Our Products</div>

    <!-- 1. Loading State: Shown while fetching data -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="50px" />
      <p class="q-mt-md">Loading Products...</p>
    </div>

    <!-- 2. Data Loaded State: The main product grid -->
    <div v-else-if="products.length > 0" class="row q-col-gutter-lg">
      <!-- This loop will show every single product in the 'products' array -->
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="my-product-card" flat bordered>
          <!-- The image source must be the full URL to your backend -->
          <q-img 
            :src="`http://localhost:3000${product.imageUrl}`" 
            :ratio="1"
            class="product-image"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ product.name }}</div>
            <div class="text-caption text-grey">
              Category: {{ product.category }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1 text-weight-bold">${{ product.price }}</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat round color="primary" icon="add_shopping_cart" @click="addToCart(product)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
    <!-- 3. Empty State: Shown if the products array is empty after loading -->
    <div v-else class="text-center text-grey q-pa-xl">
      <q-icon name="sentiment_dissatisfied" size="4em" />
      <p class="text-h6 q-mt-md">No products found.</p>
      <p v-if="store.user && store.user.role === 'admin'">
        Go to the "Add Product" page to add some!
      </p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { store } from 'src/store/store';

const $q = useQuasar();
const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  try {
    // This makes the API call to your backend's /products endpoint
    const response = await api.get('/products');
    products.value = response.data; // Store the received array of products
  } catch (error) {
    console.error('Could not fetch products:', error);
    $q.notify({ color: 'negative', message: 'Could not load products from the server.' });
  } finally {
    loading.value = false; // Hide the loading spinner
  }
};

const addToCart = (product) => {
  store.addToCart(product);
  $q.notify({
    color: 'positive',
    icon: 'check_circle',
    message: `${product.name} added to cart`,
    position: 'top-right',
    timeout: 1000,
  });
};

// This Vue hook ensures that fetchProducts() is called as soon as the page is ready.
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.my-product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.my-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.q-card-section {
  flex-grow: 1;
}
.q-card-actions {
  flex-shrink: 0;
}
</style>