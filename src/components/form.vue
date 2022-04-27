<template>
  <el-form ref="searchForm" :inline="true" :model="formData" class="rz-form">
    <el-form-item v-for="item in config"  :label="item.label" :label-width="item.width">
      <el-input v-if="item.type=='input'" v-model="formData[item.prop]" :placeholder="item.placeholder" :style="`width:${item.valueWidth}`" clearable />
      <rz-select v-if="item.type=='select'" v-model="formData[item.prop]" :domain="item.domain" :placeholder="item.placeholder" :style="`width:${item.valueWidth}`"></rz-select>
       <el-select v-if="item.type=='aothor-select'" v-model="formData[item.prop]" :style="`width:${item.valueWidth}`" clearable  :placeholder="item.placeholder">
                    <el-option v-for="item in authorlist" :label="item.roleNm" :value="item.roleId"></el-option>
       </el-select>
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
import { reactive, ref, computed, } from 'vue'
import store from '/src/store'
import type { FormInstance } from 'element-plus'
import rzSelect from './rzSelect.vue'
const props = defineProps({
 	config: Object,
     data: Object,
})
const emit = defineEmits(["submit"]);
const authorlist = computed(()=>{ return store.state.roles });
let formData = reactive(props.data);

const resetForm = (formEl: FormInstance | undefined) => {
  for(let i in formData){
      formData[i]=''
  }
}

const onSubmit = () => {
  emit('submit' , formData)
}
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
