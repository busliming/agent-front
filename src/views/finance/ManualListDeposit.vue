<template>
  <manual-list></manual-list>
</template>

<script>
const ManualList = () => import('@/views/finance/ManualList.vue');  //人工存款/提款记录复用
export default {
  name:'ManualListDeposit',
  components:{
    ManualList
  }
}
</script>
