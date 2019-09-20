<template>
  <el-card>
   <el-tabs  type="border-card" v-model="activeName">
      <el-tab-pane label="站点管理" name="SiteManag">
            <SiteManag v-if="activeName=='SiteManag'">站点管理</SiteManag>
      </el-tab-pane>
      <el-tab-pane label="推广域名管理" name="PromoteDomain">
            <PremotionManag  v-if="activeName=='PromoteDomain'">推广域名管理</PremotionManag>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import systemRequest from "@/request/system";
import valide from "@/tool/validate";
import SiteManag from "./components/SiteManag";
import PremotionManag from "./components/PremotionManag";
export default {
  name: "DomainManage",
  components: {
    SiteManag,
    PremotionManag
  },
  data() {
    return {
       activeName:'SiteManag'
    };
  },
  // methods: {
   
  // },
  // created() {

  // }
};
</script>
