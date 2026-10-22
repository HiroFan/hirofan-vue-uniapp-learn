<script setup>
import { watch } from 'vue'

defineOptions({ name: 'SearchBar' })

const keyword = defineModel('keyword', { type: String, default: '' })
const loading = defineModel('loading', { type: Boolean, default: false })

const emit = defineEmits(['search'])

let timer = null
watch(keyword, (val) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      emit('search', val)
    }, 600)
  }, 300)
})
</script>

<template>
  <div class="search-bar">
    <input
      v-model="keyword"
      type="text"
      placeholder="输入内容，debounce 300ms 后触发..."
      class="sb-input"
    />
    <div v-if="loading" class="sb-indicator">
      <span class="sb-spinner"></span> 搜索中
    </div>
    <div v-else class="sb-indicator idle">✓ 就绪</div>
  </div>
</template>

<style scoped>
.search-bar { display: flex; align-items: center; gap: 10px; background: #f9fafb; border: 1px solid #ebeef5; border-radius: 10px; padding: 10px 14px; }
.sb-input { flex: 1; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 6px; font-size: 13px; outline: none; }
.sb-input:focus { border-color: #42b883; }
.sb-indicator { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #42b883; white-space: nowrap; min-width: 72px; }
.sb-indicator.idle { color: #909399; }
.sb-spinner { width: 12px; height: 12px; border: 2px solid #ebeef5; border-top-color: #42b883; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>