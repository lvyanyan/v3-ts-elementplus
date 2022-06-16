<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData" @change-data="recieveData"></rz-form>
    <rz-btns :config="btnConfig" @dropService="dropService" @createService="createService" @updateService="updateService" @deleteService="deleteService" @createVersion="createVersion"></rz-btns>
    <rz-table ref="serviceTable" @editRow="editRow" @editChild="updateVersion" :data-params="dataParams" :config="tableConfig" expand-index expand-operate :expand-operation="expandOperation" :expandConfig="expandConfig" :border="false" expand width="1567px" @publicVersion="publicVersion" @recallVersion="recallVersion" @deleteVersion="deleteVersion" @updateVersion="updateVersion" index check data-url="/service/list" >
    </rz-table>
    <rz-dialog v-if="createVisible" :createVisible="createVisible" :dialogTitle="serviceTitle"  @onSubmit="serverSubmit" @outForm="serverOut" width="800px">
    <template #content>
        <el-form inline :model="serviceForm" :rules="serviceRules" label-width="80px" label-position="right">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应用名称" prop="serviceNm">
                        <el-input v-model="serviceForm.serviceNm" placeholder="请输入应用名称" maxlength="64" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建人" prop="createUser">
                        <el-input v-model="serviceForm.createUser" placeholder="请输入创建人" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <!-- <el-col :span="12">
                    <el-form-item label="应用类别">
                        <el-input v-model="serviceForm.serviceNm"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="应用端口" prop="servicePort">
                        <el-input v-model="serviceForm.servicePort" :disabled="serviceTitle=='修改应用'" placeholder="请输入应用端口"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </template>
    </rz-dialog>
    <el-dialog custom-class="version-dialog" v-model="updateVisible" :title="versionTitle" width="1063px" destroy-on-close :close-on-click-modal="false" draggable center :before-close="updateOut">
        <div class="top-card">
            <el-button type="primary" @click="updateSubmit">保存</el-button>
            <el-button @click="updateOut">取消</el-button>
            <el-form inline :model="versionForm"  label-position="right" :rules="versionRules">
                <el-row>
                <el-col :span="12">
                <el-form-item label="添加版本级别" prop="versionLevel">
                    <el-select v-model='versionForm.versionLevel' @change="changeVersion" :disabled="versionTitle=='修改版本'">
                        <el-option v-for="item in levelList" :label="item.dicValue" :value="item.dicKey"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="应用版本">
                    <el-input v-model='versionForm.versionNumber' disabled></el-input>
                </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="12">
                <el-form-item label="是否强制发布" prop="ifImposed">
                    <rz-select v-model='versionForm.ifImposed' domain="AW012" :disabled="versionForm.versionStatus=='03'"></rz-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="创建人" prop="createUser">
                    <el-input v-model='versionForm.createUser' maxlength="100" show-word-limit :disabled="versionForm.versionStatus=='03'"></el-input>
                </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="12">    
                <el-form-item label="版本类型">
                    <rz-select v-model='versionForm.serviceType' domain="AW011" :clearable="false" :disabled="versionForm.versionStatus=='03'"></rz-select>
                </el-form-item>
                </el-col>
                <el-col :span="12" v-if="versionForm.serviceType=='01'">    
                <el-form-item label="地址链接" prop="serviceUrl">
                    <el-input v-model='versionForm.serviceUrl'  :disabled="versionForm.versionStatus=='03'"></el-input>
                </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="24">    
                <el-form-item label="描述信息">
                    <el-input type="textarea" v-model='versionForm.versionDescription' maxlength="2000" show-word-limit :disabled="versionForm.versionStatus=='03'"></el-input>
                </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="bottom-card" v-if="versionForm.serviceType=='00'">
            <div>
            <span>安装包上传</span>
            <rz-upload ref="upload" :form="{versionId:versionForm.versionId}" url="/service/synchronize/server/upload" :disabled="versionForm.versionStatus=='03'" merge-url="/api/merge"></rz-upload>
            </div>
        </div>        
    </el-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus';   
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
const formConfig=[
    {label:'应用名称:',prop:'serviceNm',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'应用标识:',prop:'serviceId',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'创建人:',prop:'createUser',type:'input',width:'80px',valueWidth:'160px', placeholder:'请输入'},
    {label:'应用状态:',prop:'serviceStatus',type:'select',width:'80px',domain:'AW021',valueWidth:'160px', placeholder:'请输入'},
    // {label:'发布时间:', prop:'',type:'aothor-select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'roleId'},
    // {label:'版本号:',prop:'status',type:'select',width:'80px',valueWidth:'160px', placeholder:'请选择',domain:'status'},
];
const btnConfig=[
    {text:'新建应用', class:'bg-blue',functionName:'createService'},
    {text:'修改应用', class:'bg-blue',functionName:'updateService'},
    {text:'删除应用', class:'bg-blue',functionName:'deleteService'},
    {text:'应用下架', class:'bg-blue',functionName:'dropService'},
    {text:'更新版本', class:'bg-blue',functionName:'createVersion'},
];
const dataParams = reactive({})
const recieveData = (n)=>{
    for(let i in n){
        dataParams[i] = n[i]
    }
}
const serviceTitle = ref('新建应用')
const serviceForm=reactive({
    serviceNm:'',
    servicePort:'',
    createUser:'',
    serviceId:''
})
const serviceRules = {
    serviceNm:[{required:true,message:'应用名称不能为空',trigger:'blur'}],
    createUser:[{required:true,message:'创建人不能为空',trigger:'blur'}],
    servicePort:[{required:true,message:'端口号不能为空',trigger:'blur'}],
}
const versionRules = {
    versionLevel:[{required:true,message:'请选择版本级别',trigger:'blur'}],
    createUser:[{required:true,message:'创建人不能为空',trigger:'blur'}],
    serviceUrl:[{required:true,message:'请输入地址链接',trigger:'blur'}],
    ifImposed:[{required:true,message:'请选择是否强制',trigger:'blur'}],
}
const createService = ()=>{
    serviceTitle.value = '新建应用'
    createVisible.value = true;
}
const levelList = ref([])
const updateService = ()=>{
    const arr = serviceTable.value.selection;
    if(arr.length<1){
        ElMessage({
            type:'warning',
            message:'必须选择一条应用'
        })
        return;
    }
    if(arr.length>1){
        ElMessage({
            type:'warning',
            message:'必须选择一条应用'
        })
        return;
    }
    serviceForm.serviceId = arr[0].serviceId
    serviceForm.serviceNm = arr[0].serviceNm
    serviceForm.createUser = arr[0].createUser
    serviceForm.servicePort = arr[0].servicePort
    serviceTitle.value = '修改应用'
    createVisible.value = true;
}
const editRow = (row)=>{
    serviceForm.serviceId = row.serviceId
    serviceForm.serviceNm = row.serviceNm
    serviceForm.createUser = row.createUser
    serviceForm.servicePort = row.servicePort
    serviceTitle.value = '修改应用'
    createVisible.value = true;
}
const serverSubmit = ()=>{
    let url = serviceTitle.value == '修改应用'?'/service/update':'/service/add'
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
    serviceType:'00',
    serviceUrl:'',
    createUser:userInfo.userNm,
    ifImposed:'',
    versionLevel:'',
    versionDescription:'',
    serviceId:''
})
const versionTitle = ref('更新版本')
const createVersion = ()=>{
    const arr = serviceTable.value.selection;
    if(arr.length<1){
        ElMessage({
            type:'warning',
            message:'必须选择一条应用'
        })
        return;
    }
    if(arr.length>1){
        ElMessage({
            type:'warning',
            message:'必须选择一条应用'
        })
        return;
    }
    http({
        url:'/service/version/level',
        method:'get',
        params:{serviceId:arr[0].serviceId}
    }).then(res=>{
        if(res.code==200){
            levelList.value = res.data
            versionTitle.value = '更新版本'
            updateVisible.value = true;
            versionForm.serviceId = arr[0].serviceId;
            versionForm.createUser = arr[0].createUser;
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const changeVersion = (val)=>{
    http({
        url:'/service/version/number',
        method:'get',
        params:{serviceId:versionForm.serviceId,versionLevel:val}
    }).then(res=>{
        if(res.code==200){
            versionForm.versionNumber = res.data
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}

const updateSubmit = ()=>{
    let url = versionTitle.value == '更新版本'?'/service/version/add':'/service/version/update'
    http({
        url,
        method:'post',
        data:versionForm
    }).then(res=>{
        if(res.code=="200"){
            if(versionTitle.value == '更新版本'){
                versionForm.versionId = res.data.versionId
                versionTitle.value = '修改版本'
            }
            // upload.value.submitFiles({versionId:versionForm.versionId})
                ElMessage({
                    type:'success',
                    message:'更新成功'
                })
                // updateOut()
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
    submit();
}
const dropService = ()=>{
 const arr = serviceTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.serviceId)
    })
    str = str.join(',')
    ElMessageBox.confirm(
    '此操作会连同版本一起下架，确认下架?',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    http({
        url:'/service/offShelfApplication',
        method:'post',
        data:{serviceId:str}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'下架成功'
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
    ElMessageBox.confirm(
    '此删除会连同版本一起删除，确认删除?',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
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
  }).catch(()=>{

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
    {text:'撤回', class:'rz-recall',functionName:'recallVersion'},
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
const updateVersion = (row,parent)=>{
    http({
        url:'/service/version/level',
        method:'get',
        params:{serviceId:parent.serviceId}
    }).then(res=>{
        if(res.code==200){
            levelList.value = res.data
            versionTitle.value = '修改版本';
            versionForm.versionId = row.versionId;
            versionForm.serviceType = row.serviceType;
            versionForm.serviceUrl = row.serviceUrl;
            versionForm.versionNumber = row.versionNumber;
            versionForm.createUser = row.createUser;
            versionForm.ifImposed = row.ifImposed;
            versionForm.versionStatus = row.versionStatus;
            versionForm.versionLevel = row.versionLevel;
            versionForm.versionDescription = row.versionDescription;
            updateVisible.value = true;
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
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
    {label:'版本号',prop:'versionNumber',width:'85px',edit:true},
    {label:'应用类型',prop:'serviceTypeNm',width:'116px'},
    {label:'发布时间',prop:'releaseDate',width:'200px'},
    {label:'数据包大小',prop:'fileSize',width:'99px'},
    {label:'版本状态',prop:'versionStatusNm',width:'129px'},
    {label:'是否强制发布',prop:'ifImposedNm',width:'129px'},
    {label:'类别',prop:'versionCategoryNm',width:'120px'},
    {label:'创建人',prop:'createUser',width:'84px'},
    {label:'描述',prop:'versionDescription',width:'245px',ellipsis:true,tooltip:true},
    {label:'发布人',prop:'releaseUser',width:'84px'},
]
const tableConfig=[
    {label:'应用名称',prop:'serviceNm',width:'264px',edit:true},
    {label:'应用标识',prop:'serviceId',width:'175px'},
    {label:'端口号',prop:'servicePort',width:'137px'},
    // {label:'应用类型',prop:'createDate',width:''},
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
    serviceTable.value.onload(form,'1')
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
:deep(.version-dialog){
    height:651px;
    .top-card,.bottom-card{
        width:934px;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .top-card{
        height:328px;
        padding:28px 33px;
        .el-button{
            width:150px;
            height:44px;
            margin-bottom:27px;
        }
        .el-form-item__label{
            width:134px;
            font-size: 16px;
            line-height:50px;
            font-family: SourceHanSansCN-Normal, SourceHanSansCN;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.9);
        }
        .el-select,.el-input,.el-input__inner{
            width:300px;
            height:50px;
        }
        .el-textarea{
            width:772px;
        }
    }
    .bottom-card{
        height:50px;
        line-height:50px;
        padding:30px 33px 35px 49px;
        margin-top:31px;
        .el-button{
            margin-left:23px;
            width:162px;
            height:50px;
        }
    }
}
</style>