mui.init({
	swipeBack:true //启用右滑关闭功能
});


var login = new Vue({
	el:"#container",
	data:{
		can_sendcode:true,
		phone:"",
		smscode:"",
		agree:true,
		myheader:''
	},
	methods:{
		protocol:function(){
			app.show_webview_fire("url_view","goto_url",{url:'http://m.zhonglaiwang.com/user/protocol'});
		},
		check_phone:function(){
			console.log("ok");
			var re = /^1\d{10}$/;
			if (re.test(this.phone)) {
				return true;
			} else {
				this.phone="";
				mui.toast("请填写正确的手机号码");
				document.getElementById("phone").focus();
				return false;
			}
		},
		encrypted:function(){
			var date = new Date();
			var time = date.getTime()/1000;
			var type = 'login';
			var str = this.phone +','+type+','+time;
			var key = '66y750yw2m4qg3jv';
			var iv = '66y750yw2m4qg3jv';
			key = CryptoJS.enc.Utf8.parse(key);
			iv = CryptoJS.enc.Utf8.parse(iv);
			var encrypted = CryptoJS.AES.encrypt(str,key,{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.ZeroPadding	
			});
			return  encrypted.toString();
		},
		send_code:function(){
			if(this.can_sendcode == false)
				return;
			
			if(this.phone.length != 11){
				mui.toast("请输入正确的手机号码");
				return;
			}
			
			var num = 60;
			var _self = this;
			mui(".getIdCode")[0].setAttribute("disabled","disabled");
			var time = setInterval(function(){
				mui(".getIdCode")[0].innerText="等待"+num+"秒";
				
				num--;
				if(num<-1){
					clearInterval(time);
					mui(".getIdCode")[0].innerText="获取验证码";
					mui(".getIdCode")[0].removeAttribute("disabled");
					_self.can_sendcode = true;
				}
				else
					_self.can_sendcode = false;
			},1000);
			//发送短信
			this.smscode="";
			var _self = this;
			var w = plus.nativeUI.showWaiting();
			mui.ajax('http://app.zhonglaiwang.com/send/sms', {
				headers:{
					token: app.get_item("token")
				},
				data:{
					enctypestr: encodeURIComponent(this.encrypted()),
					uid: app.get_item("uid")
				},
				datatype: 'json',
				type: 'get',
				async: false,
				success: function(data) {
					w.close();
					mui.toast(data.desc);
					if(data.code == 500){
						clearInterval(time);
						mui(".getIdCode")[0].innerText="获取验证码";
						mui(".getIdCode")[0].removeAttribute("disabled");
						_self.can_sendcode = true;
					}
				},
				error: function(error) {
					w.close();
					console.log(error);
				}
			});
		},
		onlogin_succeeded:function(ret,data){
			app.save_item("token",data.token);
			app.save_item("uid",data.uid.toString());
			app.save_item("usertype",data.usertype.toString());
			app.save_item("phone",this.phone);
			app.save_item("username",data.username);
			app.save_item("shopid",data.shopid.toString());
			app.save_item("ifViewMyRegion",data.ifViewMyRegion.toString());
			app.save_item("ifViewApplySeller",data.ifViewApplySeller.toString());
			
			mui.fire(plus.webview.getWebviewById("mine"),"active",{});
			if(ret.data.ifyetbindphone == false){
				app.save_item("need_bind_phone","true");
				app.show_webview_fade("bind_phone");
			}
			mui.back();
		},
		weixin_auth:function(){
			var _self = this;
			if(this.agree == false){
				mui.toast("必须同意《海掌柜用户协议》");
				return;
			}
			
			if(hiauth.available())
				hiauth.auth(function(userInfo){
					console.log(JSON.stringify(userInfo));
					var w=plus.nativeUI.showWaiting("正在登录...",{back:'none',modal:true});
					app.http_post("/wx/login",{
						openid:userInfo.unionid,
						headimgurl:userInfo.headimgurl,
						nickname:userInfo.nickname
					},function(ret){
						w.close();
						mui.toast(ret.desc);
						if(ret.code == 200){
							_self.onlogin_succeeded(ret,ret.data);
						}
						hiauth.logout();
					},function(x,t,e){
						w.close();
					});
				});
			else
				mui.toast("未检测到微信登录服务");
		},
		check_login:function(){
			if(!this.check_phone()) return false;
			if(smscode.length<4)
			{
				mui.toast("请填写收到的验证码");
				return false;
			}
			return true;
		},
		do_sms_login:function(){
			if(this.agree == false){
				mui.toast("必须同意《海掌柜用户协议》");
				return;
			}
			
			var src = mui(".radioBox img")[0].src;
			var ifagree = src.substring(src.lastIndexOf("/")+1);
			var _self = this;
			if(this.check_login() && ifagree=="login_selected.png")
			{
				app.http_post("/phone/login",{
					phone:this.phone,
					smscode:this.smscode
				},function(ret){
					mui.toast(ret.desc);
					if(ret.code == 200)
						_self.onlogin_succeeded(ret,ret.data);
				},function(x,t,e){
					console.log(e);
				});
			}else
			{
				mui.toast("必须同意并勾选用户协议");	
			}
		},
		change_status:function(event){
			this.agree = !this.agree;
		}
	},
	computed:{
		agree_img:function(){
			return this.agree?"../../images/login_selected.png":"../../images/login_empty.png";
		}
		,
		header:function(){
			
			return this.myheader == ''?"../../images/logo_circle.png":this.myheader;
		}
	}
	
});

mui.ready(function(){
	
//	document.getElementById("body").style.height = 
//	document.getElementById("body").clientHeight;
	window.addEventListener('loadinfo',function(){
		if(window.plus){
			login.myheader = app.get_item("header") || '';
		}
	});
	mui.back = function(event)
	{
		app.update_opener();
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
	
	var bottom_img = document.getElementById("bottom_img");
	bottom_img.style.top = (window.innerHeight) - 60 +"px";
	//console.log(bottom_img.style.top);
});



mui.plusReady(function(){
	login.phone =  app.get_item("phone") || "";
	hiauth.updateservice();
});
