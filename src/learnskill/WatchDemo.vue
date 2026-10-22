<script setup>
import { ref, reactive, watch, watchEffect } from 'vue'

const logs = ref([])
const addLog = (msg) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift(`[${time}] ${msg}`)
}

const count = ref(0)
watch(count, (newVal, oldVal) => {
  addLog(`【1.基础】count 从 ${oldVal} 变为 ${newVal}`)
})

const user = reactive({ firstName: '张', lastName: '三' })
watch(() => user.firstName + user.lastName, (newVal, oldVal) => {
  addLog(`【2.getter】用户名从 "${oldVal}" 变为 "${newVal}"`)
})

const age = ref(18)
watch([count, age], ([newCount, newAge], [oldCount, oldAge]) => {
  addLog(`【3.多源】count: ${oldCount}→${newCount}, age: ${oldAge}→${newAge}`)
})

const state = reactive({ nested: { value: 0 } })
watch(state, () => {
  addLog(`【4.deep】state.nested.value 变为 ${state.nested.value}`)
}, { deep: true })

const keyword = ref('')
watch(keyword, (newVal) => {
  addLog(`【5.immediate】搜索关键字: "${newVal}"`)
}, { immediate: true })

const score = ref(60)
watchEffect(() => {
  const level = score.value >= 60 ? '及格' : '不及格'
  addLog(`【6.watchEffect】分数 ${score.value} → ${level}`)
})
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <h1>Vue 3 watch / watchEffect 讲解案例</h1>
      <p class="subtitle">点击左侧卡片的按钮，右侧日志面板实时展示 watch 触发情况</p>
    </header>

    <div class="layout">
      <!-- 左侧：案例卡片 -->
      <div class="cards">
        <section class="card">
          <div class="card-title">
            <span class="tag">1</span>
            <span>监听 ref 基础用法</span>
          </div>
          <div class="card-body">
            <div class="val-display">
              <span class="label">count</span>
              <span class="value">{{ count }}</span>
            </div>
            <p class="hint">回调参数 <code>(newVal, oldVal)</code></p>
            <div class="actions">
              <button class="btn-primary" @click="count++">count +1</button>
              <button class="btn-ghost" @click="count = 0">重置</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <span class="tag">2</span>
            <span>监听 getter</span>
          </div>
          <div class="card-body">
            <div class="val-display">
              <span class="label">用户名</span>
              <span class="value">{{ user.firstName }}{{ user.lastName }}</span>
            </div>
            <p class="hint">监听派生值而非原始属性</p>
            <div class="actions">
              <button class="btn-primary" @click="user.firstName = '李'">改姓"李"</button>
              <button class="btn-ghost" @click="user.lastName = '四'">改名"四"</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <span class="tag">3</span>
            <span>监听多个源</span>
          </div>
          <div class="card-body">
            <div class="val-row">
              <div class="val-display"><span class="label">count</span><span class="value">{{ count }}</span></div>
              <div class="val-display"><span class="label">age</span><span class="value">{{ age }}</span></div>
            </div>
            <p class="hint">任一变化都会触发</p>
            <div class="actions">
              <button class="btn-primary" @click="age++">age +1</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <span class="tag">4</span>
            <span>deep 深度监听</span>
          </div>
          <div class="card-body">
            <div class="val-display">
              <span class="label">nested.value</span>
              <span class="value">{{ state.nested.value }}</span>
            </div>
            <p class="hint">需加 <code>{ deep: true }</code></p>
            <div class="actions">
              <button class="btn-primary" @click="state.nested.value++">value +1</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <span class="tag">5</span>
            <span>immediate 立即执行</span>
          </div>
          <div class="card-body">
            <div class="val-display">
              <span class="label">关键字</span>
              <span class="value keyword">"{{ keyword }}"</span>
            </div>
            <input v-model="keyword" class="input" placeholder="输入搜索关键字" />
            <p class="hint">组件挂载时就触发一次</p>
          </div>
        </section>

        <section class="card">
          <div class="card-title">
            <span class="tag">6</span>
            <span>watchEffect</span>
          </div>
          <div class="card-body">
            <div class="val-display">
              <span class="label">score</span>
              <span class="value">{{ score }}</span>
            </div>
            <p class="hint">自动收集依赖，立即执行</p>
            <div class="actions">
              <button class="btn-primary" @click="score += 10">+10</button>
              <button class="btn-ghost" @click="score -= 10">-10</button>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧：日志面板 -->
      <aside class="log-panel">
        <div class="log-header">
          <h3>📋 监听日志</h3>
          <button class="btn-ghost" @click="logs = []">清空</button>
        </div>
        <div class="log-body" ref="logBody">
          <div v-if="logs.length === 0" class="log-empty">点击左侧按钮开始触发 watch</div>
          <div v-for="(log, i) in logs" :key="i" class="log-item">{{ log }}</div>
        </div>
        <div class="log-footer">共 {{ logs.length }} 条记录</div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.demo-page {
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #1a1a1a;
}

.page-header .subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 18px 20px;
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
  margin-bottom: 14px;
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

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.val-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 14px;
}

.val-display .label {
  color: #909399;
  font-family: "SF Mono", Consolas, monospace;
}

.val-display .value {
  color: #42b883;
  font-weight: 600;
  font-size: 16px;
}

.val-display .value.keyword {
  color: #e6a23c;
}

.val-row {
  display: flex;
  gap: 10px;
}

.val-row .val-display {
  flex: 1;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #c0c4cc;
}

.hint code {
  background: #f0f2f5;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #e6a23c;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 7px 16px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: #359a6b;
}

.btn-ghost {
  padding: 7px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-ghost:hover {
  border-color: #42b883;
  color: #42b883;
}

.input {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

.input:focus {
  border-color: #42b883;
}

/* 右侧日志面板 */
.log-panel {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 10px;
  overflow: hidden;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #313244;
}

.log-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.log-header .btn-ghost {
  border-color: #585b70;
  color: #cdd6f4;
  background: transparent;
}

.log-header .btn-ghost:hover {
  border-color: #42b883;
  color: #42b883;
}

.log-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  font-size: 12.5px;
  font-family: "SF Mono", Consolas, "Courier New", monospace;
  line-height: 1.7;
}

.log-empty {
  color: #6c7086;
  text-align: center;
  padding: 30px 0;
}

.log-item {
  padding: 4px 0;
  border-bottom: 1px dashed #313244;
}

.log-item:last-child {
  border-bottom: none;
}

.log-footer {
  padding: 10px 18px;
  background: #313244;
  font-size: 12px;
  color: #6c7086;
  text-align: right;
}

/* 响应式 */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .cards {
    grid-template-columns: 1fr;
  }
  .log-panel {
    position: static;
    max-height: none;
  }
}
</style>