<!--  -->
<template>
<div class="box">
    <div class='card'>
        <div class="card-item releaseServiceCount">
            <p class="card-total">{{releaseServiceCount}}</p>
            <p class="card-label">发布应用数</p>
        </div>
        <div class="card-item downServiceCount">
            <p class="card-total">{{downServiceCount}}</p>
            <p class="card-label">下架应用数</p>
        </div>
        <div class="card-item releaseNoticeCount">
            <p class="card-total">{{releaseNoticeCount}}</p>
            <p class="card-label">发布消息数</p>
        </div>
        <div class="card-item userCount">
            <p class="card-total">{{userCount}}</p>
            <p class="card-label">用户数</p>
        </div>
    </div>
    <div class="chart-box">
        <div class="box-item" >
            <p class="chart-title">应用服务状态</p>
            <div v-if="appStatusShow" class="chart-item app-status">
                <div :id="appStatus" style="height:100%;"></div>
            </div>
            <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="box-item" >
            <p class="chart-title">应用下载下载量排行榜<span @click="appDownMore">更多</span></p>
            <div v-if="appDownShow" class="chart-item app-down">
                <div :id="appDown" style="height:100%;"></div>
            </div>
            <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="box-item" >
            <p class="chart-title">消息状态</p>
            <div v-if="msgStatusShow" class="chart-item msg-status">
                <div :id="msgStatus" style="height:100%;"></div>
            </div>
            <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="box-item" >
            <p class="chart-title">应用好评排行榜<span @click="appDownMore">更多</span></p>
            <div v-if="appRateShow" class="chart-item app-rate">
                <div :id="appRate" style="height:100%;"></div>
            </div>
            <div v-else class="no-data">暂无数据</div>
        </div>
    </div>
</div>
</template>

<script lang='ts' setup>
import { ref, watch, getCurrentInstance, onMounted, computed, reactive} from 'vue'
import http from '/src/api/http'
import { ElMessage,ElMessageBox } from 'element-plus';   
import { chartPie, chartBar } from '/src/utils/echart'
const releaseServiceCount = ref(0)
const downServiceCount = ref(0)
const releaseNoticeCount = ref(0)
const userCount = ref(0)
const appDown = ref('app-down')
const appDownShow = ref(true)
const appRate = ref('app-rate')
const appRateShow = ref(true)
const msgStatus = ref('msg-status')
const msgStatusShow = ref(true)
const appStatus = ref('app-status')
const appStatusShow = ref(true)
onMounted(()=>{
    getHead();
    initAppDown();
    initAppRate();
    initAppStatus();
    initMsgStatus();
})
const getHead = ()=>{
    http({
        url:'/home/headData',
        method:'get'
    }).then(res=>{
        if(res.code==200){
            releaseServiceCount.value = res.data.releaseServiceCount
            downServiceCount.value = res.data.downServiceCount
            releaseNoticeCount.value = res.data.releaseNoticeCount
            userCount.value = res.data.userCount
        }
    })
}
const initAppDown = ()=>{
    http({
        url:'/home/appDownloadRanking',
        method:'post'
    }).then(res=>{
        if(res.code==200&&res.data&&res.data.length>0){
            appDownShow.value = true
            let label = [];
            let data = [];
            res.data.forEach(item=>{
                label.push(item.serviceNm);
                data.push(item.total)
            })
            chartBar('app-down', label, data, '下载量')
        }else{
            // ElMessage({
            //     type:'warning',
            //     message:'应用下载暂无数据'
            // })
            appDownShow.value = false
        }
    })
}
const initAppRate = ()=>{
    http({
        url:'/home/appRatingRanking',
        method:'post'
    }).then(res=>{
        if(res.code==200&&res.data&&res.data.length>0){
            appRateShow.value = true
            let label = [];
            let data = [];
            res.data.forEach(item=>{
                label.push(item.serviceNm);
                data.push(item.score)
            })
            chartBar('app-rate', label, data, '评分')
        }else{
            // ElMessage({
            //     type:'warning',
            //     message:'暂无数据'
            // })
            appRateShow.value = false
        }
    })
}
const initAppStatus = ()=>{
    http({
        url:'/home/appStatus',
        method:'post'
    }).then(res=>{
        if(res.code==200&&res.data&&res.data.length>0){
            appStatusShow.value = true
            let data = [];
            res.data.forEach(item=>{
                data.push({
                    value:item.total,
                    name:item.serviceStatus
                })
            })
            chartPie('app-status',data)
        }else{
            // ElMessage({
            //     type:'warning',
            //     message:'暂无数据'
            // })
            appStatusShow.value = false
        }
    })
}
const initMsgStatus = ()=>{
    http({
        url:'/home/messageStatus',
        method:'post'
    }).then(res=>{
        if(res.code==200&&res.data&&res.data.length>0){
            msgStatusShow.value = true;
            let data = [];
            res.data.forEach(item=>{
                data.push({
                    value:item.total,
                    name:item.messageState
                })
            })
            chartPie('msg-status', data)
        }else{
            // ElMessage({
            //     type:'warning',
            //     message:'暂无数据'
            // })
            msgStatusShow.value = false
        }
    })
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.box{
    background:#fafafa;
    padding:30px;
    height:calc(100% - 100px)
}
.card{
    width:100%;
    height:150px;
    .card-item{
        float:left;
        width:365px;
        height:100%;
        margin-right:30px;
        background:#ccc;
        color:#fff;
        text-align:center;
        .card-total{
            font-size:50px;
            height:50px;
            line-height:50px;
            margin-top:25px;
            margin-bottom:10px;
        }
        .card-label{
            height:30px;
            line-height:30px;
            margin-top:0;
            font-size:18px;
        }
    }
    .userCount{
        margin-right:0;
    }
}
.chart-box{
    width:1572px;
    margin-top:20px;
    .box-item{
        width:765px;
        float:left;
        margin-right:30px;
        height:300px;
        .chart-item{
            width:770px;
            height:270px;
        }
        .no-data{
            width:770px;
            height:270px;
            line-height:270px;
            font-size:16px;
            color:#ccc;
            text-align:center;
        }
        .chart-title{
            padding-left:20px;
            font-size:16px;
            height:30px;
            line-height:30px;
            border-left:2px solid #017AFF;
            span{
                color:#017AFF;
                float:right;
                margin-right:20px;
                cursor:pointer;
                text-decoration:underline;
            }
        }
    }
    .box-item:nth-child(2),.box-item:nth-child(4){
        margin-right:0;
    }
}
</style>