mui.init();

var container = new Vue({
	el: '#container',
	data: {
		servicetypes: [
			[],
			[{
				text: '到店消费',
				id: 1
			}, {
				text: '送货上门',
				id: 2
			}],
			[{
				text: '到店消费',
				id: 1
			}, {
				text: '服务到家',
				id: 2
			}],
			[{
				text: '到店消费',
				id: 1
			}]
		],
		supported_servicetype: 1,
		servicetype: 1,
		amount: 1,
		has_payed:true,
		all_money: 0,
		reduce: 0,
		real_all_money: 0,
		goodsinfo: {
			gname: "",
			sourceprice: 0,
			discountprice: 0,
			logo: "",
			id: 0,
			ifanytimeback: false,
			ifexpireback: false,
			ifgohome: true,
			ifactivityminus: false,
			activityminus: 0,
			singlemax: 2,
			unit: "个",
			ifaddmoney: false,
			addmoneydesc: "",
			viewservicetype: 1,
			ifviewaddressbut: false,
			address: {}
		}
	},
	methods: {
		select_service_type: function() {

			var pop = document.getElementById("popover_servicetype");
			pop.style.top = window.innerHeight / 2 + "px";

			mui('#popover_servicetype').popover('show');
		},
		set_service_type: function(typeid) {
			this.servicetype = typeid;
			mui('#popover_servicetype').popover('hide');
		},
		update_amount: function() {
			var _self = this;
			setTimeout(function(){
				
				_self.amount = mui(".mui-numbox").numbox().getValue();
			},100);
			
		},
		pre_pay: function() {
			var _self = this;
			if((this.servicetype == 2) && (typeof this.goodsinfo.address.id) == 'undefined') {
				mui.toast('请选择收获地址');
				return;
			}
			var w = plus.nativeUI.showWaiting("正在获取订单信息...");
			app.http_post('/user/online/pay/preview', {
				goodsid: this.goodsinfo.id,
				buycount: this.amount,
				servicetype: _self.servicetype,
				addressid: (_self.servicetype == 2) ? this.goodsinfo.address.id : 0
			}, function(ret) {
				w.close();
				if(ret.code == 200) {
					_self.paytoken = ret.data.paytoken;
					container.has_payed = false;
					_self.$refs.paypad.set_info(ret.data);
					_self.$refs.paypad.show(ret.data.wxpay,hipay.wxpay,'/user/online/order/wx/complete?id='+ret.data.orderid); 
				}else if(ret.code == 210){
					if(JSON.stringify(hipay.wxpay) == "{}"){
						mui.toast("检测到您没有安装微信,请先安装");return;
					}
					plus.payment.request(hipay.wxpay, ret.data, function(res) {
						if(res){
							mui.toast('支付成功');
							mui.back();
						}else{
							mui.toast('微信支付异常，请联系客服')
						}
					}, function(e) {
						if(e.code == -100){
							mui.toast('您取消了微信支付')
						}else{
							mui.toast('微信支付异常，请联系客服')
						}
					});
				}else {
					mui.toast(ret.desc);
				}
			}, function(x, t, e) {
				w.close();
			});
		},
		ensure_pay: function(_passwd) {
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在提交订单...", {
				back: 'none'
			});
			app.http_post('/user/online/pay', {
				paytoken: this.paytoken,
				paypass: _passwd
			}, function(ret) {
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200) {
					_self.$refs.paypad.hide();
					container.has_payed = true;
					mui.back();
				}else if(ret.code == 210){
					app.show_webview_fire('recharge','active',{});
				}else{
					
				}
			}, function(x, t, e) {
				w.close();
			});
		},
		hide_pad:function(){
			
		},
		goto_selectlocation: function() {
			app.show_webview_fire('selectedLocation', 'loadinfo', {})
		},goto_addLocation: function() {
			
			app.show_webview_fire('addLocation', 'loadinfo', {})
		}
	}
});

mui.plusReady(function(){
	hipay.updateservice();
});
mui.ready(function() {
	window.addEventListener('loadinfo', function(event) {
		container.amount = 1;
		mui(".mui-numbox").numbox().setValue(1);
		var goodsid = event.detail.goodsid;
		app.http_get("/order/submit/view?goodsid=" + goodsid,
			function(ret) {
				if(ret.code == 200) {
					container.goodsinfo = ret.data;
					mui(".mui-numbox").numbox().setOption('max',container.goodsinfo.singlemax);
					container.supported_servicetype = ret.data.viewservicetype;
				}
			},
			function(e, x, h) {
				console.log(x);
			});

	});
	window.addEventListener('location_selected', function(event) {

		var temp = container.goodsinfo;
		container.goodsinfo = [];
		temp.address.id = event.detail.address.id;
		temp.address.name = event.detail.address.name;
		temp.address.phone = event.detail.address.phone;
		temp.address.detail = event.detail.address.address;

		container.goodsinfo = temp;
		console.log(container.goodsinfo);
	});
	mui.back = function(event) {
		container.servicetype = 1;
		
		container.$refs.paypad.hide();
		mui('#popover_servicetype').popover('hide');
		
		if(container.has_payed == false)
			plus.nativeUI.alert("请您尽快完成支付，十分钟后订单将自动取消");
			
		container.has_payed = true;
		plus.webview.hide(plus.webview.currentWebview(), 'slide-out-right');
	};
});

mui.plusReady(function() {
	//mui.preload({url:'../selectedLocation.html',id:'selectedLocation'});
});