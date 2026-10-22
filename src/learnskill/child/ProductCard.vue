<script setup>
defineOptions({ name: 'ProductCard' })

const props = defineProps({
  product: { type: Object, required: true },
  discount: { type: Number, default: 1 },
  source: { type: String, default: 'unknown' },
  level: { type: String, validator: (v) => ['A', 'B', 'C', undefined].includes(v) }
})

const emit = defineEmits({
  buy: { type: Number },
  add: null,
  'clear-stock': { type: Boolean, required: true }
})

const finalPrice = () => (props.product.price * props.discount).toFixed(2)
const buy = () => emit('buy', props.product.id)
</script>

<template>
  <div class="product-card">
    <div class="p-icon">🎧</div>
    <div class="p-info">
      <div class="p-name">{{ product.name }}</div>
      <div class="p-price">
        <span class="old">¥{{ product.price }}</span>
        <span class="now">¥{{ finalPrice() }}</span>
        <span v-if="discount < 1" class="tag-offer">-{{ Math.round((1-discount)*100) }}%</span>
      </div>
      <div class="p-meta">库存: {{ product.stock }} · source: <code>{{ source }}</code></div>
    </div>
    <button class="btn-buy" :disabled="product.stock === 0" @click="buy">
      {{ product.stock === 0 ? '已售罄' : '立即购买' }}
    </button>
  </div>
</template>

<style scoped>
.product-card { display: flex; align-items: center; gap: 14px; background: #fafbfc; border: 1px solid #ebeef5; border-radius: 10px; padding: 14px; }
.p-icon { width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); display: flex; align-items: center; justify-content: center; font-size: 26px; }
.p-info { flex: 1; }
.p-name { font-size: 15px; font-weight: 600; color: #1a1a1a; }
.p-price { margin-top: 4px; display: flex; align-items: baseline; gap: 8px; }
.p-price .old { text-decoration: line-through; color: #c0c4cc; font-size: 12px; }
.p-price .now { color: #f56c6c; font-size: 18px; font-weight: 700; }
.tag-offer { background: #fef3c7; color: #d97706; font-size: 11px; padding: 1px 6px; border-radius: 4px; }
.p-meta { font-size: 11px; color: #909399; margin-top: 4px; }
.p-meta code { background: #f0f2f5; padding: 0 4px; border-radius: 3px; font-size: 11px; }
.btn-buy { padding: 8px 16px; border: none; border-radius: 6px; background: #42b883; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; }
.btn-buy:hover:not(:disabled) { background: #359a6b; }
.btn-buy:disabled { background: #d1d5db; cursor: not-allowed; }
</style>