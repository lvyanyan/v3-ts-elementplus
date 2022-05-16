<!--  -->
<template>
<div class='page'>
    您访问的页面不存在，点击<span class="home" @click="backHome">这里</span>返回主页
</div>
</template>

<script lang='ts' setup>
import {useRouter} from 'vue-router'
import $store from "../store/index";
const route = useRouter();
const backHome = ()=>{
    $store.dispatch('setTags',[{title:'主页',iconUrl:'/'}]);// 修改
    $store.dispatch('setTagName','/');// 修改
    localStorage.setItem('active','/')
    localStorage.setItem('tags',JSON.stringify([{title:'主页',iconUrl:'/'}]))
    route.push('/')        
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.page{
    text-align:center;
    margin-top:200px;
    font-size:20px;
    font-weight:bold;
}
.home{
    padding-left:5px;
    padding-right:5px;
    text-decoration:underline;
    color:#409eff;
}
</style>