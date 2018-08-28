mui.init();
	   		
//短信加密
var phonetoken = "";
var container = new Vue({
	el:"#container",
	data: {
		phone:'',
		smscode:''
	},
	methods: {
		encrypted:function(){
			var date = new Date();
			var time = date.getTime()/1000;
			var type = 'freepass';
			var str = '0,'+type+','+time;
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
			//发送短信
			var w = plus.nativeUI.showWaiting();
			mui.ajax('http://'+app.get_item("domain")+'/send/sms', {
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
				},
				error: function(error) {
					w.close();
					console.log(error);
				}
			});
		},
		do_open:function(){
			if(this.smscode.length == 0){
				mui.toast("请输入正确的验证码");
				return;
			}
			
			mui.ajax('http://'+app.get_item("domain")+'/my/free/pass',{
				headers: {
					token: app.get_item("token")
				},
				data: {
					uid: app.get_item("uid"),
					smscode: this.smscode
				},
				datatype: 'json',
				type: 'post',
				success: function(data) {
					mui.toast(data.desc);
					if(data.code == 200){
						mui.back();
						app.update_opener();
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
	}
});
mui.back = function(event){
	mui(".mui-input-clear")[0].value = '';
    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
};