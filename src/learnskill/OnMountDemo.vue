<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue'

const logs = ref([])
const addLog = (msg) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, msg })
  if (logs.value.length > 30) logs.value.pop()
}

const now = ref('')
const tick = ref(0)
let timer = null

onBeforeMount(() => {
  addLog('🟡 onBeforeMount — 组件即将挂载')
})

onMounted(() => {
  addLog('🟢 onMounted — 组件已挂载 ✅')
  now.value = new Date().toLocaleString()
  timer = setInterval(() => {
    tick.value++
  }, 1000)
})

onUnmounted(() => {
  addLog('🔴 onUnmounted — 组件已卸载')
  if (timer) clearInterval(timer)
})

const mountedCount = ref(0)
onMounted(() => { mountedCount.value++ })

const inputVal = ref('')
const inputEl = ref(null)
const focusInput = () => {
  inputEl.value?.focus()
  addLog('📌 通过 template ref 聚焦输入框')
}

const fetchedData = ref(null)
const loading = ref(false)
const fetchData = () => {
  loading.value = true
  addLog('🌐 模拟请求开始...')
  setTimeout(() => {
    fetchedData.value = {
      id: Math.floor(Math.random() * 1000),
      name: '商品-' + Math.floor(Math.random() * 999),
      price: (Math.random() * 100).toFixed(2),
      time: new Date().toLocaleTimeString()
    }
    loading.value = false
    addLog('✅ 请求完成，数据已更新')
  }, 1200)
}
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <h1>Vue 3 onMounted 生命周期</h1>
      <p class="subtitle">组件挂载完成后执行的钩子 —— 最常用的生命周期之一</p>
      <div class="meta-row">
        <span class="meta">onMounted 执行次数: <b>{{ mountedCount }}</b></span>
      </div>
    </header>

    <div class="cards">
      <section class="card">
        <div class="card-title">
          <span class="tag green">onMounted</span>
          <span>1. 基础触发时机</span>
        </div>
        <div class="card-body">
          <p class="explain">组件第一次在 DOM 中<strong>渲染完成后</strong>触发，此时可以安全访问 DOM。</p>
          <div class="demo-box">
            <div class="demo-row"><span>当前时间：</span><code>{{ now || '等待 onMounted...' }}</code></div>
            <div class="demo-row"><span>计时器：</span><code>{{ tick }} 秒</code></div>
            <p class="hint">打开页面 → 观察右侧日志面板 → onMounted 自动触发</p>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-title">
          <span class="tag blue">template ref</span>
          <span>2. 在 onMounted 中访问 DOM</span>
        </div>
        <div class="card-body">
          <p class="explain"><code>ref(null)</code> 在挂载后自动绑定到 DOM，onMounted 里可以直接操作。</p>
          <div class="demo-box">
            <input ref="inputEl" v-model="inputVal" type="text" placeholder="点击按钮聚焦我" class="demo-input" />
            <div class="actions">
              <button class="btn-primary" @click="focusInput">聚焦输入框</button>
              <button class="btn-ghost" @click="inputVal = ''">清空</button>
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-title">
          <span class="tag orange">async</span>
          <span>3. 模拟数据请求</span>
        </div>
        <div class="card-body">
          <p class="explain">onMounted 是发起 API 请求的标准位置，组件挂载后立即加载首屏数据。</p>
          <div class="demo-box">
            <button class="btn-primary" @click="fetchData" :disabled="loading">
              {{ loading ? '请求中...' : '🚀 触发请求' }}
            </button>
            <div v-if="loading" class="loading">
              <span class="spinner"></span> 加载中
            </div>
            <div v-else-if="fetchedData" class="data-card">
              <div class="data-row"><span>ID:</span><b>{{ fetchedData.id }}</b></div>
              <div class="data-row"><span>名称:</span><b>{{ fetchedData.name }}</b></div>
              <div class="data-row"><span>价格:</span><b>¥{{ fetchedData.price }}</b></div>
              <div class="data-row"><span>时间:</span><b>{{ fetchedData.time }}</b></div>
            </div>
            <div v-else class="placeholder">点击按钮开始模拟请求</div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-title">
          <span class="tag red">onUnmounted</span>
          <span>4. 组件卸载时清理</span>
        </div>
        <div class="card-body">
          <p class="explain">组件卸载后定时器不会自动停止！必须在 <code>onUnmounted</code> 手动清理。</p>
          <div class="demo-box">
            <div class="demo-row"><span>运行定时器：</span><code>{{ tick > 0 ? 'setInterval #1 (每 1s)' : '未启动' }}</code></div>
            <p class="hint danger">⚠️ 不清理会造成内存泄漏</p>
          </div>
        </div>
      </section>
    </div>

    <div class="log-section">
      <div class="log-header">
        <span class="log-title">📝 生命周期日志</span>
        <button class="btn-ghost small" @click="logs = []">清空日志</button>
      </div>
      <div class="log-list">
        <div v-if="logs.length === 0" class="log-empty">点击页面按钮触发事件，观察日志输出</div>
        <div v-for="(log, i) in logs" :key="i" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-msg">{{ log.msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-page { width: 100%; max-width: 1100px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 28px; }
