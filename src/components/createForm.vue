<!--  -->
<template>
    <el-dialog v-model="props.createVisible" :title="dialogTitle" draggable center :before-close="outForm" >
        <el-form ref="ruleFormRef" :inline="true" :model="formData" class="rz-form" label-position="right" :rules="createRules">
            <el-form-item v-for="item in config"  :label="`${item.label}:`" :label-width="item.width" :prop="item.prop">
            <el-input v-if="item.type=='input'" v-model="formData[item.prop]" :placeholder="item.placeholder" />
            <rz-select v-if="item.type=='select'" v-model="formData[item.prop]" :domain="item.domain" :placeholder="item.placeholder">
            </rz-select>
            <el-select v-if="item.type=='aothor-select'" v-model="formData[item.prop]"  :placeholder="item.placeholder">
                    <el-option v-for="item in authorlist" :label="item.roleNm" :value="item.id"></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <rz-btns :config="btnConfig" @onSubmit="onSubmit" @outForm="outForm" :style="`text-align:center`"></rz-btns>
        </div>
    </el-dialog>
</template>

<script lang='ts' setup>
import { ref,reactive, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import {resetObj} from '/src/utils/public'
import store from '/src/store'
import rzSelect from './rzSelect.vue'
import RzBtns from './buttons.vue'
const ruleFormRef = ref<FormInstance>()
const props = defineProps({
 	config: Array,
    createVisible: Boolean,
    dialogTitle:String,
    data: Object,
    createRules:Object,
})
const emit = defineEmits(["onSubmit","outForm"]);
const authorlist = computed(()=>{ return store.state.roles });
let formData=reactive(props.data)
const btnConfig = [
    {text:'保存', class:'bg-blue',functionName:'onSubmit'},
    {text:'退出', class:'bg-white',functionName:'outForm'},
];
const onSubmit=()=>{
    emit('onSubmit',formData)
}
const outForm=()=>{
    resetObj(formData)
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
:deep(.el-dialog--center .el-dialog__body){
    text-align:center;
}
</style>