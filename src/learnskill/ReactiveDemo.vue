<script setup>
import { reactive } from 'vue'

const state = reactive({
  msg: 'this is msg'
})

const setState = () => {
  state.msg = 'this is new msg'
}

const setStateRandom = () => {
  state.msg = '随机数: ' + Math.floor(Math.random() * 1000)
}
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <h1>Vue 3 reactive 讲解案例</h1>
      <p class="subtitle">reactive 用于定义对象类型的响应式数据，无需 .value</p>
    </header>

    <div class="cards">
      <section class="card">
        <div class="card-title">
          <span class="tag">reactive</span>
          <span>对象示例</span>
        </div>
        <div class="card-body">
          <div class="msg-box">{{ state.msg }}</div>
          <div class="actions">
            <button class="btn-primary" @click="setState">改为固定文案</button>
            <button class="btn-ghost" @click="setStateRandom">随机修改</button>
          </div>
          <p class="hint">reactive 对象直接修改属性即可触发视图更新，不需要 .value</p>
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
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 28px;
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
  padding: 2px 10px;
  background: #42b883;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
}

.card-body { display: flex; flex-direction: column; align-items: center; gap: 14px; }

.msg-box {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  padding: 20px 24px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  min-height: 30px;
  min-width: 300px;
  word-break: break-all;
}

.actions { display: flex; gap: 10px; }

.btn-primary {
  padding: 9px 20px;
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
  padding: 9px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: #42b883; color: #42b883; }

.hint { margin: 0; font-size: 12px; color: #909399; text-align: center; line-height: 1.6; }
</style>