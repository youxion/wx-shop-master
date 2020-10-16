import {requestPayment} from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {request} from "../../request/request"


/*      
    1、页面加载的时候
        1、从缓存中获取购物车数据 渲染到页面
            这些数据 checked=true
        2、微信支付
            1、哪些人 哪些账号  可以实现微信支付
                1、企业账号
                2、企业账号的小程序后台中 必须 给开发者 添加上白名单
                    1、 一个 appid 可以同时绑定多个开发者
                    2、这些开发者就可以公用这个 appid 和 它的开发权限
        3、支付按钮
            1、 先判断缓存中有没有token
            2、没有 跳转到授权页面 进行获取 token
            3、有 token 那就进行 正常操作
*/

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //缓存中的收货地址
        address:[],
        //缓存中的购物车数组
        cart:[],
        //商品总数量
        total:0,
        //商品总价格
        totalPay:0
    },
    onLoad() {
        //获取缓存中的收货地址
        let address = wx.getStorageSync('address');
        // 获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart')||[];
        //过滤购物车数组，选取 checked 为true的
         let checkedCart = cart.filter((item)=>{
            return item.checked
        });
        //获取商品的总数量
        let total = 0;
        //获取商品的总价格
        let totalPay = 0
        checkedCart.forEach((item)=>{
            total += item.num;
            totalPay += item.num * item.goods_price;
        });
        this.setData({
            address,
            total,
            totalPay,
            cart:checkedCart
        });
        console.log(this.data.address)
    },

    //点击支付按钮
    async handleOrderPay() {
    //   try {
            // 获取用户的 token
        let token = wx.getStorageSync('token')
        // let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";

        //如果用户 token 不存在的情况下
        if(!token){
            //就跳转到授权页面
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return
        }

        // 若token存在，则执行以下操作：

        /* 创建订单 */ 
        // 设置请求条头
        const header = {Authorization: token}; // mark: token

        // 设置请求体参数
        const order_price = this.data.totalPay;
        const consignee_addr = this.data.address;
        const cart = this.data.cart;
        let goods = [];

        // 将购物车中已经选中的商品信息存储起来，用于创建订单
        cart.forEach(item => goods.push({
            goods_id: item.goods_id,
            goods_number: item.num,
            goods_price: item.goods_price
        }))

        // 发送创建订单的请求
        const orderParams = {order_price, consignee_addr, goods};
        const {order_number} = await request({url:"/my/orders/create", method: "POST", data:orderParams, header: header});
        console.log(order_number);

        // 利用得到的订单编号，向开发服务器请求预支付：
        const {pay} = await request({url:"/my/orders/req_unifiedorder", method: "POST", data:{order_number}, header: header});
        console.log(pay);

        
        //得到开发服务器的支付参数后，调用微信服务器后台接口进行支付
        let resPay = await requestPayment(pay)
        console.log(resPay);

        // 支付完成后，在开发服务器查看下订单状态
        const orderState = await request({url:"/my/orders/chkOrder", method: "POST", data:{order_number}, header: header});
        console.log(orderState);

        await wx.showToast({
          title: '支付成功',
        })
      /*} catch (err) {
          console.log(err);
          wx.showToast({
            title: '支付失败',
          })
      }*/
    }
})  