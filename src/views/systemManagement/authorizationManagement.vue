<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig"  @createAuthor="createAuthor" @deleteItems="deleteItems"></rz-btns>
    <rz-table ref="authorTable" :config="tableConfig" width="1567px" index check operate :opeation="tableOperation" data-url="/role/list" @memberShip="memberShip" @assignPermission="assignPermission" @deleteItem="deleteItem" data-method="post"></rz-table>
    <rz-dialog :createVisible="createVisible" dialogTitle="新建角色"  @onSubmit="onSubmit" @outForm="outForm" width="800px">
        <template #content>
        <el-form class="rz-form" :model="createForm" :rules="createRules" label-width="120px" label-position="right">
            <el-form-item label="角色名称:" prop="roleNm">
                <el-input v-model="createForm.roleNm" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input type="textarea" v-model="createForm.description" :rows="8" placeholder="请输入角色描述"></el-input>
            </el-form-item>
        </el-form>
        </template>
    </rz-dialog>
    <rz-dialog :createVisible="memberVisible" dialogTitle="成员管理" :sub="false"  @outForm="memberOut" width="800px">
        <template #content>
        <el-form class="rz-form" :model="memberForm"  label-width="120px" label-position="right">
            <el-form-item label="角色名称:">
                <el-input v-model="memberForm.roleNm" disabled placeholder="请输入角色名称"></el-input>
            </el-form-item>
        </el-form>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>用户</span>
                </div>
            </template>
            <rz-form :config="userConfig" @submit="userSubmit" :data="userData"></rz-form>
            <rz-btns :config="userBtns" @addUser="addUser" @deleteUser="deleteUser"></rz-btns>
            <rz-table ref="userTable" :config="userTableConfig" width="670px" height="162px" index check data-url="/role/query/user" :data-params="{roleId:memberForm.roleId}"></rz-table>
        </el-card>
        </template>
    </rz-dialog>
    <rz-dialog :createVisible="addUserVisible" dialogTitle="添加系统中已有用户"  @onSubmit="addUserSubmit" @outForm="addUserOut" width="800px">
        <template #content>
            <rz-form :config="noneConfig" @submit="noneSubmit" :data="noneData"></rz-form>
            <rz-table ref="noneTable" :config="noneTableConfig" width="670px" height="362px" index check data-url="/role/list/notAssociateUser" :data-params="{roleId:memberForm.roleId}"></rz-table>
        </template>
    </rz-dialog>
    <rz-dialog :createVisible="permissionVisible" dialogTitle="权限分配"  @onSubmit="permissionSubmit" @outForm="permissionOut" width="800px">
        <template #content>
            <el-form class="rz-form" :model="permissionForm"  label-width="120px" label-position="right">
                <el-form-item label="角色名称">
                    <el-input v-model="permissionForm.roleNm" disabled placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="权限分配">
                    <el-tree ref="menuTree" node-key="id" :props="{label:'menuNm'}" :default-checked-keys="checkedList" show-checkbox :data="menuData" default-expand-all></el-tree>
                </el-form-item>
            </el-form>
        </template>
    </rz-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, reactive, getCurrentInstance} from 'vue'
import { ElMessage } from 'element-plus';
import http from '/src/api/http.ts'
import {resetObj} from '/src/utils/public'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'
import RzDialog from '../../components/dialog.vue'

const createVisible = ref(false)

