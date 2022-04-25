<!--  -->
<template>
<div class='box'>

    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig" @createService="createService" @updateService="updateService" @deleteService="deleteService" @updateVersion="updateVersion"></rz-btns>
    <rz-table ref="serviceTable" :config="tableConfig" expand-index expand-operate :expandOperation="expandOperation" :expandConfig="expandConfig" :border="false" expand width="1567px" index check :opeation="tableOperation" @deleteItem="deleteItem" @destroyUser="destroyUser" @resetPwd="resetPwd" @personSetting="personSetting" data-url="/user/list" data-method="post" >
    </rz-table>
    <rz-dialog v-if="createVisible" :createVisible="createVisible" :dialogTitle="serviceTitle"  @onSubmit="serverSubmit" @outForm="serverOut" width="800px">
    <template #content>
        <el-form inline :model="serviceForm" label-width="80px" label-position="right">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="服务名称">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建人">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="服务类别">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="服务端口">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </template>
    </rz-dialog>
    <rz-dialog v-if="updateVisible" :createVisible="updateVisible" dialogTitle="更新版本"  @onSubmit="updateSubmit" @outForm="updateOut" width="600px">
    <template #content>
        <el-form :model="versionForm" label-width="100px" label-position="right">
            <el-form-item label="添加版本级别">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="服务版本">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="安装包上传">
                <rz-upload ref="upload" url="/api/upload/" merge-url="/api/merge"></rz-upload>
            </el-form-item>
            <el-form-item label="描述信息">
                <el-input></el-input>
            </el-form-item>
        </el-form>
    </template>
    </rz-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage } from 'element-plus';   
import {ArrowRight,ArrowDown} from '@element-plus/icons-vue'
import store from '/src/store'
import http from '/src/api/http'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'
import RzDialog from '../../components/dialog.vue'
import RzUpload from '../../components/upload.vue'

let createVisible = ref(false)
let updateVisible = ref(false)
const formConfig=[
    {label:'服务名称:',prop:'userLoginNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'服务标识:',prop:'userNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'服务类型:',prop:'userNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'发布时间:', prop:'roleId',type:'aothor-select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'roleId'},
    {label:'版本号:',prop:'status',type:'select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'status'},
];
const btnConfig=[
    {text:'新建服务', class:'bg-blue',functionName:'createService'},
    {text:'修改服务', class:'bg-blue',functionName:'updateService'},
    {text:'删除服务', class:'bg-blue',functionName:'deleteService'},
    {text:'更新版本', class:'bg-blue',functionName:'updateVersion'},
];
const serviceTitle = ref('新建服务')
const serviceForm=reactive({
    serviceNm:''
})
const createService = ()=>{
    serviceTitle.value = '新建服务'
    createVisible.value = true;
}
const updateService = ()=>{
    serviceTitle.value = '修改服务'
    createVisible.value = true;
}
const serverSubmit = ()=>{

}
const serverOut = ()=>{
    createVisible.value = false;
}
const versionForm = reactive({

})
const updateVersion = ()=>{
    updateVisible.value = true;
}
const updateSubmit = ()=>{

}
const updateOut = ()=>{
    updateVisible.value = false;
}
const deleteService = ()=>{
    const arr = serviceTable.value.selection;
    if(!arr){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.userNo)
    })
    str = str.join(',')
    http({
        url:'/user/delete',
        method:'post',
        data:{userNo:str}
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
const searchData = {
    userLoginNm:'',
    userNm:'',
    roleId:'',
    status:''
}
const expandOperation=[
    {text:'发布', class:'rz-destroy',functionName:'publicVersion'},
    {text:'修改', class:'rz-delete',functionName:'updateVersion'},
    {text:'删除', class:'rz-delete',functionName:'deleteVersion'},
]
const expandConfig = [
    {label:'版本号',prop:'userNo',width:''},
    {label:'发布时间',prop:'userNo',width:''},
    {label:'数据包大小',prop:'userNo',width:''},
    {label:'版本状态',prop:'userNo',width:''},
    {label:'类别',prop:'userNo',width:''},
    {label:'描述',prop:'userNo',width:''},
    {label:'创建人',prop:'userNo',width:''},
]
const tableConfig=[
    {label:'服务名称',prop:'userNo',width:''},
    {label:'服务标识',prop:'userNm',width:''},
    {label:'端口号',prop:'userNm',width:''},
    {label:'服务类型',prop:'createDate',width:''},
    {label:'创建人',prop:'userNm',width:''},
    {label:'最新版本',prop:'status',width:''},
    {label:'最新版本发布时间',prop:'role',width:''},
    {label:'最新版本数据大小',prop:'phone',width:''},
    {label:'最新版本状态',prop:'email',width:''},
]
const serviceTable = ref()
const refs = getCurrentInstance();
const submit=(form)=>{
    serviceTable.value.onload(form)
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px)
}
:deep(.dialog-footer){
    margin-top:20px;
}
:deep(.el-dialog .set-title){
        font-size:18px;
        float:left;
        width:72px;
        line-height:50px;
        margin-right:15px;
        color:#000;
}
:deep(.el-dialog .set-content){
        height:50px;
        width:500px;
        margin:0 150px;
}
:deep(.el-dialog .set-list){
        height:122px;
        width:411px;
        margin-top:10px;
        margin-left:237px;
        border-radius: 3px;
        border: 1px solid rgba(32, 53, 128, 0.16);
        .el-checkbox{
            display:block;
            padding-left:28px;
            height:50px;
            line-height:50px;
            font-size:14px;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background:rgba(32, 53, 128, 0.2);
            border-color:rgba(32, 53, 128, 0.2);
        }
        .el-checkbox__input.is-focus .el-checkbox__inner{
            border-color:rgba(32, 53, 128, 0.2);
        }
        .el-checkbox__input.is-checked + .el-checkbox__label{
            color:#191919;
        }
}
:deep(.el-dialog .set-box){
        float:left;
        width:411px;
        height:50px;
        border-radius: 3px;
        border: 1px solid rgba(32, 53, 128, 0.16);
        .set-item{
           font-size:14px;
           float:left;
           color:#191919;
           width:69px;
           text-align:center;
           line-height:50px;
        }
}
:deep(.el-table__expand-column){
    
}
</style>