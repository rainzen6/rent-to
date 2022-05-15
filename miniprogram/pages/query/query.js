const app=getApp()
const db= wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
  search:""
    
  },


  
  searchinput:function(e){
    this.setData({
      search:e.detail.value
    });
  },
  btnsub(res){

    let search=this.data.search
    console.log(search)
    db.collection('demolist').where(_.or([
      {
        rentorname:db.RegExp({
          regexp:search,
          option:'i'
        })
      },
      {
        room_id:db.RegExp({
          regexp:search,
          option:'i'
        })
      }

    ])).get().then(res=>{
      console.log(res)
      this.setData({
        list:res.data
      })
    })

    
  },
  godetail(e){
    console.log('点击了跳转商品详情',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/detailpage/detailpage?id='+e.currentTarget.dataset.id,
    })
  },

  //账单未完成
  paymentfalse:function(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    db.collection("demolist").doc(id)
    .update({
      data:{
        payment:"true"

      }
    })
    .then(res=>{
      console.log('账单已完成',res)
      wx.showToast({
        title: '账单已完成',
        duration:2000

      })
      this.btnsub()
    })
    
  },
  //账单已完成
  paymenttrue:function(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    db.collection("demolist").doc(id)
    .update({
      data:{
        payment:"false"

      }
    })
    .then(res=>{
      console.log('账单未完成',res)
      wx.showToast({
        title: '账单未完成',
        duration:2000

      })
      this.btnsub()  
    })
    
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