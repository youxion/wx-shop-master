// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      {name: "www", id: 0, showTrue: true},
      {name: "44444", id: 1, showTrue: false},
      {name: "www", id: 2, showTrue: false},
      {name: "44444", id: 3, showTrue: false},
      {name: "www", id: 4, showTrue: false},
      {name: "44444", id: 5, showTrue: false},
      {name: "www", id: 6, showTrue: false},
      {name: "44444", id: 7, showTrue: false},
      {name: "www", id: 8, showTrue: false},
      {name: "44444", id: 9, showTrue: false},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
      {name: "www"},
      {name: "44444"},
    ],
    arr2: [
      "wang",
      "wang33",
      "wangfaf",
      "wangfrrf",
      "wangdddd",
      "wang444556",
      "wang5326457"
    ]

  },

// 对整个集合、整条记录、单个字段的增删改查

/*1.集合：增删改查*/ 

  









  navClicked (e) {
    console.log(e);
    let index = e.target.dataset.you;
    let arr = this.data.arr;  
    // let clicked = arr.some( item => {
    //   return item.id == index
    // })  
    arr.forEach( item => {
      if (item.id == index) {
        item.showTrue = true;
      }else {
        item.showTrue = false;
      }
    })  
     console.log(arr);
     this.setData({
       arr
     })
    // if(clicked) {
    //   this.setData({
    //     showTrue: clicked
    //   }) 
    // }
  },

  /* 选择地址 */
  chooseAddress () {
    wx.getSetting({
      success: (res) => {
        console.log(res);
        let a = res.authSetting['scope.address']
        // console.log(a);

        // 选择地址时： 1.选择了"确定"； 2.没调用过 wx.chooseAddress
        if (a===true || a===undefined ) { 
          wx.chooseAddress({
            success: (res) => {
              console.log(res, "chooseAddress ok");
            },
            fail (err) {
              console.log(err, "chooseAddress fail");
            }
          })
        }else { // 选择地址时： 1.选择了"取消"，重新打开接口，再选一次
          wx.openSetting({
            success: (res) => {
              wx.chooseAddress({
                success: (res) => {
                  console.log(res, "chooseAddress ok 2");
                },
                fail (err) {
                  console.log(err, "chooseAddress fail 2");
                }
              })
            },
            fail (err) {
              console.log(err, "chooseAddress fail, openSetting");
            }
          })
        }

        


        // if (!a) {
        //   wx.openSetting({
        //     success: (res) => {
        //       console.log(res, "openSetting");
        //     }
        //   })
        // }
      
      },
      fail (err) {
        console.log(err, "fail");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    let {arr} = this.data;
    wx.cloud.callFunction({
      name: "cartGoods",
      success (res) {
        console.log(res)
      },
      fail (err) {
        console.log(err)
      }
    })
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