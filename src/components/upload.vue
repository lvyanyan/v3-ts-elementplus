<!--  -->
<template>
    <el-button @click="checkFile">选择安装包</el-button>
    <input id="file" type="file" @change="changeFile" style="display:none;">
    <div class="file-box">
        <div class="item-box" v-for="(item,index) in fileList">
            <i class="rz-icon rz-file"></i>
            <div class="file-name">
                <el-tooltip :content="item.name" placement="top">
                <div>{{item.name}}</div>
                </el-tooltip>
                <div>{{`${item.up}/${item.size}`}}</div>
            </div>
            <el-progress :percentage="item.percent" class="progress"></el-progress>
            <i class="rz-icon rz-close" @click="cancel"></i>
        </div>
    </div>
    
</template>

<script lang='ts' setup>
import axios from 'axios'
import http from '/src/api/http'
import { ElMessage } from 'element-plus'; 
import store from '/src/store'
import { ref } from 'vue'
import SparkMD5 from "spark-md5";
const props = defineProps({
    url:String,
    mergeUrl:String,
    form:Object,
})
let userInfo = store.state.userInfo
const fileList = ref([])
const fileValue = ref([])
const checkFile = ()=>{
    if(props.form.versionId==""){
        ElMessage({
            type:'warning',
            message:'请先保存版本信息'
        })
        return;
    }
    if(removeFile.value==true){
        removeFile.value = false;
        disabled.value = false;
    }
    if(disabled.value==true){
        return;
    }
    let file = document.getElementById('file');
    file.click();
}
const removeFile = ref(false)
const cancel = ()=>{
    let url = disabled.value == true?'/service/synchronize/upload/cancel':'/service/synchronize/upload/delete'
    http({
        url,
        method:'post',
        data:{versionId:props.form.versionId}
    }).then(res=>{
        if(res.code==200){
            fileList.value = []
            fileValue.value = []
            removeFile.value = true;
        }else{
            ElMessage({
                type:'error',
                message:res.msg
            })
        }
    })
}
const disabled = ref(false)
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
    submitFiles();
}
const submitFiles = ()=>{
    disabled.value = true;
    fileValue.value.forEach((item,index)=>{
            let reader = new FileReader();
            let mdg = ''
            reader.readAsBinaryString(item);
            let spark = new SparkMD5();
            reader.onloadend = function (e) {
                spark.appendBinary(e.target.result);
                 mdg = spark.end()
                submitFile(item,props.form,index,mdg)
                //开始分块上传文件
                //UploadPost(fileid, file, totalSize, blockCount, blockSize, md5);
            }
        
    })
}
const submitFile = async (file,obj,index,mdg)=>{
    // fileList.value.forEach(item=>{
        let chunkSize = 1024*5*1024;//分片大小
        let start = 0;
        let chunk = 0;
        
        const {name , size , type} = file;
        while(start < size){
            let blob = null;
            if(start + chunkSize >size){
                blob = file.slice(start,size)//文件大小小于切片大小不切片
                start = size
            }else{
                blob = file.slice(start, start + chunkSize)
                start += chunkSize
            }
            let chunks = Math.ceil(size/chunkSize)
            let blobFile = new File([blob],`${name}`);
            let formData = new FormData();
            formData.append('file',blobFile);//切片文件
            formData.append('size',size+'');//原始文件大小
            formData.append('name',name);//原始文件名
            formData.append('chunks',chunks);//原始文件大小
            formData.append('chunk',chunk+'');//切片索引
            formData.append('mdg',mdg);//切片索引
            for(let i in obj){
                formData.append(i+'',obj[i])
            }
            if(removeFile.value==true){
                return;
            }
            await axios.post(props.url,formData,{headers:{
                userInfo
            }});
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
            if(fileList.value[index])fileList.value[index].up = up
            if(fileList.value[index])fileList.value[index].percent = (start/size).toFixed(2)*100
        }
        // axios.get(props.mergeUrl+md5(name),{headers:{
        //         userInfo
        //     }}).then(res=>{
            ElMessage({
                type:'success',
                message:'上传完成'
            })
            if(fileList.value[index])fileList.value[index].percent = 100;
            disabled.value = false;
        // })
    // })
}
defineExpose({})
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.file-box{
    float:right;
    width: 650px;
    height:50px;
    margin-left: 23px;
    div.item-box{
        display:inline-block;
    }
    .file-name{
        width:163px;
        height:40px;
        padding-top:5px;
        float:left;
        div{
            font-size:16px;
            // height:20px;
            line-height:20px;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    :deep(.rz-icon){
        float:left;
        margin-top:24px;
    }
    :deep(.rz-file){
        margin-top:16px;
        margin-right:10px;
    }
    :deep(.el-progress){
        padding-top:24px;
        margin-left:29px;
        float:left;
        width:321px;
        .el-progress__text{
            margin-left:35px;
        }
        .el-progress-bar__outer{
            height:10px !important;
            border-radius:0;
            .el-progress-bar__inner{
                border-radius:0;
            }
        }
    }
}
</style>