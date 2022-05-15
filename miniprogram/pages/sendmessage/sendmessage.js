const app=getApp()
const db= wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },


  //获取授权的点击事件
  shouquan() {
    wx.requestSubscribeMessage({
      tmplIds: ['9zkKYn1Cdh1HqTy-hwh5qj2q6P3aG9g1ZSsPB-KxtTI'], //这里填入我们生成的模板id
      success(res) {
        console.log('授权成功', res)
      },
      fail(res) {
        console.log('授权失败', res)
      }
    })
  },

  //发送模板消息到指定用户,推送之前要先获取用户的openid
  send(openid) {
    wx.cloud.callFunction({
      name: "sendmessage",
      data: {
        openid: openid
      }
    }).then(res => {
      console.log("推送消息成功", res)
    }).catch(res => {
      console.log("推送消息失败", res)
    })
  },
  //获取用户的openid
  getOpenid() {
    wx.cloud.callFunction({
      name: "getopenid"
    }).then(res => {
      let openid = res.result.openid
      console.log("获取openid成功", openid)
      this.send(openid)
    }).catch(res => {
      console.log("获取openid失败", res)
    })
  },
  

  sendmessage(e){
    const templateId = '9zkKYn1Cdh1HqTy-hwh5qj2q6P3aG9g1ZSsPB-KxtTI'
    

    wx.requestSubscribeMessage({

      tmplIds:[templateId],
      success(res){
        if(res[templateId]==='accept'){
         db.collection("messages").add({
           data:{
             subMsg:{
              
              time1:{
                value:'2022年5月'
              },
              phrase2:{
                value:'f房租'
              },
              amount3:{
                value:'666'
              },
              name4:{
                value:'曾鸿睿'
              },
              thing8:{
                value:'微信'
              },

             },

             status:1,
             createTime:new Date(),
             templateId:templateId
           },
           success(res){
             console.log("成功存入数据库")
           },
           fail(res){
            console.log("失败存入数据库")
           }

         })
          wx.showToast({
            
            title:'消息订阅成功'
          })

        }else{
          wx.showToast({
            title: '订阅失败',
          })
          console.log(res[templateId],'失败')
        }
      }
    })
    

  },

  // 发送订阅消息
  sendSubscribe() {
    const templateId = '9zkKYn1Cdh1HqTy-hwh5qj2q6P3aG9g1ZSsPB-KxtTI' //模板ID
    const openid = app.globalData.openid // 用户的openid
    const db = wx.cloud.database(); 
    db.collection('user_subscribe').where({ //查找数据库中模板ID对应未发送的记录
      _openid: openid,
      status: 1,
      templateId: templateId
    }).limit(1).get({
      success: res => {
        const id = res.data[0]._id  //存储该条数据的id
        // 调用云函数发送订阅消息
        wx.cloud.callFunction({
          name: "subscribe",
          data:res.data[0]
        }).then(res => {
          console.log("推送成功", res)
          // 根据id修改该条数据状态，设置为已发送
          db.collection('messages').where({
            _id: id
          }).update({
            data: {
              status: "0"
            }
          })
        }).catch(res => {
          console.log(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询订阅消息记录失败'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})