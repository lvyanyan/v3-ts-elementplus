<template>
  <el-form ref="searchForm" :inline="true" :model="formData" class="rz-form">
    <el-form-item v-for="item in formConfig"  :label="item.label" :label-width="px2rem(item.width)">
      <el-input v-if="item.type=='input'" v-model="formData[item.prop]" :placeholder="item.placeholder" :style="`width:${px2rem(item.valueWidth)}`" clearable />
      <rz-select v-if="item.type=='select'" v-model="formData[item.prop]" @change="cascaderItem(item)" :domain="item.domain" :placeholder="item.placeholder" :style="`width:${px2rem(item.valueWidth)}`"></rz-select>
       <el-select v-if="item.type=='aothor-select'" v-model="formData[item.prop]" :style="`width:${px2rem(item.valueWidth)}`" clearable  :placeholder="item.placeholder">
                    <el-option v-for="item in authorlist" :label="item.roleNm" :value="item.roleId"></el-option>
       </el-select>
      <rz-cascader v-if="item.type=='cascader'" v-model="formData[item.prop]" :domain="item.domain" :placeholder="item.placeholder" :style="`width:${px2rem(item.valueWidth)}`"></rz-cascader>
       <template v-if="item.type=='date'">
        <el-date-picker v-model="formData[item.prop.split(',')[0]]" clearable value-format="YYYY-MM-DD"></el-date-picker>
            <span class="date-opreate"> 至 </span>
        <el-date-picker v-model="formData[item.prop.split(',')[1]]" clearable value-format="YYYY-MM-DD"></el-date-picker>
       </template>
    </el-form-item>
      
    <el-form-item class="btn">
      <el-button class="bg-blue" @click="onSubmit">查询</el-button>
      <el-button class="bg-white" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch} from 'vue'
import store from '/src/store'
import {px2rem, resetObj} from '/src/utils/public'
import type { FormInstance } from 'element-plus'
import rzSelect from './rzSelect.vue'
import rzCascader from './rzCascader.vue'
const props = defineProps({
 	config: Array,
     data: Object,
})
const formConfig = ref(props.config)
const emit = defineEmits(["submit"]);
const authorlist = computed(()=>{ return store.state.roles });
let formData = reactive(props.data);
watch(formData,(n,o)=>{
    emit('change-data',n)
})
const cascaderItem = (item)=>{
    if(item.cascader){
        let index = formConfig.value.findIndex(n=>{
            return n.prop == item.cascader
        })
        formData[item.cascader] = ''
        formConfig.value[index].domain = formData[item.prop]
    }
}
const resetForm = (formEl: FormInstance | undefined) => {
  for(let i in formData){
      formData[i]=''
  }
}

const onSubmit = () => {
  emit('submit' , formData)
}
defineExpose({formData})
</script>
<style lang="less" scoped>
.rz-form{
    :deep(.el-form-item){
        margin-right:20px;
        color:#1F2124;
        font-weight:bold;
        font-size:16px;
        .date-opreate{
            width:50px;
            text-align:center;
        }
    }
    .btn{
        margin-left:20px;
        .el-button{
            color:#fff;
            font-size:16px;
            width:99px;
            height:36px;
        }
        .bg-blue{
            background:#017AFF;
        }
        .bg-white{
            color:#000;
        }
    }
}
</style>
