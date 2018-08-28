mui.init();

var container = new Vue({
	el:"#container",
	data:{
		username:'',
		phone:'',
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
			var w = plus.nativeUI.showWaiting("正在获取用户信息...");
			app.http_get("/seller/scan/user?paycode="+code,function(ret){
				w.close();
				if(ret.code == 200)
				{
					_self.username = ret.data.username;
					_self.phone = ret.data.phone;
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
			var w = plus.nativeUI.showWaiting("正在获取收款信息...");
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
					_self.$refs.paypad.show();
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
			var w = plus.nativeUI.showWaiting("正在收款...",{back:'none'});
			app.http_post('/seller/offline/pay',
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					app.update_opener();
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
			
		}
	}
});

mui.ready(function(){
	window.addEventListener("init",function(e){
		var code = e.detail.code;
		container.load_info(code);
	});
});
