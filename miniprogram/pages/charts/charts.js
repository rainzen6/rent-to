import * as echarts from '../../ec-canvas/echarts'

const app = getApp();
const db= wx.cloud.database()

let chart;
let chart2;
let series = [];
let series2 = [];
let xAxisData =[]

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
 
  var  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '0%',
      left: 'center'
    },
    series
  };
  
console.log(series)
  
  chart.setOption(option);
  return chart;
}

function initChart2(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart2);
 
  var  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid:{
      left:'3%',
      right:'4%',
      bottom:'3%',
      containLabel:true

    },
    xAxis:{
      type:'category',
      data:xAxisData[0]
    },
    yAxis:{
      type:'value'
    },
    series:series2
  };
  

  
  chart2.setOption(option);
  return chart2;
}

Page({
  
  data: {
    item:{},
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    

    canvasIsShow: true,
    numbers:[],
    x:0,
    nav_list:[
      {
        month_id:1,
        month_name:"一月",
        month:'1'
      },
      {
        month_id:2,
        month_name:"二月",
        month:'2'
      },
      {
        month_id:3,
        month_name:"三月",
        month:'3'
      },
      {
        month_id:4,
        month_name:"四月",
        month:4
      },
      {
        month_id:5,
        month_name:"五月",
        month:'5'
      },
      {
        month_id:6,
        month_name:"六月",
        month:'6'
      },
      {
        month_id:7,
        month_name:"七月",
        month:'7'
      },
      {
        month_id:8,
        month_name:"八月",
        month:'8'
      },
      {
        month_id:9,
        month_name:"九月",
        month:'9'
      },
      {
        month_id:10,
        month_name:"十月",
        month:'10'
      },
      {
        month_id:11,
        month_name:"十一月",
        month:'11'
      },
      {
        month_id:12,
        month_name:"十二月",
        month:'12'
      },

    ],
    month_id:'',
    month:'',
    listmonth:'',
    list:[],
    electPercent:0,
    date:' Select date/选择日期',
    amoney:0

  },

  


  bindDateChange: function(e) {
    console.log('picker日期发送选择改变，携带值为', e.detail.value)
    var year = e.detail.value.substring(0,4)
    
    var month = e.detail.value.substring(5,7)//10 11 12
    var months = e.detail.value.substring(6,7)//单位数
    console.log('chuwai',months)
    var lastyear =   String(year-1)
    var lastmonth =  String(month-1)
    console.log(month)
    console.log('上ge年',lastyear)
    console.log('上ge月',lastmonth)
    //本月为1月，上月为12月
    if(lastmonth==0){
      this.setData({
        date: e.detail.value,
        year,
        month:'1',
        lastmonth:'12',
        lastyear
      })
    }else if(lastmonth==11||lastmonth==10||lastmonth==9){
       //本月为12/11/10月
      this.setData({
        date: e.detail.value,
        year,
        month,
        lastmonth,
        
      })
    }
    else {
      var month  = e.detail.value.substring(6,7)//单位数
      console.log('qita',month)
      this.setData({
      date: e.detail.value,
      year,
      lastmonth,
      month

      })
    }
    console.log('当前月份',month)
    console.log(lastmonth)
    

    this.getlist()
  },

  async getlistFirst(){
    var year = this.data.year
    console.log('账单查询获取到的年',year)
    var nowmonth = this.data.nowmonth
    
    console.log('当前时间的本月',nowmonth)

    var listmonth = this.data.listmonth
    console.log('账单查询获取到的月',listmonth)
    let count = await  db.collection("demolist").where({
      _openid:app.globalData.openid,
     
      
    }).count()

      count = count.total
      console.log('记录数',count)
      let all = []
      for(let i = 0; i < count ; i+=20){
        let list = await db.collection("demolist").skip(i).orderBy('createTime','desc').where({
          _openid:app.globalData.openid,
          year,
          month:nowmonth
          
        }).get()
        
        all = all.concat(list.data)
      }
      console.log('返回的结果',all)
      
      this.setData({
        list:all
        
        
      })


  },

  async getlist(){
    var year = this.data.year
    console.log('账单查询获取到的年',year)
    var month = this.data.month
    
    console.log('账单查询获取到的月',month)
    let count = await  db.collection("demolist").where({
      _openid:app.globalData.openid,
     
      
    }).count()

      count = count.total
      console.log('记录数',count)
      let all = []
      for(let i = 0; i < count ; i+=20){
        let list = await db.collection("demolist").skip(i).where({
          _openid:app.globalData.openid,
          year,
          month
          
        }).get()
        
        all = all.concat(list.data)
      }
      console.log('返回的结果',all)
      console.log('长度',all.length)
     //计算每月的总金额
     var i = 0;
     var amoney = 0;
     var aelect = 0;
     var awater = 0;
     var aroom = 0;
     var allroom_id_bar = [];
     var allroom_money_bar = [];
     var allwaterprice_bar = [];
     var allelectprice_bar = [];
     
     for(i=0;i<all.length;i++){
       amoney = amoney + all[i].all_money
       aelect = aelect + all[i].allelectprice
       awater = awater + all[i].allwaterprice
       aroom = aroom + all[i].room_money
       allroom_id_bar[i] = all[i].room_id
       allroom_money_bar[i] = all[i].room_money
       allwaterprice_bar[i] = all[i].allwaterprice
       allelectprice_bar[i] = all[i].allelectprice

     }
     console.log('计算后的每月总金额',amoney)
     console.log('房间数组',allroom_id_bar)
     console.log('房租数组',allroom_money_bar)
     console.log('水费数组',allwaterprice_bar)
     console.log('电费数组',allelectprice_bar)
     var RoomPercent = (aroom/amoney)*100
     console.log('百分比房租',RoomPercent)
     var waterPercent = (awater/amoney)*100
     console.log('百分比水费',waterPercent)
     var electPercent = (aelect/amoney)*100
     console.log('百分比电费',electPercent)
     let echartData = [{
       type: 'pie',
       radius: ['20%', '50%'],
      
    
       data:[ {value:awater, name:"水费"},
         {value:aroom, name:"房租"},
        {value:aelect, name:"电费"}]
       
       }],
      
       xAxisData = []
       
      

     let series2Data = [
      {
        name:'房租',
        type:'bar',
        stack:'total',
        label:{
          show:true
        },
        data:allroom_money_bar
      },
      {
        name:'水费',
        type:'bar',
        stack:'total',
        label:{
          show:true
        },
        data:allwaterprice_bar
      },
      {
        name:'电费',
        type:'bar',
        stack:'total',
        label:{
          show:true
        },
        data:allelectprice_bar
      }]
      
      this.setData({
        list:all,
        amoney,
        aelect,
        awater,
        aroom,
        echartData,
        xAxisData,
        series2Data,
        RoomPercent,
        waterPercent,
        electPercent

      })
    
      console.log('echarts数组',echartData)
      series.push(echartData);
      console.log('series',series)
      series2.push(series2Data)
      xAxisData.push(allroom_id_bar)
      console.log('series2',series2)
      console.log('xAxis',xAxisData)
      var a =2;
      if(series.length >3){
        a = series.length-1
      }
      if (chart) {
        // 只更新图表
        chart.setOption({
            series: series[a]
        })
    }
    // 如果echarts未初始化
    else {
        // echarts没有初始化, 初始化它
        this.setData({
            ec: {
                onInit: initChart
            }
        })
    }
    
    if (chart2) {
      // 只更新图表
      chart2.setOption({
          xAxis:xAxisData,
          series: series2[a]

          
      })
  }
  // 如果echarts未初始化
  else {
      // echarts没有初始化, 初始化它
      this.setData({
          ec2: {
              onInit: initChart2
          }
      })
  }


     

  },



 
  onLoad(){
    var date =new Date();
      var Year = date.getFullYear();
      var nowmonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      
      var year =  String(Year)
      console.log("当前年月",year,nowmonth)
      console.log(typeof(year))
      console.log(typeof(nowmonth))
      
      this.setData({
        year,
        
        nowmonth
      })
      
       this.getlist()
      
    if(nowmonth!=''){
      this.setData({
        
        month_id:nowmonth,
        
        })
    }
   

  },


 
  onShow(){
    this.getlist()
  }
 
  



});




