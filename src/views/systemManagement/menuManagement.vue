<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData" @change-data="recieveData"></rz-form>
    <rz-btns :config="btnConfig" @createMenu="createMenu" @deleteItems="deleteItems"></rz-btns>
    <me-table ref="menuTable" expand expandIndex @editRow="editRow" :config="tableConfig" width="1567px" nopage data-url="/menu/list" index check :data-params="dataParams"></me-table>
        <rz-dialog :createVisible="createMenuVisible" :dialogTitle="formTitle"  @onSubmit="menuSubmit" @outForm="menuOut" width="984px">
        <template #content>
            <el-form class="menu-form" :model="menuForm" inline :rules="menuRules" label-width="80px" label-position="right">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-cascader ref="cascader" :props="casProps" @change="getValue" :options="menuList" v-model="menuForm.parent" clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单地址">
                            <el-input v-model="menuForm.iconUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuNm">
                            <el-input v-model="menuForm.menuNm"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="menuOrder">
                            <el-input v-model="menuForm.menuOrder"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-select v-model="menuForm.menuType">
                                <el-option v-for="item in menuTypeList" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="可见" prop="menuVisible">
                            <rz-select v-model="menuForm.menuVisible" domain="AW008">
                            </rz-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="menuForm.remark" :rows="6" maxlength="1000" show-word-limit class="menu-remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </rz-dialog> 
</div>
</template>
<script lang='ts' setup>
import { ref, getCurrentInstance, reactive} from 'vue'
import http from '/src/api/http.ts'
import { ElMessage,ElMessageBox } from 'element-plus'; 
import {resetObj} from '/src/utils/public'
import RzDialog from '../../components/dialog.vue'
import RzSelect from '../../components//rzSelect.vue'
import RzTable from '../../components/table.vue'
import MeTable from '../../components/menuTable.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'

const createMenuVisible = ref(false)

