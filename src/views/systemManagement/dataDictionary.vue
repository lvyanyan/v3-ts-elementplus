<!--  -->
<template>
<div class='box'>
    <el-card class="left-card">
        <template #header>
            <div class="card-header">
                <span>字典分类</span>
            </div>
        </template>
        <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
        <rz-btns :config="btnConfig" @createDic="createDic"  @editDic="editDic" @deleteDic="deleteDic"></rz-btns>
        <rz-table ref="dicTable" :config="tableConfig" width="1567px" height="460px" index check data-url="/dic/domain/list" @dicDomain="updateTable" >
        </rz-table>
    </el-card>
    <el-card class="right-card">
        <template #header>
            <div class="card-header">
                <span>字典类别</span>
            </div>
        </template>
        <el-form :model="detail.data">
            <el-form-item label="域名称">
                <el-input disabled v-model="detail.data.dicDomainNm"></el-input>
            </el-form-item>
        </el-form>
        <rz-btns :config="detailBtnConfig" @createDetail="createDetail" @editDetail="editDetail" @deleteDetails="deleteDetails"></rz-btns>
        <rz-table ref="detailTable" :config="detailTableConfig" width="322px" height="420px" index check data-url="/dic/detail/list">
        </rz-table>
    </el-card>
    <rz-dialog :createVisible="createDicVisible" :dialogTitle="dicTitle"  @onSubmit="dicSubmit" @outForm="dicOut" width="800px">
        <template #content>
            <el-form :model="dicForm.data" inline :rules="dicRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="域码" prop="dicDomain">
                            <el-input v-model="dicForm.data.dicDomain"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="域值" prop="dicDomainNm">
                            <el-input v-model="dicForm.data.dicDomainNm"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="10" v-model="dicForm.data.dicDesc" class="text-area"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </rz-dialog>
    <rz-dialog :createVisible="createDetailVisible" :dialogTitle="detailTitle"  @onSubmit="detailSubmit" @outForm="detailOut" width="800px">
        <template #content>
            <el-form :model="detailForm.data" inline :rules="detailRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类别名称" prop="dicKey">
                            <el-input v-model="detailForm.data.dicKey"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类别编码" prop="dicValue">
                            <el-input v-model="detailForm.data.dicValue"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </rz-dialog>          
</div>
</template>

