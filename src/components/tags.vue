<template>
  <div class="tags">
      <div class="turn-left">
          <img src="../assets/turnpage_left.png">
      </div>
  <el-tabs type="border-card" v-model="activeName" closable @tab-remove="removeTab" @tab-click="tabClick">
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.iconUrl"
      :label="item.title"
      :name="item.iconUrl"
    >
    </el-tab-pane>
  </el-tabs>
  <div class="turn-right">
      <img src="../assets/turnpage_right.png">
  </div>
  <div class="other">
    <el-dropdown>
        <span class="el-dropdown-link">
            <img src="../assets/putdown.png">
        </span>
        <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item><span @click="closeAll">关闭全部</span></el-dropdown-item>
        </el-dropdown-menu>
        </template>
    </el-dropdown>
  </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import $store from "../store/index";
import { ref, computed, watch} from 'vue'
const route = useRouter();
const activeName = computed(()=>{ return $store.state.tagName });
const editableTabs = computed(()=>{ return $store.state.tags });

const tabClick=(pane: TabsPaneContext, ev: Event)=>{
    route.push({path:pane.paneName})
    localStorage.setItem('active',pane.paneName)
}
watch(activeName,(n,o)=>{
    localStorage.setItem('active',n)
})
const closeAll = ()=>{
    $store.dispatch('setTagName','/')
    $store.dispatch('setTags',[{title:'主页',iconUrl:'/'}])
    localStorage.setItem('tags',JSON.stringify([{title:'主页',iconUrl:'/'}]))
    route.push('/')
}
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let active = activeName.value
  if (active === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.iconUrl === targetName) {
        const nextTab = tabs[index + 1]?tabs[index + 1]: tabs[index - 1]
        if (nextTab) {
          active = nextTab.iconUrl
        }
      }
    })
  }
  $store.dispatch('setTagName',active)
  let tagArray = tabs.filter((tab) => tab.iconUrl !== targetName)
  $store.dispatch('setTags',tagArray)
  localStorage.setItem('tags',JSON.stringify(tagArray))
}
</script>
<style lang="less" scoped>
.tags{
    .turn-left,.turn-right,.other{
        position:absolute;
        width:36px;
        height:36px;
        cursor:pointer;
        background:no-repeat center #fff;
    }
    .turn-left{
        left:0;
        top:0;
        img{
            width:12px;
            height:13px;
            margin-top:11px;
            margin-left:12px;
            float:left;
        }
    }
    .turn-right{
        right:40px;
        top:0;
        img{
            width:12px;
            height:13px;
            margin-top:11px;
            margin-left:12px;
            float:left;
        }
    }
    .other{
        right:0;
        top:0;
        :deep(.el-dropdown){
            width:100%;
            height:100%;
            .el-tooltip__trigger{
                width:100%;
                text-align:center;
                img{
                    width:9px;
                    height:9px;
                    margin-left:13px;
                    margin-top:13px;
                    float:left;
                }
            }
        }
    }
    padding-left:40px;
    padding-right:80px;
    position:relative;
    .el-tabs--border-card {
        background:#F2F5FA;
        border:none;
        height:40px;
        :deep(.el-tabs__header){
            border:none;
        }
        :deep(.el-tabs__item){
            background:#fff;
            color:#0061CC;
            font-weight:bold;
            font-size:16px;
        }
        :deep(.el-tabs__content){
            padding:0;
        }
        :deep(.el-tabs__header .el-tabs__item.is-active){
            background:#DEEBFB;
            color:#0061CC;
        }
    }
    .demo-tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
    }
    .demo-tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
    }
}
</style>
