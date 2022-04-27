<template>
  <el-table :data="tableData" :border="border" :row-key="expand?'id':''" style="width" max-height="620" :row-class-name="tableRowClassName" @row-click="changeDic" :header-row-class-name="headerStyle" @selection-change="getSelection">
    <el-table-column v-if="check" type="selection" width="55" />
    <el-table-column v-if="index" type="index" label="序号" width="55" />
    <el-table-column type="expand" v-if="expand">
      <template #default="props">
        <el-table :data="props.row.children" :header-row-class-name="headerStyle" :row-class-name="tableRowClassName">
            <el-table-column v-if="expandIndex" type="index" label="序号" width="55" />
            <el-table-column v-for="item in expandConfig" :prop="item.prop" :label="item.label" :width="item.width" >
                <template #default="scope" v-if="item.ellipsis">
                    <div :class="scope.row.ellipsis=='true'?'ellipsis-cell':''"><el-icon v-if="scope.row.ellipsis=='true'" style="cursor:pointer" @click.stop="hidden(scope.row)"><arrow-right /></el-icon><el-icon style="cursor:pointer" v-else @click.stop="hidden(scope.row)"><arrow-down /></el-icon><span>{{scope.row[item.prop]}}</span></div>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="expandOperate" >
                <template #default="scope">
                    <div>
                        <el-tooltip :content="item.text" placement="top" v-for="item in expandOperation">
                        <i :class="`rz-icon ${item.class}`" @click.stop="emit(item.functionName,scope.row)"></i>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column v-for="item in config" :prop="item.prop" :label="item.label" :width="item.width" >
          <template #default="scope" v-if="item.edit">
            <span class="edit-cell" @click="$emit('editRow',scope.row)">{{scope.row[item.prop]}}</span>
          </template>
    </el-table-column>
    <el-table-column label="操作" v-if="operate">

          <template #default="scope">
            <div>
                <el-tooltip :content="item.text" placement="top" v-for="item in opeation">
                <i :class="`rz-icon ${item.class}`" @click.stop="emit(item.functionName,scope.row)"></i>
                </el-tooltip>
            </div>
          </template>
        
    </el-table-column>
  </el-table>
  <div class="page">
      <el-pagination background style="display:inline-block;" layout="slot" :total="total" >
        <span class="el-pagination_total">当前第{{currentPage}}页，共{{endPage}}页，共{{total}}条</span>
      </el-pagination>
      <el-pagination background style="display:inline-block;" layout="slot,prev" prev-text="上一页" @prev-click="pagePre" :total="total">
        <el-select v-model="pageSize" class="page-size" @change="sizeChange">
            <el-option v-for="item in pageSizes" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <button class="first-btn btn-prev" @click="turnPage('1')">首页</button>
      </el-pagination>
      <el-pagination background style="display:inline-block;" layout="next,slot" next-text="下一页" @next-click="pageNext" :total="total">
        <button class="first-btn btn-prev" @click="turnPage(endPage)">末页</button>
        <span class="el-pagination_total">前往
        <el-input v-model="currentPage" class="current-page" @blur="turnPage(currentPage)"></el-input>
        页</span>
      </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {ArrowRight,ArrowDown} from '@element-plus/icons-vue'
