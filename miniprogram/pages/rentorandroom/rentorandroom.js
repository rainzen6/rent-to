var app = getApp()
const db= wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    management_Fee:0,
    network_Fee:0,
    cleaning_Fee:0,
    gas_Fee:0,
    Expense_item:[ 
      {
        exid:0,
        Cname:'管理费',
        name:'management_Fee'
  
      },{
        exid:1,
        Cname:'网络费',
        name:'network_Fee'
  
      },{
        exid:2,
        Cname:'清洁费',
        name:'cleaning_Fee'
  
      },{
        exid:3,
        Cname:'天然气费',
        name:'gas_Fee'
  
      }],
      exitem:[],
      sum:0,
      inpclass:0
    
  },

  inp_focus:function (e) {
    let exitem = this.data.exitem
    let ExpenceChangeindex = this.data.ExpenceChangeindex
    let Expense_item = this.data.Expense_item
    console.log('当前点击的',e.currentTarget.dataset.id);
    console.log('数组里的顺序',exitem[e.currentTarget.dataset.id].exid);//
    console.log('index',ExpenceChangeindex);
    this.setData({
      inpclass:exitem[e.currentTarget.dataset.id].exid
   })
  },

  inp_blur:function name(e) {
    this.setData({
      inpclass: e.currentTarget.dataset.id
   })
  },

  //选择费用
  bindExpenceChange:function (e) {
    let Expense_item = this.data.Expense_item
    let ExpenceChangeindex = e.detail.value
    
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ExpenceChangeindex: e.detail.value
    })
    console.log(Expense_item[ExpenceChangeindex].Cname);
    console.log(Expense_item[ExpenceChangeindex].name);
    console.log('Expense_item中的',ExpenceChangeindex);

    this.addinput();

  },


  addinput:function (e) {
    let Expense_item = this.data.Expense_item
    let ExpenceChangeindex = this.data.ExpenceChangeindex
    let exitem = this.data.exitem
    
    console.log('addinput值',Expense_item[ExpenceChangeindex].name);
    
    let fee_message = {
      exid:ExpenceChangeindex,
      name:Expense_item[ExpenceChangeindex].name
    }
    exitem.push(fee_message)
    
    this.setData({
      exitem
    })
    console.log(exitem);

  },

  deleteInput:function (e) {
    let nowid = e.currentTarget.dataset.id
    console.log('删除处于加入数组的位置',nowid);
    let exitem=this.data.exitem;//循环内容
    console.log('选择删除的费用',exitem[nowid].name);
    let delete_Fee = this.data.exitem[nowid].name
    let gas_Fee = this.data.gas_Fee
    let network_Fee = this.data.network_Fee
    let cleaning_Fee = this.data.cleaning_Fee
    let management_Fee = this.data.management_Fee
    if (delete_Fee == 'gas_Fee') {
      console.log('该值为gas');
      gas_Fee = 0
      this.setData({
        gas_Fee:0
      })
    }else if (delete_Fee == 'network_Fee') {
      console.log('该值为network_Fee');
      network_Fee = 0
      this.setData({
        network_Fee:0
      })
    }else if (delete_Fee == 'cleaning_Fee') {
      console.log('该值为cleaning_Fee');
      cleaning_Fee = 0
      this.setData({
        cleaning_Fee:0
      })
    }else if (delete_Fee == 'management_Fee') {
      console.log('该值为management_Fee');
      management_Fee = 0
      this.setData({
        management_Fee:0
      })
    }

    console.log(delete_Fee);
    console.log(this.data.exitem[nowid].name);
    exitem.splice(nowid,1); 
    
    this.setData({
      exitem
      
  })
  console.log('删除后的exitem',exitem);
  },

  management_Fee_input:function (e) {
    this.setData({
      management_Fee:e.detail.value
    });
  },

  network_Fee_input:function (e) {
    this.setData({
      network_Fee:e.detail.value
    });
  },

  cleaning_Fee_input:function (e) {
    this.setData({
      cleaning_Fee:e.detail.value
    });
  },

  gas_Fee_input:function (e) {
    this.setData({
      gas_Fee:e.detail.value
    });
  },

  jisuan:function () {
    let  management_Fee = this.data.management_Fee
    console.log('管理费', management_Fee);
    let network_Fee = this.data.network_Fee
    console.log('网络费', network_Fee);
    let  cleaning_Fee = this.data.cleaning_Fee
    console.log('清洁费', cleaning_Fee);
    let  gas_Fee = this.data.gas_Fee
    console.log('天然气费', gas_Fee);
    let sum = this.data.sum
    sum =  Number(management_Fee)  + Number(network_Fee)  + Number(cleaning_Fee)  + Number(gas_Fee) 
    console.log(sum);
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
