const app=getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    title: '加载中...',
    
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
    listmonth:''

  },

  


  bindDateChange: function(e) {
    console.log('picker日期发送选择改变，携带值为', e.detail.value)
    this.setData({
      year:e.detail.value
    })

    this.getlist()
  },




  switchTapMonth(e){ //更换月份
    let screenWidth = wx.getSystemInfoSync().windowWidth;
    let itemWidth = screenWidth/5;
    let { index,id } = e.currentTarget.dataset;
    const { nav_list } = this.data;
    let scrollX = itemWidth * index - itemWidth*2;
    let maxScrollX = (nav_list.length+1) * itemWidth;

    if(scrollX<0){
      scrollX = 0;
      
      } else if (scrollX >= maxScrollX){
      scrollX = maxScrollX;
      
      }

      var listmonth = this.data.nav_list[e.currentTarget.dataset.index].month
      var listmonth =  String(listmonth)
      console.log(listmonth)
      console.log('点击了导航栏月份',e.currentTarget.dataset),
      this.setData({
        x: scrollX,
        month_id:id,
        listmonth
        })

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

    console.log('当前时间的本月',month)
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
          month:listmonth
          
        }).get()
        
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
    
      
      var date =new Date();
      var Year = date.getFullYear();
      var nowmonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      var nowmonth = nowmonth.substring(1,2)
      var year =  String(Year)
      console.log("当前年月",year,nowmonth)
      console.log(typeof(year))
      console.log(typeof(nowmonth))
      this.setData({
        year,
        
        nowmonth
      })
      
      this.getlistFirst();
      
    if(nowmonth!=''){
      this.setData({
        
        month_id:nowmonth,
        
        })
    }
    
      
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

    this.getlist()

      
    

  
    
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