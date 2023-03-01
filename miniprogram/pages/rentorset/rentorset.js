var app = getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    "rentorname":"",
    "room_id":"",
    rentorlist:[],
    index:0,
    clicknum:0,
    showmodal:true,
    id:"",
    showaddmodal:true
  },

 
  async getnewlist(){
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
//查询租客
  refresh:function(){
    db.collection("rentor").where({
      _openid:app.globalData.openid,
      

    })
    .get()
    .then(res=>{
      console.log('查询租客成功',res)
      this.setData({
        rentorlist:res.data
        
      })
    })
  },
  dianji:function(){
    let clicknum = this.data.clicknum
    clicknum++
     this.setData({
       clicknum
     })
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
    db.collection("rentor").where({
      _openid:app.globalData.openid,
      rentorname:rentorlist[index].rentorname

    })
    .get()
    .then(res=>{
      console.log('查询当前租客成功',res)
      this.setData({
        tenant:res.data
        
      })
    })
  },

 
  
  rentorandroompage:function(){

    wx.navigateTo({
      url: '../rentorandroom/rentorandroom',
    })
  },

  delete(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '警告',
      content: '是否删除这个租客',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('rentor').doc(id).remove({
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

    this.refresh();
  },

  //输入名字
  rentornameinput:function(e){
    this.setData({
      rentorname:e.detail.value
    });

  },

  //输入房间号
  room_idinput:function(e){
    this.setData({
      room_id:e.detail.value
    });

  },

  //修改租客和房间号
  updaterentor:function(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    console.log(id)
    db.collection("rentor").doc(id)
    .update({
      data:{
        rentorname,
        room_id

      }
    })
    .then(res=>{
      console.log('修改成功',res)
      wx.showToast({
        title: '修改成功',
      })
      this.refresh();
    })
      
  },

  //进入添加页面
  addmodal:function(e){
    
    this.setData({
      showaddmodal:false,
      
    })
    
  },
  canceladd:function(){

    this.setData({
      showaddmodal:true
    })
    this.getnewlist()
  },

  //添加租客和房间号
  confirmadd:function(){
    console.log(app.globalData.openid)
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    db.collection("rentor").add({

      data:{
        rentorname,
        room_id
      }
    }).then(res=>{
      console.log('添加成功',res)
      this.refresh();
      wx.showToast({
        title: '添加成功',
      })
    })
    this.setData({
      showaddmodal:true
    })
    
    this.getnewlist()
  },

  //进入修改页面
  modal:function(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      showmodal:false,
      id
    })
    console.log('modal中获取的',id)
  },

  cancel:function(){

    this.setData({
      showmodal:true
    })
  },

 //修改页面提交
  confirm:function(e){
    let id = this.data.id
    console.log('确认按钮',id)
    
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    db.collection("rentor").doc(id)
    .update({
      data:{
        rentorname,
        room_id

      }
    })
    .then(res=>{
      console.log('修改成功',res)
      this.refresh();
    })
    this.setData({
      showmodal:true
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

    this.getnewlist();
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
     this.getnewlist();
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