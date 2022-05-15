// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:"rainzen-0guoo4h875e453ce"
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    return await cloud.database().collection("rentor")
   .where(
     {
       _openid:oekXa5FDBx48y-GAeJI-VFkgnNY4
     }
   )
   .get({
     success: function (res) {
       this.setData({
         waterprice
       })
       
     }
   })
 } catch (e) {
   console.error(e);
 }
 return{
   event,
   openid: wxContext.OPENID,
   waterprice
 }


  
}