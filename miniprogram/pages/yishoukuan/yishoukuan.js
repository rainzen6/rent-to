const app=getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    title: '加载中...',
  },


  async getlist(){
    let count = await  db.collection("demolist").where({
      _openid:app.globalData.openid,
      payment:"true",
    }).count()

      count = count.total
      console.log(count)
      let all = []
      for(let i = 0; i < count ; i+=20){
        let list = await db.collection("demolist").where({
          _openid:app.globalData.openid,
          payment:"true"
        }).skip(i).get()
        all = all.concat(list.data)
      }
      console.log('返回的结果',all)
      this.setData({
        list:all
        
      })

  },

  
  godetail(e){
    console.log('点击了跳转商品详情',e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/detailpage/detailpage?id='+e.currentTarget.dataset.id,
    })
  },
  delete_business(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '警告',
      content: '是否删除这个账单',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('demolist').doc(id).remove({
            success: function(res) {
              console.log(res.data)
              wx.showToast({
                title: '删除成功',
              })
              that.list()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
      this.getlist()
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
      this.getlist()  
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

    db.collection("demolist").where({
      _openid:app.globalData.openid,
      payment:"true"

    }).get().then(res=>{
      console.log(res)
      this.setData({
        list:res.data
      },res=>{
        console.log('刷新成功')
        wx.stopPullDownRefresh({
          
        })
      })
    })
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