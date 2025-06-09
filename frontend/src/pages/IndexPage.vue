<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <!-- Search Input -->
      <q-input
        v-model="filters.search"
        outlined
        dense
        placeholder="Search products..."
        class="col"
        @update:model-value="applyFilters"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Filter Toggle Button -->
      <q-btn
        flat
        round
        dense
        icon="filter_list"
        class="q-ml-md"
        @click="showFilters = !showFilters"
      />
    </div>

    <!-- Collapsible Filter Section -->
    <q-slide-transition>
      <div v-show="showFilters">
        <q-card class="q-mb-md" flat bordered>
          <q-card-section>
            <div class="text-h6">Filters</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="filters.category"
                  :options="categoryOptions"
                  label="Category"
                  outlined
                  dense
                  clearable
                  @update:model-value="applyFilters"
                />
              </div>
              <div class="col-12 col-sm-6">
                 <q-range
                  v-model="filters.price"
                  :min="0"
                  :max="500"
                  :step="10"
                  label-always
                  :left-label-value="`$${filters.price.min}`"
                  :right-label-value="`$${filters.price.max}`"
                  class="q-mt-lg"
                  @change="applyFilters"
                />
              </div>
            </div>
            <q-btn label="Reset Filters" flat color="primary" @click="resetFilters" class="q-mt-sm" />
          </q-card-section>
        </q-card>
      </div>
    </q-slide-transition>

    <!-- Product Grid Section -->
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>
    <div v-else-if="products.length > 0" class="row q-col-gutter-lg">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="my-product-card" flat bordered>
          <q-img :src="`http://localhost:3000${product.imageUrl}`" :ratio="1" />
          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ product.name }}</div>
            <div class="text-caption text-grey">Category: {{ product.category }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">${{ product.price }}</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat round color="primary" icon="add_shopping_cart" @click="addToCart(product)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center text-grey q-mt-xl">
      <q-icon name="search_off" size="4em" />
      <p>No products match your search or filters.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { store } from 'src/store/store';
import { debounce } from 'quasar';

const $q = useQuasar();
const products = ref([]);
const loading = ref(true);
const showFilters = ref(false);

const filters = ref({
  search: '',
  category: null,
  price: { min: 0, max: 500 },
});

const categoryOptions = ['Clothes', 'Electronics', 'Books', 'Home Goods'];

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      minPrice: filters.value.price.min,
      maxPrice: filters.value.price.max < 500 ? filters.value.price.max : undefined,
    };
    const response = await api.get('/products', { params });
    products.value = response.data;
  } catch (error) {
    console.error('Could not fetch products:', error);
    $q.notify({ color: 'negative', message: 'Could not fetch products.' });
  } finally {
    loading.value = false;
  }
};

const applyFilters = debounce(fetchProducts, 500);

const resetFilters = () => {
  filters.value = {
    search: '',
    category: null,
    price: { min: 0, max: 500 },
  };
  fetchProducts();
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

onMounted(fetchProducts);
</script>

<style scoped>
.my-product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.my-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
</style>