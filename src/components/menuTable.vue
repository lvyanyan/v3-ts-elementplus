<template>
<el-scrollbar class="menu-table">
  <el-table :data="tableData" :highlight-current-row="highlight" row-key="id" :tree-props="{children:'children',hasChildren:'hasChildren'}" default-expand-all :border="border" :row-key="expand?'id':''" :style="`width:${px2rem(width)};`"   :row-class-name="tableRowClassName" @row-click="changeDic" :header-row-class-name="headerStyle" @selection-change="getSelection">
    <el-table-column v-if="check" type="selection" :width="px2rem(55)" />
    <el-table-column v-if="index" type="index" label="序号" :width="px2rem(55)" />
    <el-table-column type="expand">
      <template #default="props">
        <el-table v-if="props.row.children.length>0" :data="props.row.children" :header-row-class-name="headerStyle" default-expand-all  row-key="id" :tree-props="{children:'children',hasChildren:'hasChildren'}" @selection-change="getSelection1" :show-header="false"  >
            <el-table-column v-if="check" type="selection" :width="px2rem(55)" />
            <el-table-column type="index" label="序号" :width="px2rem(55)" />
                <el-table-column type="expand">
                <template #default="props">
                    <el-table v-if="props.row.children.length>0" :data="props.row.children" :header-row-class-name="headerStyle"  row-key="id" :tree-props="{children:'children',hasChildren:'hasChildren'}" @selection-change="getSelection2" :show-header="false"  >
                        <el-table-column v-if="check" type="selection" :width="px2rem(55)" />
                        <el-table-column type="index" label="序号" :width="px2rem(55)" />
                        <el-table-column width="48"></el-table-column>
                        <el-table-column v-for="item in config" :prop="item.prop" :label="item.label" :width="px2rem(item.width)"  :show-overflow-tooltip="item.tooltip">
                            <template #default="scope" v-if="item.edit">
                                <span class="edit-cell level3" @click="$emit('editRow',scope.row)">{{scope.row[item.prop]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="expandOperate" :width="px2rem(137)">
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
            <el-table-column v-for="item in config" :prop="item.prop" :label="item.label" :width="px2rem(item.width)"  :show-overflow-tooltip="item.tooltip">
                <template #default="scope" v-if="item.edit">
                    <span class="edit-cell level2" @click="$emit('editRow',scope.row)">{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="expandOperate" :width="px2rem(137)">
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
    <el-table-column v-for="item in config" :prop="item.prop" :label="item.label" :width="px2rem(item.width)" :show-overflow-tooltip="item.tooltip">
          <template #default="scope" v-if="item.edit">
            <span class="edit-cell level1" @click="$emit('editRow',scope.row)">{{scope.row[item.prop]}}</span>
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
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {px2rem} from '/src/utils/public'
import {ArrowRight,ArrowDown} from '@element-plus/icons-vue'
import http from '/src/api/http'
const props = defineProps({
 	config: Array,
     width: String,
     index: Boolean,
     check: Boolean,
     dataUrl:String,
     highlight:Boolean,
     dataMethod:{
         type:String,
         default:'get'
     },
     nopage:Boolean,
     expandIndex:Boolean,
     expandOperate:Boolean,
     expandConfig: Array,
     expandOperation:Array,
     expand: Boolean,
     height:{
         type:String,
         default:"528px"
     },
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
const selection1 = ref([])
const selection2 = ref([])
const getSelection = (val)=>{
    selection.value = val
}
const getSelection1 = (val)=>{
    selection1.value = val
}
const getSelection2 = (val)=>{
    selection2.value = val
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
    if(row.ellipsis=='true'){
        row.ellipsis = 'false';
    }else{
        row.ellipsis = 'true'
    }
}
const onload=(param,pageNumber)=>{
    if(pageNumber){
        currentPage.value = pageNumber
    }
    let params = props.dataParams?props.dataParams:{};
    let page = {
        pageNumber:currentPage.value,
        pageSize:pageSize.value
    }
    if(!props.nopage){
        Object.assign(params,page)
    }
    if(param){
        Object.assign(params,param)
    }
        http({
        url:props.dataUrl,
        method:props.dataMethod,
        [props.dataMethod=='post'?'data':'params']:params
    }).then((res: { data: any }) => {
          if(res.code=='200'){
            tableData.value = res.data.children;
          }
    })
}
// const turnPage=(page)=>{
//     currentPage.value = page;
//     onload();
// }
// const pagePre = ()=>{
//     currentPage.value = currentPage.value - 1;
//     onload();
// }
// const pageNext = ()=>{
//     currentPage.value = currentPage.value + 1;
//     onload();
// }
// const sizeChange= (val)=>{
//     pageSize.value = val
//     onload();
// }
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
defineExpose({onload,selection,selection1,selection2})
</script>
<style lang="less" scoped>
.el-scrollbar.menu-table{
    height:591px;
}
:deep(.el-table__empty-block){
    display:none;
    height:0px;
}
.el-table{
    :deep(.el-table__body tr.current-row>td.el-table__cell){
        background:#D3E3FE;
    }
    :deep(.el-table__cell){
        height:48px;
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
        // padding-left:178px;
        height:0;
        border-bottom:0;
        border-top:0;
    }
    :deep(.cell){
        text-align:center;
        .ellipsis-cell{
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
        .edit-cell{
            float:left;
            cursor:pointer;
            color:#409eff;
            font-weight:400;
            text-align:left;
        }
        .level1{
            // padding-left:30px;
        }
        .level2{
            padding-left:40px;
        }
        .level3{
            padding-left:80px;
        }
    }
}

</style>
