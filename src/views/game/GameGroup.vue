<template>
  <el-card>
    <div class="Sortinglogic">
        <span>排序逻辑</span>
        <el-select @change="Sortinglogicchange" v-model="Sortinglogic" placeholder="请选择">
                <el-option
                  label="默认排序"
                  value="1">
                </el-option>
                <el-option
                  label="自定义排序"
                  value="2">
                </el-option>
        </el-select>
    </div>
    <el-button-group>
      <el-button type="primary" size='medium'
        :autofocus='crtType == 2'
        @click="changeType(2)"
      >捕鱼游戏</el-button>
      <el-button type="primary" size='medium'
        :autofocus='crtType == 1'
        @click="changeType(1)"
      >棋牌游戏</el-button>
      <el-button type="primary" size='medium'
        :autofocus='crtType == 3'
        @click="changeType(3)"
      >电玩街机</el-button>
        <el-button type="primary" size='medium'
        :autofocus='crtType == 0'
        @click="changeType(0)"
      >热门游戏</el-button>
    </el-button-group>
    <el-table
      :data="tableData"
      height="75%"
      v-loading="isloading"
      style="width: 100%;margin-top:20px;"
      :border='true'
      :fit='true'
      size="medium"
      stripe
      :cell-style='{textAlign:"center"}'
      :header-cell-style='{textAlign:"center"}'
      :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column label="游戏名称" prop='gameName'
      ></el-table-column>
      <el-table-column label="游戏状态" prop='siteStatus'>
               <template slot-scope="scope">
                    <el-tag size="medium" type="success" v-if="scope.row.siteStatus == 1">正常</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.siteStatus == 2">关闭</el-tag>
                    <el-tag size="medium" type="warning" v-if="scope.row.siteStatus == 3">开发中</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.siteStatus == 4">敬请期待</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.siteStatus == 5">即将上线</el-tag>
                    <el-tag size="medium" type="warning" v-if="scope.row.siteStatus == 6">维护中</el-tag>
                </template>
      </el-table-column>
      <el-table-column prop="" label="排序" width="300" >  
                <template slot-scope="scope">
                    <el-row type="flex" justify="center" v-if="Sortinglogic=='2'">
                           <el-input
                             width="10"
                             type="number"
                              v-model="scope.row.languageCode"
                              @blur="switchPosiblur(scope.$index,scope.row)"
                              size="mini"
                             >
                          </el-input>
                        <el-button size="mini"
                                   icon="el-icon-caret-top"
                                   @click="switchPosition(scope.row, 1,scope.$index)">
                            上移
                        </el-button>
                        <el-button size="mini"
                                   icon="el-icon-caret-bottom"
                                   @click="switchPosition(scope.row, 2,scope.$index)">
                            下移
                        </el-button>
                    </el-row>
                    <el-row type="flex" justify="center" v-else>
                              <span>{{scope.$index+1}}</span>
                    </el-row> 
                </template>

        </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size='mini' v-if='scope.row.gameTop == "0" || scope.row.gameTop == "" || scope.row.gameTop == null'
            @click='changeState(scope.row.id,"gameTop","1")'
          >设为置顶</el-button>
          <el-button size='mini' v-if='scope.row.gameTop == "1"'
            @click='changeState(scope.row.id,"gameTop","0")'
          >取消置顶</el-button> -->
          <el-button size='mini' v-if='scope.row.gameHot == "0" || scope.row.gameHot == "" || scope.row.gameHot == null'
            @click='changeState(scope.row.id,"gameHot","1")'
          >设为热门</el-button>
          <el-button size='mini' v-if='scope.row.gameHot == "1"'
            @click='changeState(scope.row.id,"gameHot","0")'
          >取消热门</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" v-if="Sortinglogic=='2'" style="margin-top:10px;" @click="Sortinglogicsave">保存</el-button>  
  </el-card>
</template>

<script>
import gameRequest from '@/request/game'

