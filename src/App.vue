<script setup>
  // 1. 导入use方法
	import { useCounterStore } from '@/stores/counter'
  import { onMounted } from 'vue'
  // 2. 执行方法得到store store里有数据和方法
  const counterStore = useCounterStore()
  onMounted(() => {
    counterStore.fetchList()
  })
</script>

<template>
	<button @click="counterStore.increment">
    {{ counterStore.count }};
    <br>
    {{ counterStore.doubleCount }},
    //List
  
    
  </button>
</template> 