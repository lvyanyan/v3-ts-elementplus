<!--  -->
<template>
<el-dialog v-model="props.createVisible" :title="props.dialogTitle" destroy-on-close :close-on-click-modal="false" draggable center :before-close="outForm" :width="width">
        <slot name="content"></slot>
        <div slot="footer" class="dialog-footer">
            <rz-btns :config="btnConfig" @onSubmit="onSubmit" @outForm="outForm" :style="`text-align:center`"></rz-btns>
        </div>
</el-dialog>
</template>

<script lang='ts' setup>
import RzBtns from './buttons.vue'
const props = defineProps({
 	width: String,
    createVisible: Boolean,
    dialogTitle:String,
})
const emit = defineEmits(["onSubmit","outForm"]);
const btnConfig = [
    {text:'保存', class:'bg-blue',functionName:'onSubmit'},
    {text:'退出', class:'bg-white',functionName:'outForm'},
];
const onSubmit=()=>{
    emit('onSubmit')
}
const outForm=()=>{
    emit('outForm',false)
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
:deep(.el-dialog--center){
    width:800px;
    .el-dialog__header{
        background:#F2F5FA;
        margin:0;
    }
}
.btns{
    margin-bottom:0;
}
:deep(.el-dialog--center .el-dialog__body){
    padding:50px;
    text-align:center;
}
</style>