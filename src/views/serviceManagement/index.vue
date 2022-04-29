<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig" @createService="createService" @updateService="updateService" @deleteService="deleteService" @createVersion="createVersion"></rz-btns>
    <rz-table ref="serviceTable" :config="tableConfig" expand-index expand-operate :expand-operation="expandOperation" :expandConfig="expandConfig" :border="false" expand width="1567px" @publicVersion="publicVersion" @recallVersion="recallVersion" @deleteVersion="deleteVersion" @updateVersion="updateVersion" index check data-url="/service/list" >
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
                        <el-input v-model="serviceForm.createUser"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <!-- <el-col :span="12">
                    <el-form-item label="服务类别">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="服务端口">
                        <el-input v-model="serviceForm.servicePort"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </template>
    </rz-dialog>
    <rz-dialog v-if="updateVisible" :createVisible="updateVisible" :dialogTitle="versionTitle"  @onSubmit="updateSubmit" @outForm="updateOut" width="600px">
    <template #content>
        <el-form :model="versionForm" label-width="100px" label-position="right">
            <!-- <el-form-item label="添加版本级别">
                <el-input v-model='versionForm.level'></el-input>
            </el-form-item> -->
            <el-form-item label="是否强制发布">
                <rz-select v-model='versionForm.ifImposed' domain="AW012"></rz-select>
            </el-form-item>
            <el-form-item label="服务版本">
                <el-input v-model='versionForm.versionNumber'></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model='versionForm.createUser'></el-input>
            </el-form-item>
            <el-form-item label="安装包上传">
                <rz-upload ref="upload" :form="{versionId:versionForm.versionId}" url="/service/synchronize/server/upload" merge-url="/api/merge"></rz-upload>
            </el-form-item>
            <el-form-item label="描述信息">
                <el-input v-model='versionForm.versionDescription'></el-input>
            </el-form-item>
        </el-form>
    </template>
    </rz-dialog>
    <el-dialog v-if="uploadVisible" v-model="uploadVisible" title="文件上传中" destroy-on-close :close-on-click-modal="false" draggable center>
        <div class="file-box">
            <div v-for="(item,index) in fileList">
                <div class="file-name">
                    <el-tooltip :content="item.name" placement="top">
                    <div>{{item.name}}</div>
                    </el-tooltip>
                    <div>{{`${item.up}/${item.size}`}}</div>
                </div>
                <el-progress :percentage="item.percent" class="progress"></el-progress>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage } from 'element-plus';   
import {resetObj} from '/src/utils/public'
import store from '/src/store'
import http from '/src/api/http'
import RzSelect from '../../components//rzSelect.vue'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'
import RzDialog from '../../components/dialog.vue'
import RzUpload from '../../components/upload.vue'

