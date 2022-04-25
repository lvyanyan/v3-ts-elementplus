<!--  -->
<template>
<div class="header">
    <div class="left-box">
        <div class="logo">
            <img src="../assets/logo.png">
        </div>
        <div class="title">现场审计作业服务端</div>
    </div>
    <div class="right-box">
        <div class="user-logo"></div>
        <div class="user-name">管理员001</div>
        <div class="put-down">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img src="../assets/user_putdown.png">
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item><span>关闭全部</span></el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</div>
<div class="content">
    <div class="nav">
        <el-tree :data="data" node-key="id" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
    <div class="main">
        <tags ></tags>
        <router-view :key="route.fullPath"></router-view>
    </div>
</div>
</template>

<script lang='ts' setup>
import { ref, watch, getCurrentInstance, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus';
import http from '/src/api/http'
import $store from "../store/index";
import tags from '../components/tags.vue'
import type { ElTree } from 'element-plus'
const route = useRouter();
const ci = getCurrentInstance()
interface Tree {
  label: string
  id: string
  children?: Tree[]
}
    onMounted( async ()=>{
        let tags = JSON.parse(localStorage.getItem('tags'))
        let active = localStorage.getItem('active')
        let userInfo = localStorage.getItem('userInfo')
        if(!userInfo){
            route.push('/login')
        }else{
            await $store.dispatch('setInfo',userInfo)
            await $store.dispatch('setTags',tags?tags:[{title:'主页',routerUrl:'/'}]);// 修改
            await $store.dispatch('setTagName',active?active:'/');// 修改
            route.push({path:$store.state.tagName})
            await http({
                url:'/role/list/all',
                method:'post'
            }).then(res=>{
                $store.dispatch('setRoles',res.data)
            })
        }
    })
const tagArray = computed(()=>{ return $store.state.tags });
const treeRef = ref<InstanceType<typeof ElTree>>()
const handleNodeClick = (data: Tree) => {
  if(data.routerUrl){
      route.push({path:data.routerUrl})
      let tags = tagArray.value
      $store.dispatch('setTagName',data.routerUrl)
      let next = tagArray.value.findIndex(item=>{
          return data.routerUrl == item.routerUrl
      })
        if(next!=-1){return}
        tags.push({
            title: data.label,
            routerUrl: data.routerUrl,
        })
        $store.dispatch('setTags',tags)
        localStorage.setItem('tags',JSON.stringify(tags))
  }
}
const toHome = ()=>{
    route.push('/')
      let next = tagArray.value.findIndex(item=>{
          return '/' == item.routerUrl
      })
        if(next!=-1){return}
        tagArray.value.push({
            title: '主页',
            routerUrl: '/',
        })
        $store.dispatch('setTags',tagArray)
}

const data: Tree[] = [
  {
      id: '0',
    label: '主页',
    routerUrl:'/'
  },
  {
      id: '1',
    label: '服务管理',
    routerUrl:'/serviceManagement'
  },
  {
      id: '2',
    label: '通知管理',
    routerUrl:'/informManagement'
  },
    {
        id: '3',
    label: '同步管理',
    routerUrl:'/synchronizationManagement'
  },
    {
        id: '4',
    label: '报表管理',
    routerUrl:'/reportManagement'
  },
    {
        id: '5',
    label: '系统管理',
    children:[
        {
            id: '5-1',
            label: '用户管理',
            routerUrl:'/systemManagement/userManagement'
        },
        {
            id: '5-2',
            label: '权限管理',
            routerUrl:'/systemManagement/authorizationManagement'
        },
        {
            id: '5-3',
            label: '菜单管理',
            routerUrl:'/systemManagement/menuManagement'
        },
        {
            id: '5-4',
            label: '数据字典',
            routerUrl:'/systemManagement/dataDictionary'
        },
        {
            id: '5-5',
            label: '日志管理',
            routerUrl:'/systemManagement/logManagement'
        },
    ]
  },

]

const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.header{
    width:100%;
    height:72px;
    background:#017AFF;
    .left-box{
        float:left;
        .logo{
            float:left;
            margin-left:32px;
            margin-top:5px;
            width:59px;
            height:59px;
            img{
                width:100%;
                height:100%;
                float:left;
            }
        }
        .title{
            float:left;
            font-size:22px;
            font-weight:bold;
            color:#fff;
            line-height:1;
            margin-top:26px;
            margin-left:17px;
        }
    }
    .right-box{
        float:right;
        .user-logo{
            float:left;
            width: 32px;
            height: 32px;
            margin-top:21px;
            border-radius: 50%;
            background:#000;
        }
        .user-name{
            float:left;
            margin-left:7px;
            height:72px;
            line-height:72px;
            margin-right:5px;
            font-size:14px;
            color:#fff;
        }
        .put-down{
            float:left;
            margin-right:31px;
            margin-top:35px;
            width:10px;
            height:5px;
            :deep(.el-dropdown){
                width:100%;
                height:100%;
                .el-tooltip__trigger{
                    width:100%;
                    img{
                        width:10px;
                        height:5px;
                        float:left;
                    }
                }
            }
        }
    }
}
.content{
    width:100%;
    height:calc(100% - 72px);
    .nav{
        float:left;
        width:240px;
        height:100%;
        background:#0061CC;
        .home{
            font-size:16px;
            font-weight:bold;
            color:#fff;
            width:240px;
            height:50px;
            text-align:center;
            line-height:50px;
            background:#5294D5;
            cursor:pointer;
        }
        :deep(.el-tree) {
            background:#1677FF;
    --el-tree-node-hover-bg-color:#5294D5;
    --el-tree-text-color: var(--el-text-color-regular);
    --el-tree-expand-icon-color: var(--el-text-color-placeholder);
}
        :deep(.el-tree-node){
            width:240px;
            color:#fff;
            font-weight:bold;
            font-size:16px;
            background:#5294D5;
            .el-tree-node__content{
                height:50px;
                margin-top:2px;
                .el-tree-node__expand-icon{
                    color:#fff;
                }
                .el-tree-node__expand-icon.is-leaf{
                    color:transparent;
                }
            }
            .el-tree-node:focus > .el-tree-node__content,.el-tree-node__content:hover{
                background:#1677FF;
            }
        }
        :deep(.el-tree-node.is-current) {

        }
    }
    .main{
        float:right;
        width:calc(100% - 288px);
        height:calc(100% - 48px);
        padding:24px;
        background:#F2F5FA;
    }
}
</style>