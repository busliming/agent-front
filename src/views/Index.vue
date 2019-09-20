<template>
  <el-container>
    <el-aside :class="['asideleft',{'expander':hasExpander}]">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header :class="['top',{'expander':hasExpander}]">
        <nav-bar></nav-bar>
      </el-header>
      <el-main class="bottom">
        <app-main></app-main>
        <div class="sideExpander"
          @click="expanderClick"
        >
          <i class="iconfont icon-quanpin"></i>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import {SideBar,NavBar,AppMain} from '@/views/IndexComponents'

export default {
  name:'Index',
  components:{
    SideBar,
    NavBar,
    AppMain
  },
  data(){
    return {
      hasExpander:true, //侧边栏和顶栏
    }
  },
  methods:{
    expanderClick(){
      this.hasExpander = !this.hasExpander;
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/font/iconfont.css';
/* chrome type为number移除箭头 */
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{ 
     -webkit-appearance:textfield;
}

.asideleft{
  width:0 !important;
  height: 100%;
  transition: all .3s;
  &.expander{
    width:220px !important;
  }
}
.top{
  position: relative;
  z-index: 2;
  padding: 0;
  height: 0 !important;
	box-shadow: 0px 4px 8px 0px rgba(52, 55, 82, 0.04);
  transition: all .3s;
  &.expander{
    height:66px !important;
  }
}
.bottom{
  position: relative;
  height: calc(100vh - 66px);
  background: #f1f3f6;
  padding: 40px;
  .sideExpander{
    position: absolute;
    width: 38px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: rgba(0,151,255,.3);
    top:0;
    left:0;
    cursor: pointer;
    opacity: .3;
    transition: all .3s;
    &:hover{
      opacity: 1;
    }
  }
  >.el-container>.el-card{
    height: 100%;
    border: none;
    background: transparent;
    >.el-card__header{
      background: transparent;
      font-size: 24px;
      line-height: 24px;
      color: #343752;
      padding: 0;
      padding-bottom: 20px;
      border: none;
    }
    >.el-card__body{
      height: calc(100% - 44px);
      background: #fff;
      padding:10px 20px;
      overflow-x: hidden;
      overflow-y: scroll;
      .el-tabs{
        height: 100%;
        >.el-tabs__content{
          height:calc(100% - 40px);
          overflow-y: scroll;
          overflow-x: hidden;
        }
      }
      .el-form-item{
        margin-bottom: 20px;
      }
      .el-select {
        width: 100%;
      }

        .el-table--group, .el-table--border{
          border:none;
          border-top: 2px solid #e2e3ea;
        }
        .el-table__header{
          border-bottom: 1px solid #e2e3ea;
        }
        .el-table th, .el-table td{
          padding: 10px 0;
        }
        .el-table th.is-leaf, .el-table td{
          border: none;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td{
          background: #f4f6fb;
        }


      .el-button--mini{
        // background: transparent !important;
        &:hover,&:focus{
          // background: #ddd !important;
        }
      }
      .el-pagination{
        padding: 10px 0;
      }
    }
  }
  .form-group {
    padding: 13px;
    border: 1px solid #ddd;
    border-radius: 5px;
    .flexdisplaydiv {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      flex-flow: wrap;
      .el-checkbox {
        margin: 7px !important;
      }
    }
  }
}
//页面单独样式
.bottom{
  .memberdetailcontainer{
    .el-card__header{
      padding: 16px 20px;
      font-size: 14px;
      line-height: 14px;
	    color: #547ef5;
      background: #e0e5f6;
    }
    .el-card__body{
      padding: 20px !important;
    }
    .el-form-item__label{
      text-align: right;
      padding: 0;
    }
  }
}
.bottom{
  .addActivtyctn{
    .el-card__body{
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }
}
.bottom{
  .inernalmessagecontainer{
    >.el-card__body{
      padding: 5px 20px 0 20px !important;
      .el-tabs__header {
        .el-tabs__item{
          font-size: 18px;
          height: 45px;
          line-height: 45px;
          color: #9799ab;
          &.is-active{
            color: #547ef5;
          }
        }
        .el-tabs__active-bar{
          background: #547ef5;
        }
      }
    }
    .el-dialog__header{
      border-bottom: 1px solid #ddd;
    }
  }
}
/*财务管理*/
.bottom{
  .el-container>.finance-conf{
    height: 100%;
    >.el-card__body{
      height:100%;
      .el-tabs{
        height: 100%;
        >.el-tabs__content{
          height:calc(100% - 39px);
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }
    }
  }
}
</style>

