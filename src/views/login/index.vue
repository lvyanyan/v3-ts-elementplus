<!--  -->
<template>
<div class=''>
    <div class="header"></div>
    <el-form :model="loginForm">
        <el-form-item label="帐号">
            <el-input v-model="loginForm.userLoginNm"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="loginForm.userPassword"></el-input>
        </el-form-item>
    </el-form>
    <div class="footer">
        <el-button type="primary" @click="submit">登陆</el-button>
    </div>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive} from 'vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus';
import store from '/src/store'
import http from '/src/api/http'
const route = useRouter();
const loginForm = reactive({
    userLoginNm:'',
    userPassword:''
})
const submit = ()=>{
    http({
        url:'/login',
        method:'post',
        data:loginForm
    }).then(res=>{
        if(res.code==200){
            ElMessage({
                type:'success',
                message:'登录成功'
            })
            let userInfo = {
                userNo:res.data.userNo,
                userNm:res.data.userNm,
                userLoginNm:res.data.userLoginNm
            }
            localStorage.setItem('userInfo',JSON.stringify(userInfo))
            store.dispatch('setInfo',JSON.stringify(userInfo))
            route.push({path:'/'})
        }
    })
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>