<script lang='ts' setup>
import { ref, reactive, getCurrentInstance, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import http from '/src/api/http.ts'
import {resetObj} from '/src/utils/public'
import RzDialog from '../../components/dialog.vue'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'

const createDicVisible = ref(false)
const createDetailVisible = ref(false)
const dicTitle = ref('新建字典分类')
const detailTitle = ref('新建字典类别')
const formConfig=[
    {label:'字典域:',prop:'dicDomain',type:'input',width:'60px',valueWidth:'120px', placeholder:'请输入'},
    {label:'域名称:',prop:'dicDomainNm',type:'input',width:'60px',valueWidth:'120px', placeholder:'请输入'},
    {label:'创建人:',prop:'createUser',type:'input',width:'60px',valueWidth:'120px', placeholder:'请输入'},
    {label:'修改人:',prop:'updateUser',type:'input',width:'60px',valueWidth:'120px', placeholder:'请输入'},
];
const searchData={
    dicDomain:'',
    dicDomainNm:'',
    createUser:'',
    updateUser:'',
}
const btnConfig=[
    {text:'新建', class:'bg-blue',functionName:'createDic'},
    {text:'编辑', class:'bg-green',functionName:'editDic'},
    {text:'删除', class:'bg-red',functionName:'deleteDic'},
];
const detailBtnConfig=[
    {text:'新建', class:'bg-blue',functionName:'createDetail'},
    {text:'编辑', class:'bg-green',functionName:'editDetail'},
    {text:'删除', class:'bg-red',functionName:'deleteDetails'},
];
const tableConfig=[
    {label:'字典域',prop:'dicDomain',width:''},
    {label:'域名称',prop:'dicDomainNm',width:''},
    {label:'描述',prop:'dicDesc',width:''},
    {label:'创建人',prop:'createUser',width:''},
    {label:'创建时间',prop:'createDate',width:''},
    {label:'修改人',prop:'updateUser',width:''},
    {label:'修改时间',prop:'updateDate',width:''},
]
const detailTableConfig=[
    {label:'类型名称',prop:'dicValue',width:''},
    {label:'类型编码',prop:'dicKey',width:''},
]
const dicTable = ref()
const detailTable = ref()
const refs = getCurrentInstance();
const createDic = ()=>{
    dicTitle.value = '新建字典分类'
    createDicVisible.value = true
}
const editDic = ()=>{
    let row = dicTable.value.selection;
    if(row.length>1){
        ElMessage({
            type:'warning',
            message:'请选择一条'
        })
        return;
    }
    if(row.length<1){
        ElMessage({
            type:'warning',
            message:'请先选择'
        })
        return;
    }
    dicForm.data = row[0];
    dicTitle.value = '编辑字典分类'
    createDicVisible.value = true
}
const deleteDic = ()=>{
    let row = dicTable.value.selection;
    if(row.length<1){
        ElMessage({
            type:'warning',
            message:'至少选择一条'
        })
         return;
    }
    let ids = [];
    let dicDomains = [];
    row.forEach(item=>{
        ids.push(item.id);
        dicDomains.push(item.dicDomain)
    })
    ids = ids.join(',')
    dicDomains = dicDomains.join(',')
    let obj = {
        ids,
        dicDomains
    }
    ElMessageBox.confirm(
    '此删除会连同字典一起删除，确认删除?',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    http({
        url:'/dic/domain/delete',
        method:'post',
        data:obj
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'删除成功'
            })
            submit()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
  }).catch(()=>{

  })

}
const dicRules = {
    dicDomainNm:[{required:true,message:'域值不能为空',trigger:'blur'}],
    dicDomain:[{required:true,message:'域码不能为空',trigger:'blur'}],
}
const dicForm = reactive({data:{
    dicDesc:'',
    dicDomain:'',
    dicDomainNm:'',
}})
const dicOut=(val)=>{
    resetObj(dicForm.data)
    submit()
    createDicVisible.value = false
}
const dicSubmit=(val)=>{
    let url = dicTitle.value == '编辑字典分类'?'/dic/domain/update':'/dic/domain/add';
    http({
        url,
        method:'post',
        data:dicForm.data
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'新建成功'
            })
            dicOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const detailRules = {
    dicKey:[{required:true,message:'名称不能为空',trigger:'blur'}],
    dicValue:[{required:true,message:'编码不能为空',trigger:'blur'}],
}
const detailForm = reactive({data:{
    dicDomain:'',
    dicKey:'',
    dicValue:''
}})
const createDetail = ()=>{
    detailTitle.value = '新建字典类别'
    createDetailVisible.value = true
}
const editDetail = ()=>{
    let row = detailTable.value.selection;
    if(row.length>1){
        ElMessage({
            type:'warning',
            message:'请选择一条'
        })
        return;
    }
    if(row.length<1){
        ElMessage({
            type:'warning',
            message:'请先选择'
        })
        return;
    }
    detailForm.data = row[0];
    detailTitle.value = '编辑字典类别'
    createDetailVisible.value = true
}
const deleteDetails = ()=>{
    let row = detailTable.value.selection;
    if(row.length<1){
        ElMessage({
            type:'warning',
            message:'请先选择'
        })
        return;
    }
    let ids = []
    row.forEach(item=>{
        ids.push(item.id)
    })
    ids = ids.join(',')
    let obj = {
        ids
    }
    http({
        url:'/dic/detail/delete',
        method:'post',
        data:obj
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'删除成功'
            })
            submit()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const detailOut=(val)=>{
    resetObj(detailForm.data)
    detailTable.value.onload({dicDomain:detail.data.dicDomain})
    createDetailVisible.value = false
}
const detailSubmit=(val)=>{
    let url = detailTitle.value == '编辑字典类别'?'/dic/detail/update':'/dic/detail/add';
    http({
        url,
        method:'post',
        data:detailForm.data
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'新建成功'
            })
            detailOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const submit=(form)=>{
    dicTable.value.onload(form)
}
const detail = reactive({data:{}})
const updateTable = (val)=>{
    detail.data = val
    detailForm.data.dicDomain = val.dicDomain;
    // detail.name= val.dicDomainNm;
    detailTable.value.onload({dicDomain:detail.data.dicDomain})
}
onMounted(()=>{
})

</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px);
    :deep(.el-card){
        float:left;
        .el-card__header{
            text-align:center;
            font-size:16px;
            color:#000;
            background:#F2F5FA;
            height:50px;
        }
        .el-card__body{
            height:627px;
        }
    }
    .left-card{
        width:1146px;
        margin-right:30px;
    }
    .right-card{
        width:368px;
    }
}
:deep(.el-dialog--center .el-dialog__body){
    padding-left:80px;
}
.text-area{
    width:576px;
    height:236px;
}
</style>