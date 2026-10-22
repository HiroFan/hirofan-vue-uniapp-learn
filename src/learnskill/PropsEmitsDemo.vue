<script setup>
import { ref } from 'vue'
import UserCard from './child/UserCard.vue'
import ProductCard from './child/ProductCard.vue'
import CounterCard from './child/CounterCard.vue'
import SearchBar from './child/SearchBar.vue'

const user1 = ref({ name: '张三', age: 25, avatar: '🧑‍💻' })
const product = ref({ id: 1001, name: '机械键盘', price: 599, stock: 23 })
const count = ref(0)
const keyword = ref('')
const searchLogs = ref([])

const onUserEdit = (field, val) => {
  user1.value[field] = val
  searchLogs.value.unshift({ time: Date.now(), msg: `user-edit: ${field}=${val}` })
}

const onBuy = (id) => {
  product.value.stock = Math.max(0, product.value.stock - 1)
  searchLogs.value.unshift({ time: Date.now(), msg: `buy-product: id=${id}` })
}

const onCounterChange = (val) => {
  searchLogs.value.unshift({ time: Date.now(), msg: `counter=${val}` })
}

const onSearch = (kw) => {
  searchLogs.value.unshift({ time: Date.now(), msg: `search="${kw}"` })
}

const logs = ref([])
const addLog = (msg) => {
  const t = new Date().toLocaleTimeString()
  logs.value.unshift({ t, msg })
  if (logs.value.length > 20) logs.value.pop()
}
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <h1>Vue 3 Props & Emits 父子通信</h1>
      <p class="subtitle">父传子用 props，子传父用 emits，双向绑定用 v-model</p>
    </header>

    <div class="cards">
      <!-- 案例 1: Props 基础 + Emits 事件 -->
      <section class="card">
        <div class="card-title">
          <span class="tag green">Props</span>
          <span class="tag blue">Emits</span>
          <span>1. 用户卡片（基础 props + 事件）</span>
        </div>
        <div class="card-body">
          <p class="explain">父组件传 <code>user</code> 对象给子组件，子组件点击编辑按钮通过 <code>emit('edit', field, val)</code> 通知父组件更新。</p>
          <UserCard
            :user="user1"
            @edit="(f, v) => { user1[f] = v; addLog(`emit: edit ${f}=${v}`) }"
          />
          <div class="realtime">
            <div class="rt-label">父组件实时状态：</div>
            <div class="rt-box">name={{ user1.name }} · age={{ user1.age }}</div>
          </div>
        </div>
      </section>

      <!-- 案例 2: Props 默认值 + 类型校验 -->
      <section class="card">
        <div class="card-title">
          <span class="tag green">Props</span>
          <span class="tag orange">校验</span>
          <span>2. 商品卡片（默认值 + 校验 + 事件）</span>
        </div>
        <div class="card-body">
          <p class="explain">演示 <code>withDefaults</code> 设置默认值、<code>validator</code> 自定义校验、<code>required: true</code> 必填。</p>
          <ProductCard
            :product="product"
            :discount="0.85"
            source="DemoApp"
            @buy="(id) => { addLog(`emit: buy id=${id}`); product.stock = Math.max(0, product.stock - 1) }"
          />
          <p class="hint">
            点击「立即购买」观察父组件 <code>stock</code> 实时减少
          </p>
        </div>
      </section>

      <!-- 案例 3: v-model 双向绑定 -->
      <section class="card">
        <div class="card-title">
          <span class="tag purple">v-model</span>
          <span>3. 计数器（v-model 双向绑定）</span>
        </div>
        <div class="card-body">
          <p class="explain"><code>v-model</code> 本质是 <code>:modelValue + @update:modelValue</code> 的语法糖，子组件用 <code>defineModel()</code> 直接拿到可写引用。</p>
          <CounterCard v-model="count" :step="2" min="0" max="20" @change="(v) => addLog(`emit: change=${v}`)" />
          <div class="realtime">
            <div class="rt-label">父组件 count：</div>
            <div class="rt-box big">{{ count }}</div>
          </div>
        </div>
      </section>

      <!-- 案例 4: 多个 v-model + 命名 -->
      <section class="card">
        <div class="card-title">
          <span class="tag purple">v-model</span>
          <span class="tag blue">多参数</span>
          <span>4. 搜索框（多 v-model + debounce）</span>
        </div>
        <div class="card-body">
          <p class="explain">Vue 3.4+ 支持多个命名 <code>v-model:xxx</code>，子组件用 <code>defineModel('xxx')</code> 一一对应。</p>
          <SearchBar v-model:keyword="keyword" v-model:loading="searching" @search="(k) => addLog(`emit: search='${k}'`)" />
          <div class="realtime">
            <div class="rt-label">父组件 keyword：</div>
            <div class="rt-box">"{{ keyword }}"</div>
          </div>
        </div>
      </section>
    </div>

    <!-- 通信日志 -->
    <div class="log-section">
      <div class="log-header">
        <span class="log-title">📡 emit 通信日志</span>
        <button class="btn-ghost small" @click="logs = []">清空</button>
      </div>
      <div class="log-list">
        <div v-if="logs.length === 0" class="log-empty">点击卡片上的按钮，观察 emit 事件流向父组件</div>
        <div v-for="(l, i) in logs" :key="i" class="log-item">
          <span class="log-time">{{ l.t }}</span>
          <span class="log-msg">{{ l.msg }}</span>
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