let createVisible = ref(false)
let updateVisible = ref(false)
let uploadVisible = ref(false)
const formConfig=[
    {label:'服务名称:',prop:'serviceNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'服务标识:',prop:'serviceId',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'创建人:',prop:'createUser',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    // {label:'服务类型:',prop:'userNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    // {label:'发布时间:', prop:'',type:'aothor-select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'roleId'},
    // {label:'版本号:',prop:'status',type:'select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'status'},
];
const btnConfig=[
    {text:'新建服务', class:'bg-blue',functionName:'createService'},
    {text:'修改服务', class:'bg-blue',functionName:'updateService'},
    {text:'删除服务', class:'bg-blue',functionName:'deleteService'},
    {text:'更新版本', class:'bg-blue',functionName:'createVersion'},
];
const serviceTitle = ref('新建服务')
const serviceForm=reactive({
    serviceNm:'',
    servicePort:'',
    createUser:'',
    serviceId:''
})
const createService = ()=>{
    serviceTitle.value = '新建服务'
    createVisible.value = true;
}
const updateService = ()=>{
    const arr = serviceTable.value.selection;
    if(arr.length<1){
        ElMessage({
            type:'warning',
            message:'必须选择一条服务'
        })
        return;
    }
    if(arr.length>1){
        ElMessage({
            type:'warning',
            message:'必须选择一条服务'
        })
        return;
    }
    serviceForm.serviceId = arr[0].serviceId
    serviceForm.serviceNm = arr[0].serviceNm
    serviceForm.createUser = arr[0].createUser
    serviceForm.servicePort = arr[0].servicePort
    serviceTitle.value = '修改服务'
    createVisible.value = true;
}
const serverSubmit = ()=>{
    let url = serviceTitle.value == '修改服务'?'/service/update':'/service/add'
    http({
        url,
        method:'post',
        data:serviceForm
    }).then(res=>{
        if(res.code==200){
            ElMessage({
                type:'success',
                message:'成功'
            })
            serverOut();
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const serverOut = ()=>{
    resetObj(serviceForm)
    createVisible.value = false;
    submit();
}
let userInfo = JSON.parse(localStorage.getItem('userInfo'))
const versionForm = reactive({
    versionId:'',
    versionNumber:'',
    createUser:userInfo.userNm,
    ifImposed:'',
    versionDescription:'',
    serviceId:''
})
const versionTitle = ref('更新版本')
const createVersion = ()=>{
    const arr = serviceTable.value.selection;
    if(arr.length<1){
        ElMessage({
            type:'warning',
            message:'必须选择一条服务'
        })
        return;
    }
    if(arr.length>1){
        ElMessage({
            type:'warning',
            message:'必须选择一条服务'
        })
        return;
    }
    versionTitle.value = '更新版本'
    updateVisible.value = true;
    versionForm.serviceId = arr[0].serviceId;
    versionForm.createUser = arr[0].createUser;
}
const fileList = ref([])
const updateSubmit = ()=>{
    let url = versionTitle.value == '更新版本'?'/service/version/add':'/service/version/update'
    http({
        url,
        method:'post',
        data:versionForm
    }).then(res=>{
        if(res.code=="200"){
            versionForm.versionId = res.data.versionId
            upload.value.submitFiles({versionId:versionForm.versionId})
            fileList.value = upload.value.fileList;
                ElMessage({
                    type:'success',
                    message:'更新成功'
                })
                updateOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const updateOut = ()=>{
    resetObj(versionForm);
    updateVisible.value = false;
    uploadVisible.value = true;
    submit();
}
const deleteService = ()=>{
    const arr = serviceTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.serviceId)
    })
    str = str.join(',')
    http({
        url:'/service/delete',
        method:'post',
        data:{serviceId:str}
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
    serviceId:'',
    serviceNm:'',
    createUser:'',
}
const expandOperation=[
    {text:'发布', class:'rz-public',functionName:'publicVersion'},
    {text:'修改', class:'rz-edit',functionName:'updateVersion'},
    {text:'撤回', class:'rz-permission',functionName:'recallVersion'},
    {text:'删除', class:'rz-delete',functionName:'deleteVersion'},
]
const publicVersion = (row)=>{
    http({
        url:'/service/version/release',
        method:'post',
        data:{versionId:row.versionId}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'发布成功'
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
const recallVersion = (row)=>{
    http({
        url:'/service/version/recall',
        method:'post',
        data:{versionId:row.versionId}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'撤回成功'
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
const updateVersion = (row)=>{
    versionTitle.value = '修改版本'
    versionForm.versionId = row.versionId;
    versionForm.versionNumber = row.versionNumber;
    versionForm.createUser = row.createUser;
    versionForm.ifImposed = row.ifImposed;
    versionForm.versionDescription = row.versionDescription;
    updateVisible.value = true;
}
const deleteVersion = (row)=>{
    http({
        url:'/service/version/delete',
        method:'post',
        data:{versionId:row.versionId}
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
const expandConfig = [
    {label:'版本号',prop:'versionNumber',width:'85px'},
    {label:'服务类型',prop:'serviceTypeNm',width:'116px'},
    {label:'发布时间',prop:'releaseDate',width:'200px'},
    {label:'数据包大小',prop:'fileSize',width:'99px'},
    {label:'版本状态',prop:'versionStatusNm',width:'129px'},
    {label:'类别',prop:'versionCategoryNm',width:'120px'},
    {label:'创建人',prop:'createUser',width:'84px'},
    {label:'描述',prop:'versionDescription',width:'245px',ellipsis:true,tooltip:true},
    {label:'发布人',prop:'releaseUser',width:'84px'},
]
const tableConfig=[
    {label:'服务名称',prop:'serviceNm',width:'264px'},
    {label:'服务标识',prop:'serviceId',width:'175px'},
    {label:'端口号',prop:'servicePort',width:'137px'},
    // {label:'服务类型',prop:'createDate',width:''},
    {label:'创建人',prop:'createUser',width:'139px'},
    {label:'最新版本',prop:'lastVersionNumber',width:''},
    {label:'最新版本发布时间',prop:'lastVersionDate',width:'238px'},
    {label:'最新版本数据大小',prop:'lastVersionSize',width:'162px'},
    {label:'最新版本状态',prop:'lastVersionStatusNm',width:'137px'},
]
const serviceTable = ref()
const upload = ref()
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
.file-box{
    display: inline-block;
    width: 330px;
    margin-left: 23px;
    .file-name{
        width:100px;
        float:left;
        div{
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .el-progress{
        padding-top:40px;
        .el-progress-bar__outer{
            height:10px;
        }
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
</style>