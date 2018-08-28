mui.init();


var container = new Vue({
	el:"#container",
	data:{
		shopname:'',
		addr:'',
		buytoken:'',
		allmoney:'',
		exceptmoney:0,
		paydata:{},
		freepass:false,
		paytoken:''
	},
	methods:{
		load_info:function(code){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在获取商家信息...");
			app.http_get("/user/scan/seller?receivecode="+code,function(ret){
				w.close();
				if(ret.code == 200)
				{
					_self.shopname = ret.data.shopname;
					_self.addr = ret.data.addr;
					_self.buytoken = ret.data.buytoken;
				}
				else{
					mui.toast(ret.desc);
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
		},
		pre_pay:function()
		{
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在获取支付信息...");
			app.http_post('/offline/buy/submit',{
				allmoney:_self.allmoney,
				buytoken:_self.buytoken,
				exceptmoney:_self.exceptmoney
			},function(ret){
				w.close();
				if(ret.code == 200){
					_self.freepass = ret.data.freepass;
					_self.paytoken = ret.data.paytoken;
					_self.$refs.paypad.set_info(ret.data);
					_self.$refs.paypad.show(ret.data.wxpay,hipay.wxpay);
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
				}
				else
				{
					mui.toast(ret.desc);
				}
			},function(x,t,e){
				w.close();
			});
		},
		do_action:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在支付...",{back:'none'});
			app.http_post('/user/offline/pay',
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					//app.update_opener();
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
			
		}
	}
});

mui.plusReady(function(){
	hipay.updateservice();
});
mui.ready(function(){
	window.addEventListener("init",function(e){
		var code = e.detail.code;
		container.load_info(code);
	});
});
