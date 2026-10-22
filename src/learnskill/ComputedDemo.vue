<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const list = ref([1, 2, 3, 4, 5, 6, 7, 8])
const filterList = computed(() => list.value.filter(item => item > 2))
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <h1>Vue 3 computed 讲解案例</h1>
      <p class="subtitle">computed 是响应式的派生状态，有缓存，依赖不变则不重算</p>
    </header>

    <div class="cards">
      <section class="card">
        <div class="card-title">
          <span class="tag">1</span>
          <span>基础计算属性</span>
        </div>
        <div class="card-body">
          <div class="val-display">
            <span class="label">count</span>
            <span class="value">{{ count }}</span>
          </div>
          <div class="val-display">
            <span class="label">doubleCount</span>
            <span class="value">{{ doubleCount }}</span>
          </div>
          <p class="hint">doubleCount = count × 2</p>
          <div class="actions">
            <button class="btn-primary" @click="count++">count +1</button>
            <button class="btn-ghost" @click="count = 0">重置</button>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-title">
          <span class="tag">2</span>
          <span>列表过滤</span>
        </div>
        <div class="card-body">
          <div class="val-display column">
            <span class="label">原始 list</span>
            <span class="value mono">[{{ list.join(', ') }}]</span>
          </div>
          <div class="val-display column">
            <span class="label">filter (item > 2)</span>
            <span class="value mono green">[{{ filterList.join(', ') }}]</span>
          </div>
          <div class="actions">
            <button class="btn-primary" @click="list.push(list.length + 1)">添加元素</button>
            <button class="btn-ghost" @click="list = ref([1,2,3,4,5,6,7,8])">重置</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-page { width: 100%; }

.page-header { text-align: center; margin-bottom: 28px; }
.page-header h1 { margin: 0 0 8px; font-size: 26px; color: #1a1a1a; }
.page-header .subtitle { margin: 0; color: #909399; font-size: 14px; }

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 20px 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(66, 184, 131, 0.12);
  transform: translateY(-2px);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #303133;
  margin-bottom: 16px;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #42b883;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  flex-shrink: 0;
}

.card-body { display: flex; flex-direction: column; gap: 12px; }

.val-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.val-display.column { flex-direction: column; align-items: flex-start; gap: 6px; }

.val-display .label { color: #909399; font-family: "SF Mono", Consolas, monospace; font-size: 13px; }
.val-display .value { color: #42b883; font-weight: 600; font-size: 16px; }
.val-display .value.mono { font-family: "SF Mono", Consolas, monospace; font-size: 14px; color: #303133; }
.val-display .value.green { color: #42b883; font-weight: 600; }

.hint { margin: 0; font-size: 12px; color: #c0c4cc; }

.actions { display: flex; gap: 8px; flex-wrap: wrap; }

.btn-primary {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: #359a6b; }

.btn-ghost {
  padding: 8px 18px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: #42b883; color: #42b883; }

@media (max-width: 700px) {
  .cards { grid-template-columns: 1fr; }
}
</style>