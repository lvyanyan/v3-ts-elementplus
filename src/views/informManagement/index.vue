<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData" @change-data="recieveData"></rz-form>
    <rz-btns :config="btnConfig" @createNotice="createNotice" @deleteItems="deleteItems" @publicNotice="publicNotice" @copyNotice="copyNotice" @cacelNotice="cacelNotice"></rz-btns>
    <rz-table ref="noticeTable" :config="tableConfig" @editRow="editRow" width="1567px" index check data-url="/notice/list" :data-params="dataParams">
    </rz-table>
    <rz-dialog v-if="noticeVisible" :createVisible="noticeVisible" :dialogTitle="formTitle"  @onSubmit="noticeSubmit" @outForm="noticeOut" width="800px">
        <template #content>
            <el-form :model="noticeForm" inline :rules="noticeRules" :label-width="px2rem(100)" label-position="right">
                <el-row>
                <el-col :span="24">
                <el-form-item label="消息名称" prop="noticeNm">
                    <el-input v-model="noticeForm.noticeNm" maxlength="100" show-word-limit class="notice-nm"></el-input>
                </el-form-item>
                </el-col>

                </el-row>
                <el-row>
                <el-col :span="12">
                <el-form-item label="消息类型" prop="noticeType">
                    <rz-select v-model="noticeForm.noticeType" domain="AW004" class="notice-type"></rz-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="紧急程度" prop="urgencyDegree">
                    <rz-select v-model="noticeForm.urgencyDegree" class="notice-urgencyDegree" domain="AW005"></rz-select>
                </el-form-item>
                <!-- <el-form-item label="目标对象">
                    <el-input disabled v-model="noticeForm.target"></el-input>
                </el-form-item> -->
                </el-col>
                </el-row>
                <el-row>
                <el-col>
                <el-form-item label="消息内容">
                    <el-input type="textarea" v-model="noticeForm.noticeDetail" class="notice-detail" :rows="8" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </template>
    </rz-dialog>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive, computed } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'; 
import {resetObj, px2rem} from '/src/utils/public'
import store from '/src/store'
import http from '/src/api/http'
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
import RzBtns from '../../components/buttons.vue'
import RzDialog from '../../components/dialog.vue'
import rzSelect from '../../components/rzSelect.vue'

let noticeVisible = ref(false)

const formConfig=[
    {label:'通知名称:',prop:'noticeNm',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
    {label:'通知内容:',prop:'noticeDetail',type:'input',width:'80px',valueWidth:'120px', placeholder:'请输入'},
    {label:'通知类型:', prop:'noticeType',type:'select',width:'80px',valueWidth:'120px', placeholder:'请选择',domain:'AW004'},
    {label:'紧急程度:',prop:'urgencyDegree',type:'select',width:'80px',valueWidth:'120px', placeholder:'请选择',domain:'AW005'},
    {label:'通知状态:',prop:'noticeState',type:'select',width:'80px',valueWidth:'120px', placeholder:'请选择',domain:'AW006'},
];
const searchData = {
    noticeNm:'',
    noticeDetail:'',
    noticeType:'',
    urgencyDegree:'',
    noticeState:'',
    target:'0'
}
const btnConfig=[
    {text:'新建通知', class:'bg-blue',functionName:'createNotice'},
    {text:'发布', class:'bg-red',functionName:'publicNotice'},
    {text:'复制', class:'bg-green',functionName:'copyNotice'},
    {text:'撤回', class:'bg-green',functionName:'cacelNotice'},
    {text:'删除', class:'bg-red',functionName:'deleteItems'},    
];
const dataParams = reactive({})
const recieveData = (n)=>{
    for(let i in n){
        dataParams[i] = n[i]
    }
}
const formTitle = ref('新建通知')
const createNotice = ()=>{
    formTitle.value = '新建通知';
    noticeVisible.value = true;
}
const noticeSubmit = ()=>{
    let url = formTitle.value == '新建通知'?'/notice/add':'/notice/update'
    http({
        url,
        method:'post',
        data:noticeForm
    }).then(res=>{
        if(res.code==200){
            ElMessage({
                type:'success',
                message:'新建成功'
            })
            noticeOut()
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const noticeOut = ()=>{
    noticeVisible.value = false;
    resetObj(noticeForm)
    submit();
}
const publicNotice = ()=>{
    const arr = noticeTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.noticeNo)
    })
    str = str.join(',')
    http({
        url:'/notice/release',
        method:'post',
        data:{noticeNos:str}
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
const copyNotice = ()=>{
    const arr = noticeTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.noticeNo)
    })
    str = str.join(',')
    http({
        url:'/notice/copy',
        method:'post',
        data:{noticeNos:str}
    }).then(res=>{
        if(res.code=="200"){
            ElMessage({
                type:'success',
                message:'复制成功'
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
const cacelNotice = ()=>{
    const arr = noticeTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.noticeNo)
    })
    str = str.join(',')
    http({
        url:'/notice/recall',
        method:'post',
        data:{noticeNos:str}
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
    const arr = noticeTable.value.selection;
    if(arr.length<1){
        return;
    }
    let str = []
    arr.forEach(item=>{
        str.push(item.noticeNo)
    })
    str = str.join(',')
    http({
        url:'/notice/delete',
        method:'post',
        data:{noticeNos:str}
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
const noticeRules = {
    noticeNm:[{required:true,message:'通知名称不能为空',trigger:'blur'}],
    noticeDetail:[{required:true,message:'通知内容不能为空',trigger:'blur'}],
    urgencyDegree:[{required:true,message:'紧急程度不能为空',trigger:'blur'}],
    noticeType:[{required:true,message:'通知类型不能为空',trigger:'blur'}],
}
const noticeForm = reactive({
    noticeNm:'',
    noticeDetail:'',
    noticeType:'',
    urgencyDegree:'',
    noticeState:'',
    target:'0'
});
const tableConfig=[
    // {label:'消息编号',prop:'noticeNo',width:''},
    {label:'通知名称',prop:'noticeNm',width:'',edit:true,tooltip:true,},
    {label:'通知内容',prop:'noticeDetail',width:'',tooltip:true,},
    {label:'通知类型',prop:'noticeTypeNm',width:''},
    {label:'紧急程度',prop:'urgencyDegreeNm',width:''},
    {label:'目标',prop:'targetValue',width:''},
    // {label:'发布人',prop:'phone',width:''},
    {label:'发送时间',prop:'sendTime',width:''},
    {label:'通知状态',prop:'noticeStateNm',width:''},
]
const editRow = (row)=>{
    if(row.noticeState == '01'){
        return;
    }
    noticeForm.noticeNm = row.noticeNm
    noticeForm.noticeNo = row.noticeNo
    noticeForm.noticeDetail = row.noticeDetail
    noticeForm.noticeType = row.noticeType
    noticeForm.urgencyDegree = row.urgencyDegree
    noticeForm.target = row.target
    formTitle.value = '编辑通知';
    noticeVisible.value = true;
}
const noticeTable = ref()
const refs = getCurrentInstance();
const submit=(form)=>{
    noticeTable.value.onload(form,'1')
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
:deep(.notice-nm){
    width:650px;
}
:deep(.notice-detail){
    width:650px;
}
:deep(.notice-type){
    width:278px;
}
:deep(.notice-urgencyDegree){
    width:278px;
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
</style>