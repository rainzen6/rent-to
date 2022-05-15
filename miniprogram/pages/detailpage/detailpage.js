const db= wx.cloud.database()
Page({

  data:{
    item:{}
  },
  onLoad(options){
    console.log('列表携带的值为:',options)
    var id=options.id
    db.collection('demolist')
    .doc(id)
    .get().then(res=>{
      console.log('详情页请求成功',res)
      
      this.setData({
        item:res.data,
        id
      })
    })
    .catch(res=>{
      console.log('详情页请求失败',res)
     
    })
  },


  onShareAppMessage(){
    var id = this.data.id
    console.log(id)
    return{
      title:'账单详情',
      path:'../detailpage/detailpage='+id
    }
  }
})