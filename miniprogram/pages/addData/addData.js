var app= getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "rentorname":"",
    "room_id":"",
    "old_water":"",
    "new_water":"",
    "waterprice":"",
    "allwaterprice":"",
    "old_electricity":"",
    "new_electricity":"",
    "electprice":"",
    "allelectprice":"",
    "room_money":"",
    "all_money":"",
    "date":"",
    electlist:[],
    waterlist:[],
    rentorlist:[],
    index:'',
    id:"",
    year:"",
    month:"",
    lastyear:"",
    lastmonth:"",
    lastlist:[],
    totalnum:"",
    months:"",
    payment:"false",
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
      other_expense_sum:0,
      inpclass:0
  },
  
  
  async getlist(){
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

  //获取记录数
  gettotal:function(){
    
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    var year = this.data.year
    var lastyear = this.data.lastyear
    var lastmonth =  this.data.lastmonth
    console.log('上年',lastyear)
    console.log('上月',lastmonth)
    if(lastmonth!=12){
  
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year,
        month:lastmonth
        
      })
      .count()
      .then(res=>{
        console.log('上月记录数',res.total)
        this.setData({
          totalnum:res.total
          
        })
      })
    }else if(lastmonth==12){
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year:lastyear,
        month:lastmonth
        
      })
      .count()
      .then(res=>{
        console.log('上月记录数',res.total)
        this.setData({
          totalnum:res.total
          
        })
      })
    }
  
    let atotalnum = this.data.totalnum
    console.log(app.globalData.openid),
    console.log('实际',atotalnum)
    
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
    this.setData({
      rentorname:this.data.rentorlist[index].rentorname,
      room_id:this.data.rentorlist[index].room_id,
      
    })

    this.getlastwater();
  },

 //日期选择
  bindDateChange: function(e) {
    console.log('picker日期发送选择改变，携带值为', e.detail.value)
    var year = e.detail.value.substring(0,4)
    
    var month = e.detail.value.substring(5,7)//10 11 12
    var months = e.detail.value.substring(6,7)//单位数
    console.log('chuwai',months)
    var lastyear =   String(year-1)
    var lastmonth =  String(month-1)
    console.log(month)
    console.log('上ge年',lastyear)
    console.log('上ge月',lastmonth)
    //本月为1月，上月为12月
    if(lastmonth==0){
      this.setData({
        date: e.detail.value,
        year,
        month:'1',
        lastmonth:'12',
        lastyear
      })
    }else if(lastmonth==11||lastmonth==10||lastmonth==9){
       //本月为12/11/10月
      this.setData({
        date: e.detail.value,
        year,
        month,
        lastmonth,
        
      })
    }
    else {
      var month  = e.detail.value.substring(6,7)//单位数
      console.log('qita',month)
      this.setData({
      date: e.detail.value,
      year,
      lastmonth,
      month

      })
    }
    console.log('当前月份',month)
    console.log(lastmonth)

    this.getlastwater();
  },
  
 //获取当前租客上月水电费
  getlastwater:function(){
    let rentorname = this.data.rentorname
    let room_id = this.data.room_id
    var year = this.data.year
    var lastyear = this.data.lastyear
    var lastmonth =  this.data.lastmonth
    
    console.log('上年',lastyear)
    console.log('上月',lastmonth)
    //2 3 4 5 6 7 8 9 10 11 12
    if(lastmonth!=12){

      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year,
        month:lastmonth
        
      })
      .get()
      .then(res=>{
        console.log('上月水费记录',res)
        this.setData({
          lastlist:res.data
          
        })
      })
    }else if(lastmonth==12){
      //本月是1月 上月为12月
      db.collection("demolist").where({
        _openid:app.globalData.openid,
        rentorname,
        room_id,
        year:lastyear,
        month:lastmonth
        
      })
      .get()
      .then(res=>{
        console.log('上月水费记录',res)
        this.setData({
          lastlist:res.data
          
        })
      })
    }
    
    
     
  },


  
  rentornameinput:function(e){
    this.setData({
      rentorname:e.detail.value
      
    });
  },
  room_idinput:function(e){
    this.setData({
      room_id:e.detail.value
    });
  },
  old_waterinput:function(e){
   
    this.setData({
      old_water:e.detail.value
    });
  },
  new_waterinput:function(e){
    this.setData({
      new_water:e.detail.value
    });
  },
  waterpriceinput:function(e){
    
    this.setData({
      waterprice:e.detail.value
    });
    
    
  },
  old_electricityinput:function(e){
    this.setData({
      old_electricity:e.detail.value
    });
  },
  new_electricityinput:function(e){
    this.setData({
      new_electricity:e.detail.value
    });
  },
  electpriceinput:function(e){
    this.setData({
      electprice:e.detail.value
    });
  },
  room_moneyinput:function(e){
    this.setData({
      room_money:e.detail.value,
      
    });
  },
  all_moneyinput:function(e){
    this.setData({
      all_money:e.detail.value
    });
  },
  yearinput:function(e){
    
    this.setData({
      year:e.detail.value
    });
  },
  monthinput:function(e){

    this.setData({
      month:e.detail.value
    });
  },

  inp_focus:function (e) {
    let exitem = this.data.exitem
    let ExpenceChangeindex = this.data.ExpenceChangeindex
    let Expense_item = this.data.Expense_item
    console.log('当前点击的',e.currentTarget.dataset.id);
    console.log('数组里的顺序',exitem[e.currentTarget.dataset.id].exid);//
    console.log('index',ExpenceChangeindex);
    this.setData({
      inpclass:e.currentTarget.dataset.id
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

  //计算
  jisuan:function(){

    this.gettotal() 
    var totalnum = this.data.totalnum 
    console.log('获取到的tatalnum',totalnum) 
    var lastlistlength = this.data.lastlist.length 
    console.log('上月记录的长度',lastlistlength) 
    
    //上月无记录
    if(lastlistlength==0){ 
     console.log('上月无记录') 
     
     if(this.data.old_electricity>this.data.new_electricity && this.data.new_electricity>=10000){
     //当上月电费>本月电费 且 本月电费>=10000时
     var new_electricity = parseInt(this.data.new_electricity)
      var allep=[(10000-this.data.old_electricity)+(new_electricity-10000)]*this.data.electlist[0].electprice;
      
      console.log('用电量1',allep)

     }

     if(this.data.old_electricity>this.data.new_electricity && this.data.new_electricity<10000){
       //当上月电费>本月电费时 且本月电费<10000时
      var new_electricity = parseInt(this.data.new_electricity)
      var allep=[(10000-this.data.old_electricity)+new_electricity]*this.data.electlist[0].electprice;
      console.log('用电量2',allep)

     }
     
     if(this.data.old_electricity<=this.data.new_electricity){
      var allep=(this.data.new_electricity-this.data.old_electricity)*this.data.electlist[0].electprice; 
     }
     var allwp=(this.data.new_water-this.data.old_water)*this.data.waterlist[0].waterprice; 
      
 
    }else if(lastlistlength==1){ //上月有记录
      
       console.log('上月电费的类型',typeof(this.data.lastlist[0].new_electricity))
       console.log('本月电费的类型',typeof(this.data.new_electricity))
       var lastlist_new_electricity = parseInt(this.data.lastlist[0].new_electricity)
       var new_electricity = parseInt(this.data.new_electricity)
      if(lastlist_new_electricity>new_electricity && lastlist_new_electricity<10000){
        //当上月电费>本月电费 且 上月电费<10000时
        
        var allep=[(10000-lastlist_new_electricity)+new_electricity]*this.data.electlist[0].electprice;
        console.log('用电量3',allep)
        }

      if(lastlist_new_electricity>new_electricity && lastlist_new_electricity>=10000){
          //当上月电费>本月电费 且 上月电费>=10000时
          
          var allep=[new_electricity-(lastlist_new_electricity-10000)]*this.data.electlist[0].electprice;
          console.log('用电量4',allep)
        }

      if(lastlist_new_electricity <= new_electricity){
        //当上月电费<=本月电费时(正常情况)
        var new_electricity = parseInt(this.data.new_electricity)
        var allep=(new_electricity-lastlist_new_electricity)*this.data.electlist[0].electprice;
        console.log('用电量5',allep)
        }
    var allwp=(this.data.new_water-this.data.lastlist[0].new_water)*this.data.waterlist[0].waterprice; 
     
  }  
    console.log('固定水',this.data.waterlist[0].waterprice)
    console.log('计算后的水费',allwp)
    this.data.room_money=parseInt(this.data.room_money);
    console.log(typeof(this.data.room_money))
    console.log(typeof(allwp))
    
    
    let  management_Fee = this.data.management_Fee
    console.log('管理费', management_Fee);
    let network_Fee = this.data.network_Fee
    console.log('网络费', network_Fee);
    let  cleaning_Fee = this.data.cleaning_Fee
    console.log('清洁费', cleaning_Fee);
    let  gas_Fee = this.data.gas_Fee
    console.log('天然气费', gas_Fee);
    let other_expense_sum = this.data.other_expense_sum
    other_expense_sum =  Number(management_Fee)  + Number(network_Fee)  + Number(cleaning_Fee)  + Number(gas_Fee) 
    console.log(other_expense_sum);
    let allmon=allwp+allep+this.data.room_money+other_expense_sum;
    console.log(allmon)

    this.setData({
      allwaterprice:allwp,
      allelectprice:allep,
      all_money:allmon,
      management_Fee,
      network_Fee,
      cleaning_Fee,
      gas_Fee,
      other_expense_sum
    })
 },

 
  //提交表单
  btnsub(res){

    var lastlistlength = this.data.lastlist.length
    this.gettotal();
    
    console.log(lastlistlength)
    this.jisuan();
    
   
    if(lastlistlength==0){

      var old_water=this.data.old_water;
      var old_electricity=this.data.old_electricity;
      
    }else if(lastlistlength==1){
      var old_water=this.data.lastlist[0].new_water;
      var old_electricity=this.data.lastlist[0].new_electricity;
    }
    
    let rentorname=this.data.rentorname;
    let room_id=this.data.room_id;
   
    let new_water=this.data.new_water;
    let waterprice=this.data.waterlist[0].waterprice;
    let allwaterprice=this.data.allwaterprice;
    
    let new_electricity=this.data.new_electricity;
    let electprice=this.data.electlist[0].electprice;
    let allelectprice=this.data.allelectprice;
    let room_money=this.data.room_money;
    let all_money=this.data.all_money;
    let date=this.data.date;
    let year=this.data.year;
    let month=this.data.month;
    let payment=this.data.payment;
    let  management_Fee = this.data.management_Fee
    let network_Fee = this.data.network_Fee
    let  cleaning_Fee = this.data.cleaning_Fee
    let  gas_Fee = this.data.gas_Fee
    let other_expense_sum = this.data.other_expense_sum

     db.collection("demolist").add({
       data:{
        rentorname,
        room_id,
        old_water,
        new_water,
        waterprice,
        allwaterprice,
        old_electricity,
        new_electricity,
        electprice,
        allelectprice,
        room_money,
        all_money,
        date,
        year,
        month,
        payment,
        createTime:db.serverDate(),
        management_Fee,
        network_Fee,
        cleaning_Fee,
        gas_Fee,
        other_expense_sum
       }
     }).then(res=>{
       console.log(res)
       wx.showToast({
        title: '添加账单成功'
      })
       wx.switchTab({
         url: '../index/index',
       })
       
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
    //查询设置的水费
    db.collection("waterprice").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      console.log('水费单价',res)
      this.setData({
        waterlist:res.data
        
      })
    })
   //查询设置的电费
    db.collection("electprice").where({
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      console.log('电费单价',res)
      this.setData({
        electlist:res.data
        
      })
    })

    //查询已记录的租客
    this.getlist()


    
    
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