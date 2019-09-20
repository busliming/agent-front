<template>
  <div class="nav">
    <div class="scroller">
      <el-row type="flex" justify="center">
        <div class="toleft" @click.stop="dirHandle('left')">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="toright" @click.stop="dirHandle('right')">
          <i class="el-icon-arrow-right"></i>
        </div>
      </el-row>
    </div>
    <div class="navctn">
      <!-- 面包屑导航 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right" style='line-height:60px;font-size:16px;'>
        <template v-for="(item,idx) in $route.matched">
          <el-breadcrumb-item :key='idx' :to="{ path: item.path }" v-if='item.name'>{{item.name}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>-->
      <!-- 卡片导航 -->
      <ul class="headernav">
        <template v-for="(item,idx) in lists">
          <header-nav-item :key="idx" :item="item" :index="idx" :countinfo="countInfo"></header-nav-item>
        </template>
      </ul>
    </div>
    <!-- <div class="closeTabs">
      <el-dropdown @command="handleCommand" trigger="click">
        <el-button type="primary" style="height:66px;background:none;color:inherit;border:none;">
          关闭操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="closeAll" :disabled='false'>关闭所有选项卡</el-dropdown-item>
          <el-dropdown-item command="closeOther" divided :disabled='false'>关闭其他选项卡</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>-->
    <div class="online_number">
      在线人数：
      <span>{{onlineNumber}}</span>
      <el-tooltip content="点击刷新在线人数" placement="bottom">
        <el-button v-if="!HomeOnlineNumberLoading" icon="el-icon-refresh" circle size="mini" type="primary" @click="HomeOnlineNumber"></el-button>
        <el-button v-if="HomeOnlineNumberLoading" :disabled="true" icon="el-icon-loading" circle size="mini"></el-button>
      </el-tooltip>
    </div>
    <div class="message" @click="messageClickHandle">
      <el-row type="flex" justify="center" align="middle" style="height:100%;">
        <span>
          <el-badge :value="unReadMsgNum" class="item">
            <i class="iconfont icon-tongzhi"></i>
          </el-badge>
        </span>
      </el-row>
    </div>
  </div>
</template>

<script>
import HeaderNavItem from "@/views/IndexComponents/HeaderNavItem";
import messageRequest from "@/request/message";
import homeRequest from "@/request/home";

export default {
  name: "Nav",
  components: {
    HeaderNavItem
  },
  data() {
    return {
      unReadMsgNum:0,    //未读消息条数
      onlineNumber:0,  //在线人数

      countInfo: {
        //待处理财务订单数量
        offCount: 0,
        lineCount: 0,
        zfbCount: 0,
        bankCount: 0,
        autoCount: 0
      },

      offMusic: null, //官方充值待处理订单通知音路径
      lineMusic: null, //线上支付未支付订单通知音路径
      zfbMusic: null, //支付宝出款审核申请中订单通知音路径
      bankMusic: null, //银行卡出款审核申请中订单通知音路径
      autoMusic: null, //自动出款交易出款失败订单通知音路径

      offState: "2", //官方充值通知音状态  1开启 2关闭
      lineState: "2", //线上支付通知音状态  1开启 2关闭
      zfbState: "2", //支付宝出款审核通知音状态  1开启 2关闭
      bankState: "2", //银行卡出款审核通知音状态  1开启 2关闭
      autoState: "2", //自动出款交易通知音状态  1开启 2关闭

      WSsocket: null, //长链接实例

      HomeOnlineNumberLoading:false,  //获取在线人数按钮加载状态
    };
  },
  computed: {
    lists() {
      return this.$store.getters.headernavlists;
    },
    crtitem() {
      //当前选项
      return this.$store.getters.crtitem;
    }
  },
  created() {
    this.createWs();
    this.HomeOnlineNumber();
  },
  methods: {
    createWs() {
      //建立长链接
      let token = window.sessionStorage.getItem('token');
      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {
        // this.WSsocket = new WebSocket("ws://localhost:5110/ws"); //连接websocket 本地
        // this.WSsocket = new WebSocket("ws://172.20.100.90:5110/ws"); //连接websocket 预发布
        // this.WSsocket = new WebSocket("ws://music.wg-agent.com/ws"); //连接websocket  线上
        try {
          this.WSsocket = new WebSocket(this.$store.getters.wsUrl); //连接websocket
          this.WSsocket.onmessage = event => {
            // console.log('WS onmeesage:');
            // console.log(JSON.parse(event.data));
            let wsData = JSON.parse(event.data);
            this.countInfo = wsData.countInfo; //更新数量
            if (wsData.msgType == "agent_01") {
              //初始化状态
              this.offMusic = wsData.offMusic;
              this.lineMusic = wsData.lineMusic;
              this.zfbMusic = wsData.zfbMusic;
              this.bankMusic = wsData.bankMusic;
              this.autoMusic = wsData.autoMusic;

              this.offState = wsData.offState;
              this.lineState = wsData.lineState;
              this.zfbState = wsData.zfbState;
              this.bankState = wsData.bankState;
              this.autoState = wsData.autoState;
            }
            if (wsData.msgType == "agent_02") {
              //数量增加
              let type = wsData.type;
              this.playHandle(type);
            }
            if (wsData.msgType == "agent_03") {
              //数量减少
            }
          };
          this.WSsocket.onopen = event => {
            // console.log("连接开启");
            var _json = {
              msgType: "agent_01",
              token: token
            };
            this.wsSend(JSON.stringify(_json));
          };
          this.WSsocket.onclose = event => {
            // console.log("连接被关闭,正在断线重连：");
            setTimeout(() => {
              this.createWs();
            }, 500);
          };
        } catch (e) {
          // console.log("创建websocket出现错误：");
          // console.log(e);
        }
      } else {
        console.log("你的浏览器不支持 WebSocket！");
      }
      window.onbeforeunload = function(event) {
        // event.returnValue = "刷新提醒";
      };
    },
    wsSend(message) {
      if (!window.WebSocket) {
        console.log('wsSend: !window.WebSocket return');
        return;
      }
      // console.log('wsSend:this.WSsocket.readyState,WebSocket.OPEN');
      // console.log(this.WSsocket.readyState,WebSocket.OPEN);
      if (this.WSsocket.readyState == WebSocket.OPEN) {
        // console.log('sended message,message:');
        // console.log(message);
        this.WSsocket.send(message);
      } else {
        // console.log("连接没有开启.");
      }
    },
    playAudio(type) {
      return new Promise(resolve => {
        // 返回一个promise以告诉调用者检测结果
        let audioDom = document.querySelector("#notifyAudio");
        if (!audioDom) {
          audioDom = document.createElement("audio");
          audioDom.setAttribute("id", "notifyAudio");
        }
        // require一个本地文件，会变成base64格式
        // audioDom.src = require('@/assets/htgfzz.mp3');
        audioDom.oncanplay = function() {
          let autoplay = true;
          audioDom
            .play()
            .then(() => {
              // play返回的是一个promise
              // 支持自动播放
              autoplay = true;
            })
            .catch(err => {
              // 不支持自动播放
              autoplay = false;
            })
            .finally(() => {
              resolve(autoplay);
            });
        };
        switch (type) {
          case 1: //官方充值 -待处理
            if (this.offState == "1") {
              audioDom.src = this.offMusic;
            } else {
              audioDom.src = "";
            }
            break;
          case 2: //线上支付 -未支付
            if (this.lineState == "1") {
              audioDom.src = this.lineMusic;
            } else {
              audioDom.src = "";
            }
            break;
          case 3: //支付宝出款 -申请中
            if (this.zfbState == "1") {
              audioDom.src = this.zfbMusic;
            } else {
              audioDom.src = "";
            }
            break;
          case 4: //银行卡出款 -申请中
            if (this.bankState == "1") {
              audioDom.src = this.bankMusic;
            } else {
              audioDom.src = "";
            }
            break;
          case 5: //自动出款 -出款失败  -需求更改为出款中
            if (this.autoState == "1") {
              audioDom.src = this.autoMusic;
            } else {
              audioDom.src = "";
            }
            break;
        }
        document.body.appendChild(audioDom);
      });
    },
    playHandle(type) {
      this.playAudio(type).then(res => {
        console.log(res);
      });
    },
    HomeOnlineNumber() {
      //获取在线人数
      this.HomeOnlineNumberLoading = true;
      const timeStart = new Date().getTime();
      const WAITTIME = 500; //按钮点击间隔 500ms
      homeRequest
        .HomeOnlineNumber()
        .then(res => {
          if (res.code == 200) {
            this.onlineNumber = res.data;
          } else {
            this.$notify.warning({ title: res.msg });
          }
          const timeEnd = new Date().getTime();
          if(timeEnd - timeStart > WAITTIME){ //接口响应时间超过500ms  
            this.HomeOnlineNumberLoading = false;
          }else{  //接口响应时间小于500ms
            window.setTimeout(() => {
              this.HomeOnlineNumberLoading = false;
            },WAITTIME - (timeEnd - timeStart));
          }
        })
        .catch(e => {
          console.log(e);
          this.HomeOnlineNumberLoading = false;
        });
    },
    // handleCommand(command) { //关闭操作菜单
    //   if(command == 'closeAll'){
    //     this.$store.dispatch('navRemoveAllItem');
    //   }
    //   if(command == 'closeOther'){
    //     this.$store.dispatch('navRemoveOtherItem');
    //   }
    // },
    scrollRender(target, dir) {
      //滚动动画效果 target 目标距离 dir 滚动方向
      var el = document.querySelector(".headernav");
      var _render = function() {
        let crt = el.scrollLeft;
        if (dir === "left") {
          if (crt > target) {
            el.scrollLeft -= 50;
            window.requestAnimationFrame(_render);
          }
        }
        if (dir === "right") {
          if (crt < target) {
            el.scrollLeft += 50;
            window.requestAnimationFrame(_render);
          }
        }
      };
      _render();
    },
    scrollCurrentToView() {
      //滚动当前标签页标签到可视区域
      var el = document.querySelector(".headernavitem.crt");
      var elparent = document.querySelector(".headernav");
      let eloffset = el.offsetLeft - elparent.offsetLeft; //当前元素元素相对父元素的偏移
      let elleftoffset = eloffset - elparent.scrollLeft; //当前元素左边缘距离可视区域左端距离
      let elrightoffset = elleftoffset + el.clientWidth - elparent.clientWidth; //当前元素右边缘距离可视区域右端距离
      if (
        el.offsetLeft - elparent.offsetLeft >= elparent.scrollLeft &&
        el.offsetLeft + el.clientWidth - elparent.offsetLeft <
          elparent.scrollLeft + elparent.clientWidth
      ) {
        // console.log('元素位于可视范围');
        return;
      }
      if (elleftoffset > 0) {
        //元素在视口右侧
        //元素右侧滚动至视口右端
        this.scrollRender(
          Math.abs(elrightoffset) + elparent.scrollLeft,
          "right"
        );
      }
      if (elleftoffset < 0) {
        //元素在视口左侧
        //元素左侧滚动至视口左端
        this.scrollRender(elparent.scrollLeft - Math.abs(elleftoffset), "left");
      }
    },
    dirHandle(dir) {
      //标签过多  滚动操作
      let headernavClientWidth = document.querySelector(".headernav")
        .clientWidth; //容器宽度
      let headernavScrollWidth = document.querySelector(".headernav")
        .scrollWidth; //内容宽度
      let headernavScrollLeft = document.querySelector(".headernav").scrollLeft; //当前已滚动宽度
      if (dir === "left") {
        //点击左箭头
        if (headernavScrollLeft > 0) {
          //非最左端
          if (headernavScrollLeft <= headernavClientWidth) {
            //已滚动距离小于cw则直接滚到最前面；
            this.scrollRender(0, "left");
          } else {
            //否则滚动一个容器宽度
            this.scrollRender(
              headernavScrollLeft - headernavClientWidth,
              "left"
            );
          }
        } else {
          // console.log('最左端')
        }
      }
      if (dir === "right") {
        //点击右箭头
        if (
          headernavScrollLeft !=
          headernavScrollWidth - headernavClientWidth
        ) {
          //非最右端
          if (
            headernavScrollLeft + headernavClientWidth >=
            headernavScrollWidth - headernavClientWidth
          ) {
            //滚动距离大于等于可滚动距离则直接滚到底；
            this.scrollRender(
              headernavScrollWidth - headernavClientWidth,
              "right"
            );
          } else {
            //否则滚动一个容器宽度
            this.scrollRender(
              headernavScrollLeft + headernavClientWidth,
              "right"
            );
          }
        } else {
          // console.log('最右端')
        }
      }
    },
    messageClickHandle() {
      this.$router.push({
        name: "邮箱系统"
      });
    },
    getUnReadMsg() {
      messageRequest
        .getUnreadMsgCount()
        .then(res => {
          if (res.code == 200) {
            this.unReadMsgNum = res.data;
          }
        })
        .catch(err => {});
    }
  },
  updated: function() {
    //打开新的标签页状态
    this.$nextTick(function() {
      this.scrollCurrentToView(); //显示标签卡
    });
  },
  watch: {
    $route: function(nv, ov) {
      this.$nextTick(function() {
        this.scrollCurrentToView();
      });
    },
    crtitem: function(nv, ov) {
      console.log(nv);
      this.getUnReadMsg(); //获取未读消息
    }
  }
};
</script>

<style lang="scss">
.nav {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  .scroller {
    width: 80px;
    height: 100%;
    border-right: 1px solid #f1f3f6;
    .el-row {
      height: 100%;
      > div {
        width: 50%;
        height: 100%;
        font-size: 16px;
        line-height: 66px;
        text-align: center;
        > i {
          transition: all 0.3s;
        }
        &:hover {
          background: #f7f9fa;
          cursor: pointer;
          > i.el-icon-arrow-right {
            transform: translateX(10%);
          }
          > i.el-icon-arrow-left {
            transform: translateX(-10%);
          }
        }
      }
    }
  }
  // .closeTabs{
  //   width: 108px;
  //   height: 100%;
  //   display: flex;
  //   flex-flow: row nowrap;
  //   justify-content: center;
  //   align-items: center;
  //   border-left: 1px solid #f1f3f6;
  //   .el-dropdown-menu{
  //     width: 108px;
  //   }
  // }
  .online_number {
    width: 188px;
    height: 100%;
    font-size: 14px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #f1f3f6;
    > span {
      color: #f56c6c;
      margin-right: 10px;
    }
  }
  .message {
    width: 88px;
    height: 66px;
    line-height: 66px;
    text-align: center;
    cursor: pointer;
    border-left: 1px solid #f1f3f6;
    background: transparent;
    color: #9799ab;
    &:hover {
      color: #000;
    }
    span {
      line-height: 28px;
    }
    [class^="iconfont"] {
      margin-right: 5px;
      font-size: 17px;
      vertical-align: middle;
      color: inherit;
    }
  }
  .navctn {
    width: calc(100% - 88px - 108px - 80px);
    height: 100%;
    overflow: hidden;
  }
}
.headernav {
  list-style: none;
  width: auto;
  height: 66px;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  font-size: 0;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.headernavitem {
  display: inline-block;
  height: 66px;
  line-height: 66px;
  font-size: 14px;
  color: #9799ab;
  padding: 0 26px;
  padding-left: 31px;
  border: 1px solid #f1f3f6;
  border-top: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  .finance_count {
    border: 1px solid rgb(250, 105, 105);
    border-radius: 50%;
    background: rgb(250, 105, 105);
    font-size: 12px;
    color: #fff;
    font-weight: bolder;
    padding: 0 5px;
    margin-right: 8px;
  }
  .closeBtn {
    display: inline;
    text-align: center;
    color: #f1f3f6;
    margin-left: 5px;
    > i {
      width: 16px;
      height: 16px;
      font-size: 16px;
      border-radius: 50%;
      vertical-align: middle;
    }
    &:hover {
      color: #ee5749;
    }
  }
  &:hover {
    background: #f7f9fa;
    color: #343752;
  }
  &.crt {
    color: #343752;
    border-bottom: 3px solid #4a90e2;
  }
}
</style>
