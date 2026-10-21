<script setup>
 // 导入
 import { reactive } from 'vue'
 // 执行函数 传入参数 变量接收
 const state = reactive({
   msg:'this is msg'
 })
 const setState = ()=>{
   // 修改数据更新视图
   state.msg = 'this is new msg'
 }
 import { ref } from 'vue'
 const count = ref(0)
 const increment = ()=>{
   count.value++
 }
</script>

<template>
  {{ state.msg }}
  
  <button @click="setState">change msg</button>
  <button @click="increment">increment</button>
  ni hao {{ count * 1e100 }}, {{ count * 1 }}
  

  </template>