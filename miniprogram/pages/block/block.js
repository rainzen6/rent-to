
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
    roomlist:[],
    roomcounts:'',
    switchCheck:'',
    showalterModal:true
    
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
//添加提交楼栋
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

  
  //删除楼栋
  deleteBlocks:function () {
    let block_name = this.data.block_name
    let roomcounts =  this.data.roomcounts
    console.log('该楼栋的租客记录数',roomcounts)
    console.log('楼栋名',block_name);
    if(!block_name){
      wx.showToast({
        title: '没有选择楼栋哦',
        icon:'error'
      })
    }else {

      //当该楼栋的租客数为0时
    if(roomcounts==0){
      wx.showModal({
        title: '提示',
        content: '是否删除'+ block_name,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            db.collection('blocks').where({
              _openid:app.globalData.openid,
              block_name
            }).remove({
              success: function(res) {
                console.log(res.data)
                wx.showToast({
                  title: '删除成功',
                }) 
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     //当该楼栋的租客数大于0时
    }else{
      wx.showModal({
        title: '提示',
        content: '是否删除' + block_name + '同时可能会删除掉该楼栋下的所有房间信息',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            db.collection('blockandroom').where({
              _openid:app.globalData.openid,
              block_name
            }).remove({
              success: function(res) {
                console.log('删除该楼栋的全部租客',res.data)
                
              }
            })

            db.collection('blocks').where({
              _openid:app.globalData.openid,
              block_name
            }).remove({
              success: function(res) {
                console.log('删除该楼栋',res.data)
                wx.showToast({
                  title: '删除成功',
                }) 
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      }
    }
    
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

  this.getroomlist()
},
//打开添加租客弹出框
addRoomModal: function () {
  let block_name = this.data.block_name
  if (block_name) {
     this.setData({
    showaddroommodal:false
    
  })
  }else{
    wx.showToast({
      title: '没有选择楼栋哦',
      icon:'error'
    })
  }
 
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
  
  if(!block_name){
    wx.showToast({
      title: '没有选择楼栋哦',
      icon:'error'
    })

  }else{
db.collection("blockandroom").add({
    data:{
      block_name,
      rentorname,
      room_id,
      hasrentor:true
    }
  }).then(res=>{
    console.log('房间添加成功',res)
    
    wx.showToast({
      title: '房间添加成功',
    })
  })
  }
  
  this.setData({
    showaddroommodal:true
  })
 },

//获取该楼栋的房间信息
 async getroomlist(){
  let blocklist = this.data.blocklist
  let index = this.data.index
  let block_name = this.data.block_name
  console.log('当前楼栋',blocklist[index].block_name);
  
  let roomcounts = await  db.collection("blockandroom").where({
    _openid:app.globalData.openid,
    block_name
  }).count()

  roomcounts = roomcounts.total
  console.log('记录数',roomcounts)
    let roomall = []
    for(let i = 0; i < roomcounts ; i+=20){
      let roomlists = await db.collection("blockandroom").skip(i).where({
        _openid:app.globalData.openid,
        block_name
        
      }).get()
      roomall = roomall.concat(roomlists.data)
    }
    console.log('房间返回的结果',roomall)
    this.setData({
      roomlist:roomall,
      roomcounts
    })
    
 },

 deleteRoom:function () {
  let block_name = this.data.block_name
  let room_id = this.data.room_id
  let id = e.currentTarget.dataset.id
  wx.showModal({
    title: '提示',
    content: '是否删除'+ block_name+'下的'+room_id,
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        db.collection('blockandroom').where({
          _openid:app.globalData.openid,
          block_name,
          room_id
        }).remove({
          success: function(res) {
            console.log(res.data)
            wx.showToast({
              title: '删除房间成功',
            }) 
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
 },
//打开修改页面
 showalterModal: function (e) {
  //先查找数据库中这个id的hasrentor值，然后赋值给e.detail.value
  let id = e.currentTarget.dataset.id
  console.log('open',id);
  let hasrentor 
  let room_id
  db.collection("blockandroom").doc(id).get()
  .then(res=>{
    console.log('查找状态成功',res.data.hasrentor)
    this.setData({
    showalterModal:false,
    id,
    switchCheck:res.data.hasrentor,
    room_id:res.data.room_id
    })

    
    
  })
  console.log(hasrentor);
  
 
},


//修改状态
switchChange:function (e) {
  
  //先查找数据库中这个id的hasrentor值，然后赋值给e.detail.value
  console.log('switch样式',e.detail.value);
  let id = this.data.id
  console.log('switch',id);

  let hasrentor 
  console.log(hasrentor);
  
  db.collection("blockandroom").doc(id)
  .update({
    data:{
      hasrentor:e.detail.value

    }
  })
  .then(res=>{
     console.log('修改状态成功',res)
     
      wx.showToast({
        title: '状态修改成功',
        duration:2000
  
        })

    this.getroomlist()
    
  })
  
  

},
//关闭修改页面
cancelalterModal:function(){

  this.setData({
    showalterModal:true
  })
  
},
//删除该楼栋下的房间
delete_room_rentor:function () {
  let id = this.data.id
  console.log('delete',id)
  let room_id = this.data.room_id
  let block_name = this.data.block_name
  wx.showModal({
    title: '提示',
    content: '是否删除'+ block_name+'下的房间'+room_id,
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        db.collection('blockandroom').where({
          _openid:app.globalData.openid,
          _id:id
          
          
        }).remove({
          success: function(res) {
            console.log(res.data)
            wx.showToast({
              title: '删除房间成功',
            })

            
          }
          
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
       
      }
    }
    
  })
  this.cancelalterModal()
  this.getlist()
  this.getroomlist()
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