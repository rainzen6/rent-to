var app= getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "rentorname":"",
    "room_id":"",
    "old_water":"",
    "new_water":"",
    "waterprice":"",
    "allwaterprice":"",
    "old_electricity":"",
    "new_electricity":"",
    "electprice":"",
    "allelectprice":"",
    "room_money":"",
    "all_money":"",
    "date":"",
    waterlist:[],
    rentorlist:[],
    index:'',
    id:"",
    year:"",
    month:"",
    lastyear:"",
    lastmonth:"",
    lastlist:[],
    totalnum:"",
    months:"",
    payment:"false",
    
  },
  
  
  async getlist(){
    let count = await  db.collection("rentor").where({
      _openid:app.globalData.openid}).count()

      count = count.total
      let all = []
      for(let i = 0; i < count ; i+=20){
        let list = await db.collection("rentor").skip(i).get()
        all = all.concat(list.data)
      }
      console.log('返回的结果',all)
      this.setData({
        rentorlist:all
        
      })

  },

  //获取记录数
  gettotal:function(){
    
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    var year = this.data.year
    var lastyear = this.data.lastyear
    var lastmonth =  this.data.lastmonth
    console.log('上年',lastyear)
    console.log('上月',lastmonth)
    if(lastmonth!=12){
  
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year,
        month:lastmonth
        
      })
      .count()
      .then(res=>{
        console.log('上月记录数',res.total)
        this.setData({
          totalnum:res.total
          
        })
      })
    }else if(lastmonth==12){
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year:lastyear,
        month:lastmonth
        
      })
      .count()
      .then(res=>{
        console.log('上月记录数',res.total)
        this.setData({
          totalnum:res.total
          
        })
      })
    }
  
    let atotalnum = this.data.totalnum
    console.log(app.globalData.openid),
    console.log('实际',atotalnum)
    
  },
  //租客选择
  bindrentornameChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    let rentorlist = this.data.rentorlist
    let index = this.data.index
    console.log('picker发送选择改变，携带值为', rentorlist[index].rentorname)
    
    console.log(rentorlist[index].room_id)
    this.setData({
      rentorname:this.data.rentorlist[index].rentorname,
      room_id:this.data.rentorlist[index].room_id
    })

    this.getlastwater();
  },

 //日期选择
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

    this.getlastwater();
  },
  
 //获取当前租客上月水电费
  getlastwater:function(){
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    var year = this.data.year
    var lastyear = this.data.lastyear
    var lastmonth =  this.data.lastmonth
    
    console.log('上年',lastyear)
    console.log('上月',lastmonth)
    //2 3 4 5 6 7 8 9 10 11 12
    if(lastmonth!=12){

      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year,
        month:lastmonth
        
      })
      .get()
      .then(res=>{
        console.log('上月水费记录',res)
        this.setData({
          lastlist:res.data
          
        })
      })
    }else if(lastmonth==12){
      //本月是1月 上月为12月
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year:lastyear,
        month:lastmonth
        
      })
      .get()
      .then(res=>{
        console.log('上月水费记录',res)
        this.setData({
          lastlist:res.data
          
        })
      })
    }
    
    
     
  },


  
  rentornameinput:function(e){
    this.setData({
      rentorname:e.detail.value
    });
  },
  room_idinput:function(e){
    this.setData({
      room_id:e.detail.value
    });
  },
  old_waterinput:function(e){
   
    this.setData({
      old_water:e.detail.value
    });
  },
  new_waterinput:function(e){
    this.setData({
      new_water:e.detail.value
    });
  },
  waterpriceinput:function(e){
    
    this.setData({
      waterprice:e.detail.value
    });
    
    
  },
  old_electricityinput:function(e){
    this.setData({
      old_electricity:e.detail.value
    });
  },
  new_electricityinput:function(e){
    this.setData({
      new_electricity:e.detail.value
    });
  },
  electpriceinput:function(e){
    this.setData({
      electprice:e.detail.value
    });
  },
  room_moneyinput:function(e){
    this.setData({
      room_money:e.detail.value
    });
  },
  all_moneyinput:function(e){
    this.setData({
      all_money:e.detail.value
    });
  },
  yearinput:function(e){
    
    this.setData({
      year:e.detail.value
    });
  },
  monthinput:function(e){

    this.setData({
      month:e.detail.value
    });
  },


  //计算
  jisuan:function(){

    this.gettotal()
    var totalnum = this.data.totalnum
    console.log('获取到的tatalnum',totalnum)
    var lastlistlength = this.data.lastlist.length
    console.log('上月记录的长度',lastlistlength)
    if(lastlistlength==0){
     console.log(this.data.new_water)
     var allwp=(this.data.new_water-this.data.old_water)*this.data.waterlist[0].waterprice;
     var allep=(this.data.new_electricity-this.data.old_electricity)*this.data.electlist[0].electprice;

    }else if(lastlistlength==1){
      console.log(this.data.lastlist[0].new_water)
    var allwp=(this.data.new_water-this.data.lastlist[0].new_water)*this.data.waterlist[0].waterprice;
    var allep=(this.data.new_electricity-this.data.lastlist[0].new_electricity)*this.data.electlist[0].electprice;
     
    }
    
    console.log('固定水',this.data.waterlist[0].waterprice)
    console.log('计算后的水费',allwp)
    this.data.room_money=parseInt(this.data.room_money);
    console.log(typeof(this.data.room_money))
    console.log(typeof(allwp))
    let allmon=allwp+allep+this.data.room_money;
    console.log(allmon)
    
    this.setData({
      allwaterprice:allwp,
      allelectprice:allep,
      all_money:allmon
    })
 },

 
  //提交表单
  btnsub(res){

    var lastlistlength = this.data.lastlist.length
    this.gettotal();
    var totalnum = this.data.totalnum
    console.log(totalnum)
    this.jisuan();
    
   
    if(lastlistlength==0){

      var old_water=this.data.old_water;
      var old_electricity=this.data.old_electricity;
      
    }else if(lastlistlength==1){
      var old_water=this.data.lastlist[0].new_water;
      var old_electricity=this.data.lastlist[0].new_electricity;
    }
    
    let rentorname=this.data.rentorname;
    let room_id=this.data.room_id;
   
    let new_water=this.data.new_water;
    let waterprice=this.data.waterlist[0].waterprice;
    let allwaterprice=this.data.allwaterprice;
    
    let new_electricity=this.data.new_electricity;
    let electprice=this.data.electlist[0].electprice;
    let allelectprice=this.data.allelectprice;
    let room_money=this.data.room_money;
    let all_money=this.data.all_money;
    let date=this.data.date;
    let year=this.data.year;
    let month=this.data.month;
    let payment=this.data.payment;
    
     db.collection("demolist").add({
       data:{
        rentorname,
        room_id,
        old_water,
        new_water,
        waterprice,
        allwaterprice,
        old_electricity,
        new_electricity,
        electprice,
        allelectprice,
        room_money,
        all_money,
        date,
        year,
        month,
        payment,
        createTime:db.serverDate()
       }
     }).then(res=>{
       console.log(res)
       wx.showToast({
        title: '添加账单成功'
      })
       wx.switchTab({
         url: '../index/index',
       })
       
     })
      
      
      
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getlist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //查询设置的水费
    db.collection("waterprice").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      console.log('水费单价',res)
      this.setData({
        waterlist:res.data
        
      })
    })
   //查询设置的电费
    db.collection("electprice").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      console.log('电费单价',res)
      this.setData({
        electlist:res.data
        
      })
    })

    //查询已记录的租客
    this.getlist()


    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})