export default {
  name:'GameGroup',
  data () {
    return {
      Sortinglogic:'1',
      crtType:0,
      tableData:[],
      isloading:false,

      pageNum:1,
      pageSize:10,
      total:0
    }
  },
  methods:{
      Sortinglogicchange(){
           this.updateConfigOrder()
      },
      findConfigOrder(){ //获取游戏排序
            gameRequest.findConfigOrder().then(res=>{
              console.log(res,'---')
                   if(res.code=='200'){
                      this.Sortinglogic=res.data.orderType+''
                   }
            })
      },
      updateConfigOrder(){  //保存游戏排序
           gameRequest.updateConfigOrder(this.Sortinglogic).then(res=>{
                if(res.code=='200'){
                    this.queryHandle();
                }
           })
      },
      Sortinglogicsave(){ //保存
                  let gemeid=[]
                  this.tableData.map(item=>{
                        gemeid.push(item.id)
                  })
                  let data={
                      gameIds:gemeid,
                      groupId:this.crtType==0?'':this.crtType,
                      isHot:this.crtType==0 ? true:false,
                  }
                  gameRequest.updateOrderAll(data).then(res=>{
                        if(res.code=='200'){
                              this.$notify({
                                type:'success',
                                title:'保存成功'
                              })
                              this.updateConfigOrder()
                        }else{
                            this.$notify({
                              type:'warning',
                              title:res.msg
                            })
                        }
                  })  
      },
      switchPosiblur(index,row){
          let languageCode = this.tableData[index].languageCode
          if(Number(languageCode)>this.tableData.length){
                row.languageCode =  this.tableData.length
                this.$delete(this.tableData,[index])
                this.$notify({
                     type:'warning',
                      title:`排序最多只能${this.tableData.length+1}位`
               })
               this.$nextTick(()=>{
                   this.tableData.forEach((item,index)=>{
                        item.languageCode = index +1
                   })
                  this.$set(this.tableData,[this.tableData.length],row)
                }) 
          }else if(Number(languageCode)<=1){
             row.languageCode =  1
             console.log(index)
              this.$delete(this.tableData,[index])
              this.$nextTick(()=>{
                  this.tableData.splice(0,0,row)
                  this.tableData.map((item,index)=>{
                        item.languageCode = index +1
                   })
                  
              }) 
          }else{
            row.languageCode = languageCode
            this.$delete(this.tableData,[index])
             this.$nextTick(()=>{
                   this.tableData.splice(languageCode-1,0,row)
                   this.tableData.map((item,index)=>{
                        item.languageCode = index +1
                   })
                }) 
          }
      },
       switchPosition(row, val,index) {
                 if(index==0 && val==1){
                    this.$notify({
                      type:'warning',
                      title:'已经在第一个啦'
                    })
                 }else if(index==this.tableData.length-1 && val==2){
                   this.$notify({
                     type:'warning',
                      title:'这是最后一个啦'
                    })
                 }else{
                     if(val==1){
                           const index1= this.tableData[index-1]
                           this.$set(this.tableData,[index-1],row)
                           this.$set(this.tableData,[index],index1)
                     }else{
                          const index1= this.tableData[index+1]
                          this.$set(this.tableData,[index+1],row)
                          this.$set(this.tableData,[index],index1)
                     }
                     this.tableData.map((item,index)=>{
                        item.languageCode = index+1
                    })
                 }
    },
    changeType(type){  //改变分组
      this.crtType = type;
      this.queryHandle();
    },
    queryHandle(){ //获取当前分组游戏数据
      this.isloading = true;
      let data = {
        conditionsMap:{
          gameGenre:this.crtType==0? '' : this.crtType,
          isHot:this.crtType==0 ? true:false
        },
      //   Sortinglogic:this.Sortinglogic   //默认选择排序规则
       }
      gameRequest.getGamePage(data).then(res => {
        if(res.rows){
            this.tableData = res.rows;
            this.tableDatabeifen = res.rows
            this.tableData.map((item,index)=>{
                item.languageCode = index+1
            })
            //  console.log(this.tableData)
            // console.log(this.tableDatabeifen== this.tableData)
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.isloading = false;
      }).catch(err => {
        console.log(err);
        this.isloading = false;
      })
    },
    changeState(id,attr,state){  //点击操作按钮
      let data = {
        id:id
      }
      if(attr == 'gameHot'){
        data.gameHot = state
      }
      this.updateGameTopOrGameHot(data);
    },
    updateGameTopOrGameHot(data){ //修改游戏状态
      this.isloading = true;
      gameRequest.updateGameTopOrGameHot(data).then(res => {
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:'操作成功'
          })
          this.queryHandle();
        }else{
          this.$otify({
            type:'warning',
            title:res.msg
          })
        }
        this.isloading = false;
      }).catch(err => {
        console.log(err);
        this.isloading = false;
      })
    },
  },
  created(){
    this.queryHandle();
    this.findConfigOrder()
  }
}
</script>

<style lang="scss">
.Sortinglogic{
    width: 320px;
    display: flex;
    line-height:40px;
    margin-bottom: 20px;
    >span{
      width: 100px;
    }
}
</style>


