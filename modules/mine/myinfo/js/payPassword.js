mui.init();
//短信加密
CryptoJS.AES.encrypt("Message", "Secret Passphrase");
var date = new Date();
var time = date.getTime()/1000;
var type = 'modipaypass';
var str = '0'+','+type+','+time;
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

var container = new Vue({
	el:"#container",
	data: {},
	methods: {
		send_code:function(){
			var w = plus.nativeUI.showWaiting();
			
			//发送短信
			mui.ajax('http://app.zhonglaiwang.com/send/sms', {
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
		},
		ok:function(toValue){
			var newpaypass = mui(".password")[0].value;
			var smscode = mui(".smscode")[0].value;
			mui.ajax('http://app.zhonglaiwang.com/my/modi/paypass',{
				headers: {
					token: app.get_item("token")
				},
				data: {
					uid: app.get_item("uid"),
					smscode: smscode,
					newpaypass: newpaypass
				},
				datatype: 'json',
				type: 'post',
				success: function(data) {
					mui.toast(data.desc);
					if(data.code == 200)
						mui.back();			
				},
				error: function(error) {
					console.log(JSON.stringify(error));
				}
			});
		}
	}
})
mui.plusReady(function(){
	//mui.preload({url:"userSafe.html",id:"userSafe"});
});
mui.back = function(event){
	mui(".smscode")[0].value = '';
	mui(".password")[0].value = '';
    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
};
