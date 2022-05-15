// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
 
  const sendmsg = await cloud.openapi.subscribeMessage.send({
    touser: event._openid,  // 要推送的用户openid
    templateId: event.templateId, // 模板ID
    
    data: event.subMsg, //模板数据填充部分
    miniprogramState: 'developer' 
  });
  return sendmsg; // 返回执行结果
}