const formConfig=[
    {label:'菜单名称:',prop:'menuNm',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'菜单类型:',prop:'menuType',type:'select',width:'80px',valueWidth:'200px', placeholder:'请输入',domain:'AW007'},
    {label:'创建人:',prop:'createUser',type:'input',width:'80px',valueWidth:'200px', placeholder:'请选择'},
    {label:'修改人:',prop:'updateUser',type:'input',width:'80px',valueWidth:'200px', placeholder:'请选择'},
];
const searchData={
    menuNm:'',
    menuType:'',
    createUser:'',
    updateUser:'',
}
const btnConfig=[
    {text:'新建菜单', class:'bg-blue',functionName:'createMenu'},
    {text:'删除', class:'bg-red',functionName:'deleteItems'},
];
const dataParams = reactive({})
const recieveData = (n)=>{
    for(let i in n){
        dataParams[i] = n[i]
    }
}
const deleteItems = ()=>{
    ElMessageBox.confirm(
    '此操作会删除所有选中数据，确认删除?',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    let arr = menuTable.value.selection;
    let arr1 = menuTable.value.selection1;
    let arr2 = menuTable.value.selection2;
    console.log(arr,arr1,arr2)
    arr = [...arr,...arr1,...arr2]
    console.log(arr)
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.id)
    })
    str = str.join(',')
    http({
        url:'/menu/delete',
        method:'post',
        data:{ids:str}
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
const createMenu = ()=>{
    http({
        url:'/menu/list/parentMenu',
        method:'post'
    }).then(res=>{
        if(res.code==200){
            formTitle.value="添加菜单"
            menuList.value = [res.data];
            createMenuVisible.value = true
        }
    })
    
}
const formTitle = ref('添加菜单');
const menuOut=(val)=>{
    resetObj(menuForm)
    menuForm.menuVisible = 'true'
    createMenuVisible.value = false
    submit()
}
const editRow = (row)=>{
    http({
        url:'/menu/list/parentMenu',
        method:'post'
    }).then(res=>{
        if(res.code==200){
            formTitle.value="更新菜单"
            for(let i in menuForm){
                menuForm[i] = row[i]
            }
            menuList.value = [res.data];
            let arr = menuForm.menuPath.split(',')
            let parents = []
            arr.forEach(item=>{
                parents.push(parseInt(item))
            })
            if(row.menuVisible == '是'){
                menuForm.menuVisible = 'true'
            }else{
                menuForm.menuVisible = 'false'
            }
            menuForm.parent = parents;
            createMenuVisible.value = true;
            setTimeout(() => {
                getValue()
            });
        }
    })
}
const menuSubmit=(val)=>{
    // let obj = menuList.value.find(item=>{
    //     return item.id == menuForm.parentId
    // })
    let url = formTitle.value == '添加菜单'?'/menu/add':'/menu/update'
    let msg = formTitle.value == '添加菜单'?'新建成功':'修改成功'
    menuForm.menuPath = menuForm.parent.join(',')
    menuForm.parentId = menuForm.parent[menuForm.parent.length-1]
    http({
        url,
        method:'post',
        data:menuForm
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:msg
            })
            menuOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const menuList = ref([])
const menuForm = reactive({
    id:'',
    menuNm:'',
    iconUrl:'',
    parentId:'',
    parent:[],
    menuOrder:'',
    menuType:'',
    remark:'',
    menuPath:'',
    menuVisible:'true'
})
const menuRules = {
    menuNm:[{required:true,message:'请填写菜单名称',trigger:'blur'}],
    // iconUrl:[{required:true,message:'请填写菜单地址',trigger:'blur'}],
    parentId:[{required:true,message:'请选择上级菜单',trigger:'blur'}],
    menuOrder:[{required:true,message:'请填写菜单顺序',trigger:'blur'}],
    menuType:[{required:true,message:'请选择菜单类型',trigger:'blur'}],
    show:[{required:true,message:'请选择是否可见',trigger:'blur'}],
}
const tableConfig=[
    {label:'菜单名称',prop:'menuNm',width:'198px',edit:true},
    {label:'菜单类型',prop:'menuTypeNm',width:'87px'},
    {label:'访问地址',prop:'iconUrl', width:'', tooltip:true},
    {label:'菜单顺序',prop:'menuOrder',width:''},
    {label:'可见',prop:'menuVisible',width:''},
    {label:'创建人',prop:'createUser',width:''},
    {label:'创建时间',prop:'createDate',width:'181px'},
    {label:'修改人',prop:'updateUser',width:''},
    {label:'修改时间',prop:'updateDate',width:'181px'},
    {label:'备注',prop:'remark',width:'274px'},
]
const menuTable = ref()
const cascader = ref()
const refs = getCurrentInstance();

const getValue = ()=>{
    let arr = cascader.value.getCheckedNodes();
    let type = arr[0].pathNodes[arr[0].pathNodes.length-1].data.menuType
    if(type=='01'){
        menuTypeList.value = [
            {label:"菜单",value:"01"},
            {label:"页面",value:"02"},
        ]
    }else if(type=='02'){
        menuTypeList.value = [
            {label:"按钮",value:"03"},
        ]
    }else if(type=='03'){
        menuTypeList.value = []
    }else{
        menuTypeList.value = [
            {label:"菜单",value:"01"},
            {label:"页面",value:"02"},
            {label:"按钮",value:"03"},
        ]
    }
}
const menuTypeList = ref([])
const submit=(form)=>{
    menuTable.value.onload(form,'1')
}
const casProps = {
    checkStrictly:true,
    value:'id',
    label:'menuNm',
    // emitPath:false
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px)
}
:deep(.menu-form .el-form-item__label){
    height:50px;
    line-height:50px;
}
:deep(.menu-form .el-input,.menu-form .el-select,.menu-form .el-cascader){
    width:300px;
    height:50px;
    line-height:50px;
    .el-input__inner{
        height:50px;
        line-height:50px;
    }
}
:deep(.menu-remark){
    width:778px
}
</style>