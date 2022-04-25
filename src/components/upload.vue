<!--  -->
<template>
    <el-button @click="checkFile">选取文件</el-button>
    <input id="file" type="file" @change="changeFile" style="display:none;">
    <div class="file-box">
        <div v-for="(item,index) in fileList">
            <div class="file-name">
                <el-tooltip :content="item.name" placement="top">
                <div>{{item.name}}</div>
                </el-tooltip>
                <div>{{item.size}}</div>
            </div>
            <el-progress :percentage="item.percent" class="progress"></el-progress>
        </div>
    </div>
    
</template>

<script lang='ts' setup>
import axios from 'axios'
import { ref } from 'vue'
import md5 from 'md5'
const props = defineProps({
    url:String,
    mergeUrl:String,
})
const percent = ref(0)
const fileList = ref([])
const fileValue = ref([])
const checkFile = ()=>{
    let file = document.getElementById('file');
    file.click();
}
const changeFile = (e: Event)=>{

    const target = e.target as HTMLInputElement;
    for(let i in target.files){
        if(typeof(target.files[i])=='object'){
            let size = target.files[i].size;
            let a='0字节'
            if(size<1024){
                a = size+'B'
            }else if( size < 1024*1024){
                a = (size/1024).toFixed(2)+'KB'
            }else if(size<1024*1024*1024){
                a = (size /(1024*1024)).toFixed(2) +'MB'
            }else{
                a = (size/(1024*1024*1024)).toFixed(2)+'GB'
            }
            fileValue.value.push(target.files[i])
            fileList.value.push({
                name:target.files[i].name,
                percent:0,
                size:a
            })
        }
    }
}
const submitFiles = ()=>{
    fileList.value.forEach(item=>{
        submitFile(item)
    })
}
const submitFile = async (file)=>{
    // fileList.value.forEach(item=>{
        let chunkSize = 500*1024;//分片大小
        let start = 0;
        let index = 0;
        const {name , size , type} = file;
        while(start < size){
            let blob = null;
            if(start + chunkSize >size){
                blob = file.slice(start,size)//文件大小小于切片大小不切片
            }else{
                blob = file.slice(start, start + chunkSize)
            }
            start += chunkSize
            let blobFile = new File([blob],`${name}`);
            let formData = new FormData();
            formData.append('file',blobFile);//切片文件
            formData.append('index',index+'');//切片索引
            await axios.post(props.url,formData);
            index++;
            percent.value = (start/size)*100
        }
        axios.get(props.mergeUrl+md5(name)).then(res=>{
            percent.value = 100;
        })
    // })
}
defineExpose({submitFiles})
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.file-box{
    width:100%;
    .file-name{
        width:100px;
        float:left;
        div{
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .el-progress{
        padding-top:40px;
    }
}
</style>