const formConfig=[
    {label:'角色名称:',prop:'roleNm',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'创建人:',prop:'createUser',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'修改人:',prop:'updateUser',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
];
const searchData={
    roleNm:'',
    createUser:'',
    updateUser:'',
}
const btnConfig=[
    {text:'新建角色', class:'bg-blue',functionName:'createAuthor'},
    {text:'删除', class:'bg-red',functionName:'deleteItems'},
];
const deleteItems = ()=>{
    const arr = authorTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.roleId)
    })
    str = str.join(',')
    http({
        url:'/role/delete',
        method:'post',
        data:{roleIds:str}
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
const createRules = {
    roleNm:[{required:true,message:'角色不能为空',trigger:'blur'}],
}
const createForm = reactive({
    roleNm:'',
    description:''
})
const tableOperation=[
    {text:'删除', class:'rz-delete',functionName:'deleteItem'},
    {text:'权限配置', class:'rz-permission',functionName:'assignPermission'},
    {text:'成员管理', class:'rz-member',functionName:'memberShip'},
]
const deleteItem=(row)=>{
    http({
        url:'/role/delete',
        method:'post',
        data:{roleIds:row.roleId}
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
const permissionForm = reactive({
    roleId:'',
    roleNm:'',
    userNo:'',
})
const permissionVisible = ref(false);
const checkedList = ref([])
const assignPermission = (row)=>{
    http({
        url:'/role/list/visibleMenu',
        method:'post',
        data:{roleId:row.roleId}
    }).then(res=>{
        if(res.code==200){
            permissionForm.roleId = row.roleId;
            permissionForm.roleNm = row.roleNm;
            menuData.value = [res.data];
            menuData.value.forEach(item=>{
                if(item.ifAssigned==true){
                    checkedList.value.push(item.id)
                }
            })
            permissionVisible.value = true;
        }
    })
}
const permissionOut = ()=>{
    permissionVisible.value=false;
    resetObj(permissionForm);
    submit()
}
const permissionSubmit = ()=>{
    let arr = menuTree.value!.getCheckedNodes(false,false)
    let str= []
    let menuPaths = []
    arr.forEach(item=>{
        str.push(item.id)
        menuPaths.push(item.menuPath)
    })
    str = str.join(',')
    menuPaths = menuPaths.join(',')
    let obj = {
        roleId:permissionForm.roleId,
        menuIds: str,
        menuPaths
    }
    http({
        url:'/role/assign/menu',
        method:'post',
        data:obj
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'分配成功'
            })
            permissionOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const menuData = ref([])
const memberForm = reactive({
    roleId:'',
    roleNm:'',
    userNo:'',
})
const userData = {
    userNo:'',
    userNm:''
}
const noneData = {
    userNo:'',
    userNm:''
}
const noneConfig = [
    {label:'用户帐号:',prop:'userNo',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
    {label:'用户名:',prop:'userNm',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
]
const userConfig = [
    {label:'用户帐号:',prop:'userNo',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
    {label:'用户名:',prop:'userNm',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
]
const noneTableConfig = [
    {label:'用户账号',prop:'userNo',width:''},
    {label:'用户名',prop:'userNm',width:''},
    {label:'状态',prop:'status',width:''},
]
const userTableConfig = [
    {label:'用户账号',prop:'userNo',width:''},
    {label:'用户名',prop:'userNm',width:''},
    {label:'状态',prop:'status',width:''},
]
const userBtns = [
    {text:'添加用户', class:'bg-blue',functionName:'addUser'},
    {text:'删除用户', class:'bg-red',functionName:'deleteUser'},
]
const addUserVisible = ref(false)
const addUser = ()=>{
    addUserVisible.value = true;
}
const addUserSubmit = ()=>{
    let arr = noneTable.value.selection;
    let str = []
    arr.forEach(item=>{
        str.push(item.userNo)
    })
    str = str.join(',')
    let obj = {
        roleId:memberForm.roleId,
        userNos:str
    }
    http({
        url:'/role/add/user',
        method:'post',
        data:obj
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'添加成功'
            })
            addUserOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const addUserOut = ()=>{
    addUserVisible.value = false;
    userTable.value.onload();
}
const deleteUser = ()=>{
    const arr = userTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.userNo)
    })
    str = str.join(',')
    let obj = {
        roleId:memberForm.roleId,
        userNos:str
    }
    http({
        url:'/role/delete/relation',
        method:'post',
        data:obj
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'删除成功'
            })
            userSubmit()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })

}
const memberOut = ()=>{
    memberVisible.value = false;
    resetObj(memberForm)
}
const memberVisible = ref(false);
const userSubmit = (form)=>{
    userTable.value.onload(form)
}
const noneSubmit = (form)=>{
    noneTable.value.onload(form)
}
const memberShip = (row)=>{
    memberVisible.value = true;
    memberForm.roleId = row.roleId
    memberForm.roleNm = row.roleNm
}
const tableConfig=[
    {label:'角色名称',prop:'roleNm',width:''},
    {label:'描述',prop:'description',width:''},
    {label:'创建人',prop:'createUser',width:''},
    {label:'创建时间',prop:'createDate',width:''},
    {label:'修改人',prop:'updateUser',width:''},
    {label:'修改时间',prop:'updateDate',width:''},
]
const authorTable = ref();
const userTable = ref();
const noneTable = ref();
const menuTree = ref();
const refs = getCurrentInstance();
const createAuthor = ()=>{
    createVisible.value = true
}
const outForm=(val)=>{
    resetObj(createForm)
    submit()
    createVisible.value = false
}
const onSubmit=()=>{
    http({
        url:'/role/create',
        method:'post',
        data:createForm
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'新建成功'
            })
            outForm()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const submit=(form)=>{
    authorTable.value.onload(form)
}

</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px)
}
.rz-form{
    :deep( .el-form-item){
        margin-right:50px;
    }
}
:deep(.el-card){
    margin-bottom:20px;
    height:550px;
    box-shadow:none;
}
:deep(.el-card__header){
    text-align:center;
    font-size:16px;
    color:#000;
    background:#F2F5FA;
    height:50px;
}
:deep(.el-card__body){
    .rz-form {
        .el-form-item{
            margin-right:20px;
        }
    }
}
</style>