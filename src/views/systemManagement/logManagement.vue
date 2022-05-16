<!--  -->
<template>
<div class='box'>
    <rz-form :config="formConfig" @submit="submit" :data="searchData" @change-data="recieveData"></rz-form>
    <!-- <rz-btns :config="btnConfig" @createUser="createUser"></rz-btns> -->
    <rz-table ref="logTable" :config="tableConfig" width="1567px" index check data-url="/log/list" :data-params="dataParams">
    </rz-table>
</div>
</template>

<script lang='ts' setup>
import { ref, onMounted, getCurrentInstance, reactive} from 'vue'
import { ElMessage } from 'element-plus';
import RzTable from '../../components/table.vue'
import RzForm from '../../components/form.vue'
// import RzBtns from '../../components/buttons.vue'

const createVisible = ref(false)

const formConfig=[
    {label:'操作模块:',prop:'controllerNm',type:'select',domain:'AW013',width:'80px',valueWidth:'200px', placeholder:'请输入',cascader:'methodNm'},
    {label:'操作功能:',prop:'methodNm',type:'cascader',domain:'',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'操作时间:',prop:'optTimeStart,optTimeEnd',type:'date',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'用户账号:',prop:'userNo',type:'input',width:'80px',valueWidth:'200px', placeholder:'请选择'},
    {label:'用户名:',prop:'userNm',type:'input',width:'80px',valueWidth:'200px', placeholder:'请输入'},
    {label:'状态:',prop:'requestResult',type:'select',width:'80px',domain:'AW002',valueWidth:'200px', placeholder:'请选择'},
    {label:'日志类型:',prop:'logType',type:'select',domain:'AM001',width:'80px',valueWidth:'200px', placeholder:'请输入'},
];
const searchData={
    controllerNm:'',
    methodNm:'',
    userNo:'',
    userNm:'',
    requestResult:'',
    logType:'',
    optTimeStart:'',
    optTimeEnd:'',
}
const btnConfig=[

];
const dataParams = reactive({})
const recieveData = (n)=>{
    for(let i in n){
        dataParams[i] = n[i]
    }
}
const tableConfig=[
    {label:'日志类型',prop:'logTypeNm',width:''},
    {label:'操作模块',prop:'controllerNm',width:''},
    {label:'操作功能',prop:'methodNm',width:''},
    {label:'操作时间',prop:'operationTime',width:'206px'},
    {label:'用户账号',prop:'userNo',width:''},
    {label:'用户名',prop:'userNm',width:''},
    {label:'访问url',prop:'url',width:''},
    // {label:'mac地址',prop:'',width:''},
    {label:'耗时',prop:'costTime',width:''},
    // {label:'参数',prop:'args',width:''},
    {label:'状态',prop:'requestResultNm',width:''},
]
const logTable = ref()
const refs = getCurrentInstance();
onMounted(()=>{
    
})
const submit=(form)=>{
    logTable.value.onload(form,'1')
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