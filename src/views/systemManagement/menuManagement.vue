<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData"></rz-form>
    <rz-btns :config="btnConfig" @createMenu="createMenu" @deleteItems="deleteItems"></rz-btns>
    <rz-table ref="menuTable" :config="tableConfig" width="1567px" nopage data-url="/menu/list" index check></rz-table>
        <rz-dialog :createVisible="createMenuVisible" dialogTitle="添加菜单"  @onSubmit="menuSubmit" @outForm="menuOut" width="600px">
        <template #content>
            <el-form :model="menuForm" inline :rules="menuRules" label-width="80px" label-position="right">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuNm">
                            <el-input v-model="menuForm.menuNm"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单地址" prop="iconUrl">
                            <el-input v-model="menuForm.iconUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-select v-model="menuForm.parentId">
                                <el-option v-for="item in menuList" :label="item.menuNm" :value="item.id"></el-option>
                            </el-select>
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
                            <rz-select v-model="menuForm.menuType" domain="AW007"></rz-select>
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
                    <el-col :span="12">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="menuForm.remark"></el-input>
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
import { ElMessage } from 'element-plus';
import {resetObj} from '/src/utils/public'
import RzDialog from '../../components/dialog.vue'
import RzSelect from '../../components//rzSelect.vue'
import RzTable from '../../components/table.vue'
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
const deleteItems = ()=>{
    const arr = menuTable.value.selection;
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
}
const createMenu = ()=>{
    http({
        url:'/menu/list/firstMenu',
        method:'post'
    }).then(res=>{
        if(res.code==200){
            menuList.value = res.data;
            createMenuVisible.value = true
        }
    })
    
}
const menuOut=(val)=>{
    resetObj(menuForm)
    createMenuVisible.value = false
    submit()
}
const menuSubmit=(val)=>{
    let obj = menuList.value.find(item=>{
        return item.id == menuForm.parentId
    })
    menuForm.menuPath = obj.menuPath
    http({
        url:'/menu/add',
        method:'post',
        data:menuForm
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'新建成功'
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
    menuNm:'',
    iconUrl:'',
    parentId:'',
    menuOrder:'',
    menuType:'',
    remark:'',
    menuPath:'',
    menuVisible:''
})
const menuRules = {
    menuNm:[{required:true,message:'请填写菜单名称',trigger:'blur'}],
    iconUrl:[{required:true,message:'请填写菜单地址',trigger:'blur'}],
    parentId:[{required:true,message:'请选择上级菜单',trigger:'blur'}],
    menuOrder:[{required:true,message:'请填写菜单顺序',trigger:'blur'}],
    menuType:[{required:true,message:'请选择菜单类型',trigger:'blur'}],
    show:[{required:true,message:'请选择是否可见',trigger:'blur'}],
}
const tableConfig=[
    {label:'菜单名称',prop:'menuNm',width:''},
    {label:'菜单类型',prop:'menuType',width:''},
    {label:'访问地址',prop:'iconUrl',width:''},
    {label:'菜单顺序',prop:'menuOrder',width:''},
    {label:'可见',prop:'menuVisible',width:''},
    {label:'创建人',prop:'createUser',width:''},
    {label:'创建时间',prop:'createDate',width:''},
    {label:'修改人',prop:'updateUser',width:''},
    {label:'修改时间',prop:'updateDate',width:''},
    {label:'备注',prop:'remark',width:''},
]
const menuTable = ref()
const refs = getCurrentInstance();

const submit=(form)=>{
    menuTable.value.onload(form)
}

</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px)
}

</style>