.page-header h1 { margin: 0 0 8px; font-size: 26px; color: #1a1a1a; }
.page-header .subtitle { margin: 0; color: #909399; font-size: 14px; }
.meta-row { margin-top: 10px; }
.meta-row .meta { font-size: 12px; color: #909399; background: #f4f4f5; padding: 4px 12px; border-radius: 20px; }
.meta-row .meta b { color: #42b883; }

.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
.card { background: #fff; border: 1px solid #ebeef5; border-radius: 10px; padding: 24px; transition: box-shadow 0.2s, transform 0.2s; }
.card:hover { box-shadow: 0 4px 16px rgba(66, 184, 131, 0.12); transform: translateY(-2px); }
.card-title { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; color: #303133; margin-bottom: 16px; }

.tag { display: inline-flex; align-items: center; justify-content: center; padding: 2px 10px; color: #fff; font-size: 12px; font-weight: 700; border-radius: 6px; }
.tag.green { background: #42b883; }
.tag.blue { background: #409eff; }
.tag.orange { background: #e6a23c; }
.tag.red { background: #f56c6c; }

.card-body { display: flex; flex-direction: column; gap: 12px; }
.explain { margin: 0; font-size: 13px; color: #606266; line-height: 1.6; }
.explain code { background: #f0f2f5; padding: 1px 6px; border-radius: 3px; color: #e6a23c; font-size: 12px; }

.demo-box { background: #fafbfc; border: 1px solid #ebeef5; border-radius: 8px; padding: 16px; }
.demo-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #606266; margin-bottom: 8px; }
.demo-row code { background: #fff; border: 1px solid #ebeef5; padding: 2px 10px; border-radius: 4px; color: #42b883; font-family: Consolas, monospace; font-size: 12px; }

.demo-input { width: 100%; padding: 10px 14px; border: 1px solid #dcdfe6; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.15s; }
.demo-input:focus { border-color: #42b883; }

.actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-primary { padding: 9px 20px; border: none; border-radius: 6px; background: #42b883; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.btn-primary:hover:not(:disabled) { background: #359a6b; }
.btn-primary:disabled { background: #a8d8bd; cursor: not-allowed; }

.btn-ghost { padding: 9px 20px; border: 1px solid #dcdfe6; border-radius: 6px; background: #fff; color: #606266; font-size: 13px; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { border-color: #42b883; color: #42b883; }
.btn-ghost.small { padding: 4px 12px; font-size: 12px; }

.hint { margin: 4px 0 0; font-size: 12px; color: #909399; line-height: 1.6; }
.hint.danger { color: #f56c6c; }

.loading { display: flex; align-items: center; gap: 8px; padding: 10px; color: #909399; font-size: 13px; }
.spinner { width: 14px; height: 14px; border: 2px solid #ebeef5; border-top-color: #42b883; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.data-card { background: #fff; border: 1px solid #ebeef5; border-radius: 6px; padding: 12px 16px; }
.data-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #606266; }
.data-row b { color: #303133; font-weight: 600; }

.placeholder { text-align: center; color: #c0c4cc; font-size: 12px; padding: 10px; }

.log-section { background: #1e1e2e; border-radius: 10px; overflow: hidden; border: 1px solid #313244; }
.log-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #313244; }
.log-title { font-size: 13px; font-weight: 600; color: #cdd6f4; }
.log-list { max-height: 240px; overflow-y: auto; padding: 8px 0; }
.log-list::-webkit-scrollbar { width: 6px; }
.log-list::-webkit-scrollbar-thumb { background: #45475a; border-radius: 3px; }
.log-item { display: flex; gap: 12px; padding: 6px 16px; font-size: 12px; font-family: Consolas, monospace; border-bottom: 1px solid rgba(49,50,68,0.5); }
.log-time { color: #6c7086; flex-shrink: 0; }
.log-msg { color: #cdd6f4; }
.log-empty { text-align: center; color: #6c7086; padding: 24px; font-size: 12px; }

@media (max-width: 800px) {
  .cards { grid-template-columns: 1fr; }
}
</style>