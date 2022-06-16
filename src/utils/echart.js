import * as echarts from 'echarts';

export const chartBar = function (id, label, data, name) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: true,
            left: 'left',
            top: '20'
        },
        xAxis: {
            type: 'category',
            data: label
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: name,
                data: data,
                type: 'bar',
                barMaxWidth: '30'
            }
        ]
    };
    option && myChart.setOption(option);
}
export const chartPie = function (id, data) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: '20'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                data: data,
            }
        ]
    };
    option && myChart.setOption(option);
}