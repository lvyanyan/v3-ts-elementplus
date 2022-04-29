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
                <div>{{`${item.up}/${item.size}`}}</div>
            </div>
            <el-progress :percentage="item.percent" class="progress"></el-progress>
        </div>
    </div>
    
</template>

<script lang='ts' setup>
import axios from 'axios'
import store from '/src/store'
import { ref } from 'vue'
import md5 from 'md5'
const props = defineProps({
    url:String,
    mergeUrl:String,
})
let userInfo = store.state.userInfo
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
            fileValue.value=[target.files[i]]
            fileList.value=[{
                name:target.files[i].name,
                percent:0,
                size:a,
                up:'0'
            }]
        }
    }
}
const submitFiles = (obj)=>{
    fileValue.value.forEach((item,index)=>{
        submitFile(item,obj,index)
    })
}
const submitFile = async (file,obj,index)=>{
    // fileList.value.forEach(item=>{
        let chunkSize = 1024*5*1024;//分片大小
        let start = 0;
        let chunk = 0;
        
        const {name , size , type} = file;
        while(start < size){
            let blob = null;
            if(start + chunkSize >size){
                blob = file.slice(start,size)//文件大小小于切片大小不切片
            }else{
                blob = file.slice(start, start + chunkSize)
            }
            start += chunkSize
            let chunks = Math.ceil(size/chunkSize)
            let blobFile = new File([blob],`${name}`);
            let formData = new FormData();
            formData.append('file',blobFile);//切片文件
            formData.append('size',size+'');//原始文件大小
            formData.append('name',name);//原始文件名
            formData.append('chunks',chunks);//原始文件大小
            formData.append('chunk',chunk+'');//切片索引
            formData.append('mdg',md5(file));//切片索引
            for(let i in obj){
                formData.append(i+'',obj[i])
            }
            await axios.post(props.url,formData,{headers:{
                userInfo
            }});
            console.log('a')
            chunk++;
            let up = ''
            if(start<1024){
                up = start+'B'
            }else if( start < 1024*1024){
                up = (start/1024).toFixed(2)+'KB'
            }else if(start<1024*1024*1024){
                up = (start /(1024*1024)).toFixed(2) +'MB'
            }else{
                up = (start/(1024*1024*1024)).toFixed(2)+'GB'
            }
            fileList.value[index].up = up
            fileList.value[index].percent = (start/size)*100
        }
        // axios.get(props.mergeUrl+md5(name),{headers:{
        //         userInfo
        //     }}).then(res=>{
            fileList.value[index].percent = 100;
        // })
    // })
}
defineExpose({submitFiles,fileList})
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.file-box{
    display: inline-block;
    width: 330px;
    margin-left: 23px;
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
        .el-progress-bar__outer{
            height:10px;
        }
    }
}
</style>