// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      page: 'pages/index/index', //要跳转到那个小程序页面
      data: {//推送的内容
        time1: {
          value: '2022年5月'
        },
        phrase2: {
          value: '房租'
        },
        amount3: {
          value: '666'
        },
        name4: {
          value: '曾'
        },
        thing8: {
          value: '微信'
        }
      },
      templateId: '9zkKYn1Cdh1HqTy-hwh5qj2q6P3aG9g1ZSsPB-KxtTI' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
    
}