<!--  -->
<template>
<el-select v-model="props.value" :placeholder="props.placeholder" clearable >
    <el-option v-for="item in list" :label="item.dicValue" :value="item.dicKey"></el-option>
</el-select>
</template>

<script lang='ts' setup>
import http from '/src/api/http'
import { reactive,ref } from 'vue'
import $store from "../store/index";
const props = defineProps({
 	value: String,
    domain: String,
    placeholder:String,
})
const list = ref([])
const getOptions = ()=>{
    http({
        url:'dic/info',
        method:'get',
        params:{dicDomain:props.domain}
    }).then(res=>{
        list.value = res.data
        if(props.domain=='AW013'){
            $store.dispatch('set013',res.data)
        }
    })
}
getOptions()
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>