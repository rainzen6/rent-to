// pages/mine/mine.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
    openid:""
  },
   //授权登录
   login(){
    wx.getUserProfile({
      desc: '必须授权才可以继续使用',
      success:res=>{
          let user=res.userInfo
          wx.setStorageSync('user', user)
          console.log('用户信息',user)
          this.setData({
            userInfo:user
          })
      },
      fail:res=>{
         console.log('授权失败',res)
      }
    })
  },
  //退出登录
  loginout(){
    this.setData({
      userInfo:''
    })
    wx.setStorageSync('user', null)
  },

  datasetpage:function(){
      wx.navigateTo({
        url: '../dataset/dataset',
      })
  },

  rentorsetpage:function(){
    wx.navigateTo({
      url: '../rentorset/rentorset',
    })
  },

  sendmessagepages(){
    wx.navigateTo({
      url: '../sendmessage/sendmessage',
    })

  },
  block(){
    wx.navigateTo({
      url: '../block/block',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"getopenid"
    })
    .then(res=>{
      console.log(res)
    })
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