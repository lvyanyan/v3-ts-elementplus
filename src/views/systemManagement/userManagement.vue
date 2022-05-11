<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig" @createUser="createUser" @deleteItems="deleteItems" @destroyUsers="destroyUsers"></rz-btns>
    <rz-table ref="userTable" :config="tableConfig" width="1567px" index check operate :opeation="tableOperation" @deleteItem="deleteItem" @destroyUser="destroyUser" @resetPwd="resetPwd" @personSetting="personSetting" data-url="/user/list" data-method="post" >
    </rz-table>
    <rz-dialog v-if="settingVisible" :createVisible="settingVisible" dialogTitle="角色配置"  @onSubmit="setSubmit" @outForm="setOutForm" width="800px">
    <template #content>
        <el-form class="set-form" :model="setForm">
            <el-form-item label="角色选择">
                <el-select v-model="setForm.roleIds" multiple clear>
                    <el-option  v-for="item in roleList" :label="item.roleNm" :value="item.roleId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </template>
    </rz-dialog>
    <rz-dialog v-if="createVisible" :createVisible="createVisible" dialogTitle="新建用户"  @onSubmit="onSubmit" @outForm="outForm" width="800px">
    <template #content>
        <el-form :inline="true" class="rz-form" :model="createData" :rules="createRules" label-position="right" label-width="120px">
            <el-form-item label="帐号" prop="userNo">
                <el-input v-model="createData.userNo" placeholder="请输入帐号">
                </el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userNm">
                <el-input v-model="createData.userNm" placeholder="请输入用户名">
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="createData.userPassword" placeholder="请输入密码">
                </el-input>
            </el-form-item>
            <el-form-item label="角色选择" prop="roleId">
                <el-select v-model="createData.roleId"  placeholder="请选择角色">
                        <el-option v-for="item in authorlist" :label="item.roleNm" :value="item.roleId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="createData.phone" placeholder="请输入联系电话">
                </el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="createData.email" placeholder="请输入电子邮箱">
                </el-input>
            </el-form-item>
        </el-form>
    </template>
    </rz-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage } from 'element-plus';
import {resetObj} from '/src/utils/public'
import store from '/src/store'
import http from '/src/api/http'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'
import RzDialog from '../../components/dialog.vue'

let createVisible = ref(false)

const formConfig=[
    {label:'用户账号:',prop:'userNo',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'用户名:',prop:'userNm',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'用户角色:', prop:'roleId',type:'aothor-select',width:'80px',valueWidth:'200px', placeholder:'请选择',domain:'roleId'},
    {label:'用户状态:',prop:'status',type:'select',width:'80px',valueWidth:'200px', placeholder:'请选择',domain:'AW003'},
];
const btnConfig=[
    {text:'新建用户', class:'bg-blue',functionName:'createUser'},
    {text:'删除', class:'bg-red',functionName:'deleteItems'},
    {text:'注销/恢复', class:'bg-green',functionName:'destroyUsers'},
];
const deleteItems = ()=>{
    const arr = userTable.value.selection;
    if(arr.length<1){
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
        data:{userNos:str}
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
const destroyUsers = ()=>{
    const arr = userTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = [],status = arr[0].statusCode;
    arr.forEach(item=>{
        if(item.statusCode == status){
            str.push(item.userNo)
        }else{
            status = false;
        }
    })
    if(status == false){
            ElMessage({
                type:'warning',
                message:'不能同时操作不同状态的用户'
            })
            return;
    }
    str = str.join(',')
    if(status == '01'){
        status = '02'
    }else{
        status = '01'
    }
    http({
        url:'/user/cancel',
        method:'post',
        data:{userNos:str,status}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'操作成功'
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
const createData = reactive({
    userNo:'',
    userNm:'',
    phone:'',
    email:'',
    roleId:'',
    userPassword:''
});
const searchData = {
    userNo:'',
    userNm:'',
    roleId:'',
    status:''
}
const createRules = {
    userNo:[{required:true,message:'帐号不能为空',trigger:'blur'}],
    userNm:[{required:true,message:'用户名不能为空',trigger:'blur'}],
    roleId:[{required:true,message:'角色不能为空',trigger:'blur'}],
    userPassword:[{required:true,message:'密码不能为空',trigger:'blur'}],
}

const tableConfig=[
    {label:'用户账号',prop:'userNo',width:''},
    {label:'用户名',prop:'userNm',width:''},
    {label:'创建时间',prop:'createDate',width:''},
    {label:'角色',prop:'roleNm',width:''},
    {label:'状态',prop:'status',width:''},
    {label:'联系电话',prop:'phone',width:''},
    {label:'邮箱',prop:'email',width:''},
]
const tableOperation=[
    {text:'注销', class:'rz-destroy',functionName:'destroyUser'},
    {text:'删除', class:'rz-delete',functionName:'deleteItem'},
    {text:'重置密码', class:'rz-reset',functionName:'resetPwd'},
    {text:'个人设置', class:'rz-setting',functionName:'personSetting'},
]
const destroyUser=(row)=>{
    let statusCode = '01'
    if(row.statusCode == '01'){
        statusCode = '02'
    }else{
        statusCode = '01'
    }
    http({
        url:'/user/cancel',
        method:'post',
        data:{userNos:row.userNo,status:statusCode}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'操作成功'
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
const deleteItem=(row)=>{
    http({
        url:'/user/delete',
        method:'post',
        data:{userNos:row.userNo}
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
const resetPwd = (row)=>{
    http({
        url:'/user/reset/password',
        method:'post',
        data:{userNo:row.userNo}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'重置成功，密码为Ccb123456'
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
let settingVisible = ref(false);
const personSetting = (row)=>{
    http({
        url:'/user/get/role',
        method:'post',
        data:{userNo:row.userNo}
    }).then(res=>{
        if(res.code==200){
            setForm.roleIds = []
            res.data.forEach(item=>{
                setForm.roleIds.push(item.roleId)
            })
            settingVisible.value = true;
            setForm.userNo = row.userNo
        }
    })
}
const setForm = reactive({
    roleIds:'',
    userNo:''
})
const setSubmit = ()=>{
    setForm.roleIds = setForm.roleIds.join(',')
    http({
        url:'/user/assign/role',
        method:'post',
        data:setForm
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'设置成功'
            })
            settingVisible.value = false;
            submit()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const setOutForm = ()=>{
    resetObj(setForm)
    settingVisible.value = false;
}
const roleList = computed(()=>{ return store.state.roles });
const userTable = ref()
const refs = getCurrentInstance();
const authorlist = ref([])
const createUser = ()=>{
    http({
        url:'/role/list/all',
        method:'post'
    }).then(res=>{
        authorlist.value = res.data
        createVisible.value = true
    })
}
const outForm=()=>{
    resetObj(createData)
    createVisible.value = false
    submit();
}
const onSubmit=()=>{
    http({
        url:'/user/create',
        method:'post',
        data:createData
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'新建成功'
            })
        outForm();
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }

    })
}
const submit=(form)=>{
    userTable.value.onload(form)
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
:deep(.set-form){
    margin-left:126px;
    .el-form-item__label{
        color:#000;
        font-size:18px;
        line-height:50px;
    }
    .el-select{
        width:411px;
        height:50px;
        .el-input__inner{
            height:50px !important;
        }
    }
}
</style>