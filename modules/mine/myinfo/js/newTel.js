mui.init();
var phonetoken = null;
window.addEventListener('newTel',function(event){
    //获得事件参数
    phonetoken = event.detail.phonetoken;
});
var tel = "";

//第二步
var step = 2;
var newTel = new Vue({
	el:"#container",
	data: {
        title:"获取验证码",
		timer:0,
		num :60,	
	},
	methods: {
		getIdCode: function (){
			//短信加密
			tel = mui(".phone")[0].value;
			if(tel.length<11){
				mui.toast('请输入正确的手机号');
				return
			}
			if(tel.length<=0){
				mui.toast('请输入手机号');
				return
			}
        	var _self = this;
            if(_self.title == "获取验证码"){
			_self.title = "等待"+_self.num+"秒";
    		_self.num = 60; 
            _self.timer = setInterval(function(){
				_self.title = "等待"+_self.num+"秒";
				_self.num--;
				if(_self.num<1){
					clearInterval(_self.timer);
					_self.title="获取验证码";
				}
			},1000);
            //发送短信
			CryptoJS.AES.encrypt("Message", "Secret Passphrase");
			var date = new Date();
			var time = date.getTime()/1000;
			var type = 'modiphonetwo';
			var str = tel+','+type+','+time;
			var key = '66y750yw2m4qg3jv';
			var iv = '66y750yw2m4qg3jv';
			key = CryptoJS.enc.Utf8.parse(key);
			iv = CryptoJS.enc.Utf8.parse(iv);
			var encrypted = CryptoJS.AES.encrypt(str,key,{
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.ZeroPadding	
			});
			encrypted = encrypted.toString();
			var w=plus.nativeUI.showWaiting("",{back:'none',modal:true});
			//发送短信
			mui.ajax('http://app.zhonglaiwang.com/send/sms?&uid=0', {
				headers:{
					token: app.get_item("token")
				},
				data:{
					enctypestr: encodeURIComponent(encrypted),
					uid: app.get_item("uid")
				},
				datatype: 'json',
				type: 'get',
				async: false,
				success: function(data) {
					w.close();
					mui.toast(data.desc);
				},
				error: function(error) {
					w.close();
					console.log(error);
				}
			});
            }else{
            	return;
            }  
		},
		goto_usersafe:function(toValue){
			var phone = mui(".phone")[0].value;
			var smscode = mui(".smscode")[0].value;
			var w=plus.nativeUI.showWaiting("",{back:'none',modal:true});
			mui.ajax('http://app.zhonglaiwang.com/my/phone/update',{
				headers: {
					token: app.get_item("token")
				},
				data: {
					uid: app.get_item("uid"),
					step: step,
					smscode: smscode,
					phone: phone,
					phonetoken: phonetoken
				},
				datatype: 'json',
				type: 'post',
				success: function(data) {
					w.close();
					mui.toast(data.desc);
					if(data.code == 200){
						mui.fire(plus.webview.getWebviewById("editTel"),"back",{});
						mui.back();
					}
					
				},
				error: function(error) {
					w.close();
					console.log(JSON.stringify(error));
				}
			});
		}
	}
});



mui.plusReady(function(){
	//mui.preload({url:"userSafe.html",id:"userSafe"});
});
