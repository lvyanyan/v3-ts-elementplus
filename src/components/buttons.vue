<!--  -->
<template>
<div class='btns'>
      <el-button v-for="item in config" :class="item.class" @click="emit(item.functionName)">{{item.text}}</el-button>
</div>
</template>

<script lang='ts' setup>
 	 const emit = defineEmits([]);
 	const props = defineProps({
 	config: Object,
 	})
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.btns{
    margin-bottom:24px;
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
        background:#fff;
        color:#000;
    }
    .bg-red{
        background:#E12501;
    }
    .bg-green{
        background:#58CDD0;
    }
}
</style>