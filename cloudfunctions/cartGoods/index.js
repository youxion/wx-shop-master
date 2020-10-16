// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  let cartGoods = '';

  // let cRemove = db.collection('list').remove();
  // let cRemove = db.collection('list').where({"checked": true}).remove();
  // let cGet = db.collection('list').where({"checked": true}).get();

  // count,查询符合记录的数量
  // let cGet = await db.collection('list').where({"checked": true}).count();

  // 将"age字段"的值自增10
  let cGet = await db.collection('list').doc("2c9645925f756ffe0004d3e573f99ba4").update({
    data: {
      age: _.inc(10)
    }
  })

   // 若传入的2小于"a字段"的值,则"a字段"更新为2
  let min = await db.collection('list').doc("2c9645925f756ffe0004d3e573f99ba4").update({
    data: {
      a: _.min(2)
    }
  })

   // 若传入的10大于"c字段"的值,则"c字段"更新为10
  let max = await db.collection('list').doc("2c9645925f756ffe0004d3e573f99ba4").update({
    data: {
      c: _.max(10)
    }
  })

  let exists = await db.collection('list').where({
    tags: _.exists(true)
  }).get({
     success: function (res) {
      return res
    },
    fail: function (err) {
      return err
    }
  })


  let good = await cloud.database().collection("shop-master-banner").get({
    success: function (res) {
      return res
    },
    fail: function (err) {
      return err
    }
  })

  let r = await db.collection("dynamic_collection").where({ "openid": openid }).get({
    success(res) {
      if (!res.data.length) {
        // cartGoods = await db.createCollection(openid)

        new Promise ((resolve, reject) => {
          cartGoods = db.createCollection(openid)
          resolve(cartGoods);
        }).then(res => {
          //若当前用户存储表创建成功，就将创建成功的表名存储起来，便于后期查看管理
          if (res.cartGoods.errMsg === "createCollection:ok") {
            db.collection("dynamic_collection").add({
              data: {
                openid
              }
            })
          }
        })

        
      }else {
        db.collection(openid).add({
          data: {
            name: "wang"
          }
        })

      }
      return res
    },
    fail(err) {
      return err
    }
  })
  // console.log(r)

  /*db.collection("user").where(opentid).add({
    data: "hello 250 ",
    success (res) {
      return res
    },
    fail (err) {
      return err
    }
  })*/

  /*db.collection("shop-master-banner").add({
    data: {
      wwwwwwwwwwwwwwwwwwwwww: "gggggggggggggggggg"
    },
    success (res) {
      return res
    },
    fail: function (err) {
      // cartGoods = await db.createCollection(opentid)
      return err
    }
  })*/

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    cartGoods,
    good,
    cGet,
    r,
    exists
  }
}