.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
.card { background: #fff; border: 1px solid #ebeef5; border-radius: 10px; padding: 24px; transition: box-shadow 0.2s, transform 0.2s; }
.card:hover { box-shadow: 0 4px 16px rgba(66, 184, 131, 0.12); transform: translateY(-2px); }
.card-title { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; color: #303133; margin-bottom: 16px; flex-wrap: wrap; }

.tag { display: inline-flex; align-items: center; justify-content: center; padding: 2px 10px; color: #fff; font-size: 12px; font-weight: 700; border-radius: 6px; }
.tag.green { background: #42b883; }
.tag.blue { background: #409eff; }
.tag.orange { background: #e6a23c; }
.tag.purple { background: #a855f7; }

.card-body { display: flex; flex-direction: column; gap: 12px; }
.explain { margin: 0; font-size: 13px; color: #606266; line-height: 1.6; }
.explain code { background: #f0f2f5; padding: 1px 6px; border-radius: 3px; color: #e6a23c; font-size: 12px; }

.hint { margin: 4px 0 0; font-size: 12px; color: #909399; line-height: 1.6; }
.hint code { background: #f0f2f5; padding: 1px 6px; border-radius: 3px; color: #e6a23c; font-size: 12px; }

.realtime { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 14px; }
.rt-label { font-size: 11px; color: #16a34a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.rt-box { font-family: Consolas, monospace; font-size: 13px; color: #15803d; margin-top: 2px; }
.rt-box.big { font-size: 28px; font-weight: 700; }

.log-section { background: #1e1e2e; border-radius: 10px; overflow: hidden; border: 1px solid #313244; }
.log-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #313244; }
.log-title { font-size: 13px; font-weight: 600; color: #cdd6f4; }
.log-list { max-height: 220px; overflow-y: auto; padding: 8px 0; }
.log-list::-webkit-scrollbar { width: 6px; }
.log-list::-webkit-scrollbar-thumb { background: #45475a; border-radius: 3px; }
.log-item { display: flex; gap: 12px; padding: 6px 16px; font-size: 12px; font-family: Consolas, monospace; border-bottom: 1px solid rgba(49,50,68,0.5); }
.log-time { color: #6c7086; flex-shrink: 0; }
.log-msg { color: #cdd6f4; }
.log-empty { text-align: center; color: #6c7086; padding: 24px; font-size: 12px; }

.btn-ghost { padding: 6px 14px; border: 1px solid #45475a; border-radius: 6px; background: transparent; color: #94a3b8; font-size: 12px; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { border-color: #38bdf8; color: #38bdf8; }
.btn-ghost.small { padding: 4px 12px; font-size: 12px; }

@media (max-width: 800px) { .cards { grid-template-columns: 1fr; } }
</style>