<template>
  <payment-review></payment-review>
</template>

<script>
const PaymentReview = () => import('@/views/finance/components/PaymentReview.vue'); //支付宝/银行卡出款审核复用
export default {
  name:'AlipayPaymentReview',
  components:{
    PaymentReview
  }
}
</script>
