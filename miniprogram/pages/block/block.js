
var app = getApp()
const db= wx.cloud.database()// pages/block/block.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showaddmodal:true,
    "block_name":"",
    blocklist:[],
    index: '',
    showaddroommodal:true,
    rentorlist:[],
    rentorindex:'',
    hasrentor:true
    
  },

   //打开添加楼栋页面框
  addBlocksModal:function(e) {
    this.setData({
      showaddmodal:false
      
    })
  },
  block_nameinput:function(e){
    this.setData({
      block_name:e.detail.value
    });

  },

  confirmadd_block:function () {
    let block_name = this.data.block_name
    db.collection("blocks").add({
      data:{
        block_name
      }
    }).then(res=>{
      console.log('添加成功',res)
      
      wx.showToast({
        title: '添加成功',
      })
    })
    this.setData({
      showaddmodal:true
    })
  },

  canceladd_block:function(){

    this.setData({
      showaddmodal:true
    })
    
  },

  
//查询楼栋
  async  queryblocks(){
    let count = await  db.collection("blocks").where({
      _openid:app.globalData.openid}).count()

      count = count.total
      let all = []
      for(let i = 0; i < count ; i+=20){
        let list = await db.collection("blocks").skip(i).get()
        all = all.concat(list.data)
      }
      console.log('返回的结果',all)
      this.setData({
        blocklist:all
        
      })
},
//选择楼栋
bindblocknameChange: function(e) {
  this.setData({
    index: e.detail.value
  })
  let blocklist = this.data.blocklist
  let index = this.data.index
  console.log('楼栋picker发送选择改变，携带值为', blocklist[index].block_name)
  
  this.setData({
    block_name:blocklist[index].block_name
  })
},
//打开添加租客弹出框
addRoomModal: function () {
  this.setData({
    showaddroommodal:false
    
  })
},
//关闭添加租客弹出框
canceladd_rentor:function(){

  this.setData({
    showaddroommodal:true
  })
  
},
//获取rentor中所有的租客信息
async getlist(){
  let counts = await  db.collection("rentor").where({
    _openid:app.globalData.openid}).count()

    counts = counts.total
    let rentorall = []
    for(let i = 0; i < counts ; i+=20){
      let rlist = await db.collection("rentor").skip(i).get()
      rentorall = rentorall.concat(rlist.data)
    }
    console.log('返回的结果',rentorall)
    this.setData({
      rentorlist:rentorall
      
    })

},
//选择租客
bindrentornameChange: function(e) {
  this.setData({
    rentorindex: e.detail.value
  })
  let rentorlist = this.data.rentorlist
  let rentorindex = this.data.rentorindex
  console.log('租客picker发送选择改变，携带值为', rentorlist[rentorindex].rentorname)
  
  console.log(rentorlist[rentorindex].room_id)
  this.setData({
    rentorname:this.data.rentorlist[rentorindex].rentorname,
    room_id:this.data.rentorlist[rentorindex].room_id
  })

  
},

//添加该楼栋的租客
confirmadd_rentor:function () {
  let block_name = this.data.block_name
  let rentorname = this.data.rentorname
  let room_id = this.data.room_id
  let hasrentor = this.data.hasrentor
  db.collection("blockandroom").add({
    data:{
      block_name,
      rentorname,
      room_id,
      hasrentor
    }
  }).then(res=>{
    console.log('房间添加成功',res)
    
    wx.showToast({
      title: '房间添加成功',
    })
  })
  this.setData({
    showaddroommodal:true
  })
 },

 async getroomlist(){

  let block_name = this.data.block_name
  let roomcounts = await  db.collection("blockandroom").where({
    _openid:app.globalData.openid,
    block_name:block_name
  }).count()

  roomcounts = roomcounts.total
    let roomall = []
    for(let i = 0; i < roomcounts ; i+=20){
      let roomlist = await db.collection("rentor").skip(i).get()
      roomall = roomall.concat(roomlist.data)
    }
    console.log('返回的结果',roomall)
    this.setData({
      roomlist:roomall
      
    })
    console.log(roomlist);
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

    this.queryblocks()
    this.getlist()
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