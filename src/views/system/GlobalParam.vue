<template>
  <el-card>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="全局设置" name="one">
        <GlobalSetting
          v-if="activeName == 'one'"
        ></GlobalSetting>
      </el-tab-pane>
      <el-tab-pane label="注册登录" name="two">
        <SignInLogin
          v-if="activeName == 'two'"
        ></SignInLogin>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
const GlobalSetting = () => import ('@/views/system/components/globalSetting.vue')
const SignInLogin = () => import ('@/views/system/components/signInLogin.vue')

export default {
  name:'GlobalParam',
  data () {
    return {
      activeName:'one'
    }
  },
  components:{
    GlobalSetting,
    SignInLogin
  },
  methods:{
  },
}
</script>

