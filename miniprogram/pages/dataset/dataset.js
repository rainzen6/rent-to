var app = getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    wtotalnum:'',
    waterprice:'',
    etotalnum:'',
    electprice:''
  },

  //获取水费记录数
  wgettotal:function(){
    
    db.collection("waterprice").where({
      _openid:app.globalData.openid
    })
    .count()
    .then(res=>{
      console.log('水记录数',res)
      this.setData({
        wtotalnum:res.total
        
      })
    })
    
    var wtotalnum = this.data.wtotalnum
    console.log(app.globalData.openid),
    console.log('实际',wtotalnum)
  },

  //添加水费记录
  wadd:function(){
    console.log(app.globalData.openid)
    let waterprice = this.data.waterprice
    db.collection("waterprice").add({

      data:{
        waterprice
      }
    }).then(res=>{
      console.log('添加成功',res),
      wx.showToast({
        title: '修改水费成功',
      })
    })
      
  },

  //输入水单价
  waterpriceinput:function(e){
    this.setData({
      waterprice:e.detail.value
    });
  },

  

  //修改水费
  updatewater:function(){
    let waterprice = this.data.waterprice
    db.collection("waterprice").where({
      _openid:app.globalData.openid
    })
    .update({
      data:{
        waterprice
      }
    })
    .then(res=>{
      console.log('修改成功',res)
      wx.showToast({
        title: '修改水费成功',
      })
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
    })
  },

  //水总函数
  waterThemain:function(){
    
      this.wgettotal()
      console.log('调用查询记录数')
      let wtotalnum = this.data.wtotalnum
      if(wtotalnum==0){
        this.wadd()
        console.log('调用了添加记录')
      }else if(wtotalnum==1){
        this.updatewater()
        console.log('调用了修改记录')
      }
      
  },



  //获取电费记录数
  egettotal:function(){
    
    db.collection("electprice").where({
      _openid:app.globalData.openid
    })
    .count()
    .then(res=>{
      console.log('电记录数',res)
      this.setData({
        etotalnum:res.total
        
      })
    })
    
    var etotalnum = this.data.etotalnum
    console.log(app.globalData.openid),
    console.log('实际',etotalnum)
  },

  //添加电费记录
  eadd:function(){
    console.log(app.globalData.openid)
    let electprice = this.data.electprice
    db.collection("electprice").add({

      data:{
        electprice
      }
    }).then(res=>{
      console.log('添加成功',res)
    })
      
  },


  //输入电单价
  electpriceinput:function(e){
    this.setData({
      electprice:e.detail.value
    });
  },


  //修改电费
  updateelect:function(){
    let electprice = this.data.electprice
    db.collection("electprice").where({
      _openid:app.globalData.openid
    })
    .update({
      data:{
        electprice
      }
    })
    .then(res=>{
      console.log('修改成功',res)
      wx.showToast({
        title: '修改电费成功',
      })
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
    })
  },

  //电总函数
  electThemain:function(){
    
      this.egettotal()
      console.log('调用查询记录数')
      let etotalnum = this.data.etotalnum
      if(etotalnum==0){
        this.eadd()
        console.log('调用了添加记录')
      }else if(etotalnum==1){
        this.updateelect()
        console.log('调用了修改记录')
      }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //查询用户的水记录
  onShow: function () {
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

    this.wgettotal();
    
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

    this.egettotal();
    var date = new Date
    console.log('获取当前月份',date.getFullYear())
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