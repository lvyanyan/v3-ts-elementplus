<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig" @createUser="createUser" @deleteItems="deleteItems" @destroyUsers="destroyUsers"></rz-btns>
    <rz-table ref="userTable" :config="tableConfig" width="1567px" index check operate :opeation="tableOperation" @deleteItem="deleteItem" @destroyUser="destroyUser" @resetPwd="resetPwd" @personSetting="personSetting" data-url="/user/list" data-method="post" >
    </rz-table>
    <rz-dialog v-if="settingVisible" :createVisible="settingVisible" dialogTitle="角色配置"  @onSubmit="setSubmit" @outForm="setOutForm" width="800px">
    <template #content>
        <div class="set-content">
            <span class="set-title">角色选择</span>
            <span class="set-box">
            <span class="set-item" v-for="item in checkList">{{item.roleNm}}</span>
            </span>
        </div>        
        <div class="set-list">
            <el-scrollbar>
            <el-checkbox :label="item.roleNm" v-for="item in roleList" @change="check(item,$event)"/>
            </el-scrollbar>
        </div>
    </template>
    </rz-dialog>
    <create-form :createVisible="createVisible" dialogTitle="新建用户" :data="createData" :createRules="createRules" :config="createConfig" @onSubmit="onSubmit" @outForm="outForm"></create-form>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage } from 'element-plus';
import store from '/src/store'
import http from '/src/api/http'
import createForm from '../../components/createForm.vue'
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
    {text:'注销', class:'bg-green',functionName:'destroyUsers'},
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
    let str = []
    arr.forEach(item=>{
        str.push(item.userNo)
    })
    str = str.join(',')
    http({
        url:'/user/cancel',
        method:'post',
        data:{userNos:str}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'注销成功'
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
const createData = {
    userNo:'',
    userNm:'',
    phone:'',
    email:'',
    roleId:'',
    userPassword:''
};
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

const createConfig = [
    {label:'账号', prop:'userNo',type:'input',width:'120px',valueWidth:'200px', placeholder:'请输入账号', required:true,},
    {label:'用户名', prop:'userNm',type:'input',width:'120px',valueWidth:'200px', placeholder:'请输入用户名', required:true,},
    {label:'密码', prop:'userPassword',type:'input',width:'120px',valueWidth:'200px', placeholder:'请输入密码', required:true,},
    {label:'角色选择', prop:'roleId',type:'aothor-select',width:'120px',valueWidth:'200px', placeholder:'请选择角色', required:true,},
    {label:'联系电话', prop:'phone',type:'input',width:'120px',valueWidth:'200px', placeholder:'请输入联系电话'},
    {label:'电子邮箱', prop:'email',type:'input',width:'120px',valueWidth:'200px', placeholder:'请输入电子邮箱'},
];
const tableConfig=[
    {label:'用户账号',prop:'userNo',width:''},
    {label:'用户名',prop:'userNm',width:''},
    {label:'创建时间',prop:'createDate',width:''},
    {label:'角色',prop:'role',width:''},
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
    http({
        url:'/user/cancel',
        method:'post',
        data:{userNos:row.userNo}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'注销成功'
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
                message:'重置密码成功'
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
const check=(obj,val)=>{
    if(val){
        checkList.value.push(obj)
    }else{
        let index = checkList.value.findIndex(item=>{
            return item==obj
        })
        checkList.value.splice(index,1)
    }
}
const checkList = ref([]);
const personSetting = (row)=>{
    settingVisible.value = true;
    setForm.userNo = row.userNo
}
const setForm = reactive({
    roleIds:'',
    userNo:''
})
const setSubmit = ()=>{
    let arr = checkList.value;
    let str = []
    arr.forEach(item=>{
        str.push(item.roleId)
    })
    str = str.join(',')
    setForm.roleIds = str;
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
    checkList.value=[];
    settingVisible.value = false;
}
const roleList = computed(()=>{ return store.state.roles });
const userTable = ref()
const refs = getCurrentInstance();
const createUser = ()=>{
    createVisible.value = true
}
const outForm=(val)=>{
    createVisible.value = val
}
const onSubmit=(val)=>{
    http({
        url:'/user/create',
        method:'post',
        data:val
    }).then(res=>{
        createVisible.value = false;
        submit()
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
        overflow-x:scroll;
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