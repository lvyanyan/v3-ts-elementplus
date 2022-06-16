<!--  -->
<template>
<div class='bg'>
    <div class="left-box"></div>
    <div class="content">
    <div class="header">
        <div class="logo">
            <img src="/src/assets/logo.png">
        </div>
        <div class="title">现场审计作业服务端</div>
    </div>
    <div class="content-box">
        <div></div>
        <el-form :model="loginForm">
            <el-form-item >
                <el-input class="user-login" placeholder="用户名" v-model="loginForm.userLoginNm"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input class="user-pwd" placeholder="密码" type="password" v-model="loginForm.userPassword" @keyup.enter="submit"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="footer">
        <el-button type="primary" @click="submit">登录</el-button>
    </div>
    </div>
</div>
</template>

<script lang='ts' setup>
import { ref, getCurrentInstance,reactive,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus';
import store from '/src/store'
import http from '/src/api/http'
const route = useRouter();
const loginForm = reactive({
    userLoginNm:'',
    userPassword:''
})
onMounted(()=>{
    let info = localStorage.getItem('userInfo')
    if(info){
        route.push({path:'/homePage'})
    }
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
            http({
                url:'/menu/search/menu/tree',
                method:'post',
            }).then(res=>{
                if(res.code=200){
                    store.dispatch('setNavicate',JSON.stringify(res.data.children))
                    localStorage.setItem('nav',JSON.stringify(res.data.children))
                    route.push({path:'/homePage'})
                }else{
                    ElMessage({
                        type:'error',
                        message:res.msg
                    })
                }
            })
            

        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.bg{
    width:100%;
    height:100%;
    .left-box{
        width:calc(100% - 533px);
        height:100%;
        float:left;
        background-image:url('/src/assets/loginBG.png');
        background-size:cover;
        background-position:center center;
        background-repeat:no-repeat;
    }
    .content{
        float:right;
        width:531px;
        height:100%;
        background:#fff;
        .header{
            text-align:center;
            margin-top:311px;
            .logo{
                margin:0 auto;
                width:59px;
                height:59px;
                img{
                    width:100%;
                    height:100%;
                }
            }
            .title{
                margin-top:21px;
                font-size:24px;
                font-weight:bold;
            }
        }
        .content-box{
            padding-left:100px;
            padding-right:101px;
            margin-top:76px;
            :deep(.el-form-item){
                margin-bottom:0;
            }
            .user-login,.user-pwd{
                width:330px;
                height:50px;
                :deep(.el-input__inner){
                    height:100%;
                }
            }
            .user-pwd{
                margin-top:25px;
            }
        }
        .footer{
            padding-left:99px;
            padding-right:102px;
            margin-top:25px;
            :deep(.el-button){
                width:330px;
                height:50px;
            }
        }
    }
}
</style>