import http from '/src/api/http'
const props = defineProps({
 	config: Array,
     width: String,
     index: Boolean,
     check: Boolean,
     dataUrl:String,
     dataMethod:{
         type:String,
         default:'get'
     },
     expandIndex:Boolean,
     expandOperate:Boolean,
     expandConfig: Array,
     expandOperation:Array,
     expand: Boolean,
     border:{
         type:Boolean,
         default:true
     },
     dataParams:Object,
     opeation: Array,
     operate: Boolean,
})
const emit = defineEmits([]);
const pageSizes = [{value:10,label:'10条/页'},{value:20,label:'20条/页'},{value:50,label:'50条/页'}];
const pageSize = ref(10);
const currentPage = ref(1);
const endPage = ref(0)
const total = ref(0)
const dicDomain = ref('')
const selection = ref([])
const getSelection = (val)=>{
    selection.value = val
}
const changeDic = (row,col)=>{
    if(props.dataUrl!='/dic/domain/list'){
        
    }else{
        if(col.property!='dicDomain'){
            dicDomain.value = row
            emit("dicDomain",row)
        }
    }
}
const hidden = (row)=>{
    console.log(row.ellipsis,row.ellipsis=='true')
    if(row.ellipsis=='true'){
        row.ellipsis = 'false';
    }else{
        row.ellipsis = 'true'
    }
}
const onload=(param)=>{
    let params = props.dataParams?props.dataParams:{};
    let page = {
        pageNumber:currentPage.value,
        pageSize:pageSize.value
    }
    Object.assign(params,page)
    if(param){
        Object.assign(params,param)
    }
        http({
        url:props.dataUrl,
        method:props.dataMethod,
        [props.dataMethod=='post'?'data':'params']:params
    }).then((res: { data: any }) => {
          if(res.code=='200'){
            tableData.value = res.data.records;
            currentPage.value = res.data.current?res.data.current:1;
            endPage.value = res.data.pages?res.data.pages:1;
            total.value = res.data.total?res.data.total:0;
            if(props.dataUrl == '/dic/domain/list'){
                emit("dicDomain",res.data.records[0])
            }
            if(props.dataUrl == '/service/list'){
                for(let i=0;i<tableData.value.length;i++){
                    tableData.value[i].id = i;
                    for(let z=0;z<tableData.value[i].children.length;z++){
                        tableData.value[i].children[z].ellipsis = tableData.value[i].children[z].hidden
                    }
                    
                }
                console.log(tableData.value)
            }
          }
    })
}
const turnPage=(page)=>{
    currentPage.value = page;
    onload();
}
const pagePre = ()=>{
    currentPage.value = currentPage.value - 1;
    onload();
}
const pageNext = ()=>{
    currentPage.value = currentPage.value + 1;
    onload();
}
const sizeChange= (val)=>{
    pageSize.value = val
    onload();
}
onMounted(()=>{
    onload();
})
const tableData = ref();
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User
  rowIndex: number
}) => {
  if (rowIndex%2==0) {
    return 'single-row'
  } else  {
    return 'double-row'
  }
  return ''
}
const headerStyle = ()=>{
    return 'header-row';
}
defineExpose({onload,selection})
</script>
<style lang="less" scoped>
.el-table{
    :deep(.el-table__cell){
        text-align:center;
    }
    :deep(th.el-table__cell){
        background:none;
    }
    :deep(.header-row){
        background:#F6F7F9;
    }
    :deep(.single-row){
        background:#F2F5FA;
    }
    :deep(.double-row){
        background:#FAFAFA;
    }
    :deep(.el-table__expanded-cell){
        padding-left:110px;
    }
    :deep(.cell){
        text-align:center;
        .ellipsis-cell{
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
        .edit-cell{
            cursor:pointer;
            color:#e4393c;
            font-weight:400;
        }
    }
}
.page{
    margin-top:20px;
    text-align:right;
    .el-pagination.is-background{
        font-size:12px;
        .current-page{
            width:22px;
            text-align:center;
            :deep(.el-input__inner){
                padding:0 !important;
            }
        }
        .page-size{
            width:84px;
            :deep(.el-input){
                width:84px;
                font-size:12px;
                .el-input__inner{
                    text-align:left;
                }
            }
        }
        :deep(.btn-prev,.page-size,.current-page),:deep(.btn-next),:deep(span:not([class*="suffix"])){
            display:inline-block;
        }
        :deep(.btn-prev,.btn-next){
            width:54px;
        }
        .first-btn{
            width:43px;
        }
    }
}

</style>
