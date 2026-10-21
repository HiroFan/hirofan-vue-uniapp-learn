<script setup>
import { ref, computed } from 'vue'

const count = ref(0)   
const doubleCount = computed(() => count.value * 2)

const list = ref([1, 2, 3, 4, 5, 6, 7, 8])
const filterList = computed(() => list.value.filter(item => item > 2))
</script>

<template>
  <div class="computed-demo">
    <h2>computed 计算属性演示</h2>

    <section class="count-demo">
      <h3>计数器</h3>
      <p>原始 count: {{ count }}</p>
      <p>计算 doubleCount (count * 2): {{ doubleCount }}</p>
      <button @click="count++">count +1</button>
      <button @click="count = 0">重置</button>
    </section>

    <section class="list-demo">
      <h3>列表过滤</h3>
      <p>原始 list: {{ list }}</p>
      <p>过滤后 (item > 2): {{ filterList }}</p>
      <button @click="list.push(list.length + 1)">添加元素</button>
    </section>
  </div>
</template>

<style scoped>
.computed-demo {
  padding: 20px;
  font-family: sans-serif;
}

.computed-demo section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.computed-demo button {
  margin-right: 10px;
  padding: 6px 14px;
  border: none;
  background: #42b883;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.computed-demo button:hover {
  background: #359a6b;
}
</style>