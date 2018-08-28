mui.init();

var container = new Vue({
	el:'#container',
	data:{
		uid:'',
		username:'',
		header:'',
		addresscount:0,
		ifmodiusername:true,
		ifbindwx:false,
		phone:'',
		iffreepass:false,
		bankcount:0,
		verifystatus:3
	},methods:{
		load_info:function(){
			app.http_get("/my/detail",function(ret){
				if(ret.code == 200)
				{
					container.uid = ret.data.uid;
					container.username = ret.data.username;
					container.header = ret.data.header;
					container.addresscount = ret.data.addresscount;
					container.ifmodiusername = ret.data.ifmodiusername;
					container.ifbindwx = ret.data.ifbindwx;
					container.phone = ret.data.phone;
					container.iffreepass = ret.data.iffreepass;
					container.bankcount = ret.data.bankcount;
					container.verifystatus = ret.data.verifystatus;
				}
			},function(x,t,e){});
		},
		edit_avatar:function(){
			var _self = this;
			image_uploader.upload("verify",function(ret){
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.header = ret.data.thumb;
					app.http_post('/my/header',{header: ret.url},
				    function(ret){mui.toast(ret.desc);},
				    function(x,r,e){});
				}
				
			});
		},
		//修改手机
		goto_editTel:function(){
			app.show_webview_fire("editTel","loadinfo",{});
		},
		//添加银行卡
		goto_addBank:function(){
			app.show_webview_fire("bankList","loadinfo",{});
		},
		notAuth:function(){
			mui.toast("请先完成实名认证");
		},
		//实名认证
		goto_realAuth:function(){
			app.show_webview_fire("realAuth","loadinfo",{});
		},
		//支付密码
		goto_payPassword:function(){
			app.show_webview_fire("payPassword","loadinfo",{});
		},
		//小额免付
		goto_noPay:function(){
			app.show_webview_fire("noPay","loadinfo",{});
		},
		//修改用户名
		goto_editUsername:function(){
			app.show_webview_fire("editUsername","loadinfo",{});
		},
		//修改地址
		goto_userLocation:function(){
			app.show_webview_fire("userLocation","loadinfo",{});
		},
		bind_weixin:function(){
			var _self = this;
			if(this.ifbindwx == false){
				if(hiauth.available())
					hiauth.auth(function(userInfo){
						var w=plus.nativeUI.showWaiting("正在登录...",{back:'none',modal:true});
						app.http_post("/bind/wx",{
							openid:userInfo.unionid,
						},function(ret){
							w.close();
							if(ret.code == 200)
								_self.load_info();
							else
								mui.toast(ret.desc);
							hiauth.logout();
						},function(x,t,e){
							w.close();
						});
					});
				else
					mui.toast("未检测到微信登录服务");
			}
			
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_info();
	});
	mui.back = function(event)
	{
	   app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
})

mui.plusReady(function(){
	hiauth.updateservice();
});