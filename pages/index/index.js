// 引入 用来发送请求的方法 一定要把路径补全
import {
	request
} from "../../request/request.js" //因为这个 request 请求使用export 导出的 所以要加 双大括号
let db = wx.cloud.database();  
let collect = db.collection("shop-master-banner");


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 轮播图数据
		swiperList: [],
		//导航栏数据
		navList: [],
		//楼层数据
		froolList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getSwiperList();
		this.getNavList();
		this.getFloorList();
	},

	// 首页轮播图数据请求
	getSwiperList() {
		let that = this;
		
		collect.get({
			success (res) {
				console.log(res); 
				let swiperList = res.data.map((item) => {
					return item.message
				})
				that.setData({
					swiperList
				})  
			},
			fail (err) {
				console.log(err);
			}
			
		}); 
		console.log(this.data.swiperList);

	/*	request({
			url: "/home/swiperdata"
		}).then((res) => {
			   console.log(res);
			this.setData({
				swiperList: res.data.message
			})
		});*/
		
	},
	//首页分类导航数据请求
	getNavList() {
		request({
			url: "/home/catitems"
		}).then((res) => {
			// console.log(res);
			this.setData({
				navList: res.data.message
			});
		});
	},
	//首页楼层数据请求
	getFloorList() {
		request({
			url: "/home/floordata"
		}).then((res) => {
			// console.log(res)
			this.setData({
				floorList: res.data.message
			});
			console.log(res)
		});
	},
	onShareAppMessage(options) {
		console.log("onShareAppMessage");
		var that = this;
		var shareObj = {
			// title: "shopMall",
			// 默认是小程序的名称(可以写slogan等)

			// path: '/pages/share/share', 
			// 默认是当前页面，必须是以‘/’开头的完整路径

			// imageUrl: 'https://7869-xiong-ra6lr-1302940207.tcb.qcloud.la/home_clone.png?sign=5d36ef0ec1a84cddee2e175f1c9632ec&t=1599290132',

			success: function (res) {
				// 转发成功之后的回调
				if (res.errMsg == 'shareAppMessage:ok') {
				  console.log("onShareAppMessage success");
				}
			},
			fail: function () {
				// 转发失败之后的回调
				if (res.errMsg == 'shareAppMessage:fail cancel') {
					console.log("onShareAppMessage cancel");
					// 用户取消转发
				} else if (res.errMsg == 'shareAppMessage:fail') {
					console.log("onShareAppMessage fail");
					// 转发失败，其中 detail message 为详细失败信息
				}
			},
			complete: function () {
				// 转发结束之后的回调（转发成不成功都会执行）
			}
		};
		// 来自页面内的按钮的转发
		if (options.from == 'button') {
			var eData = options.target.dataset;
			console.log(eData.name); // shareBtn
			// 此处可以修改 shareObj 中的内容
			shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
		}
		// 返回shareObj
		return shareObj;
	}
})