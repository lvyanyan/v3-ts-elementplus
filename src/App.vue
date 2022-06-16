<template>
<el-config-provider :locale="locale">
  <router-view></router-view>
</el-config-provider>
</template>

<script>
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
  name: 'App',
  components: {
      ElConfigProvider
  },
      setup() {
          window.onresize=function () {
              window.location.reload();
          }
      return {
        locale: zhCn,
      }
    },
}
</script>
<style lang='less'>
*{
    padding:0;
    margin:0;
}
html,body,#app{
    padding:0;
    width:100%;
    height:100%;
    margin:0 !important;
}
</style>
