mui.init();
//短信加密
//CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//var date = new Date();
//var time = date.getTime()/1000;
//var type = 'modiphoneone';
//var str = '0'+','+type+','+time;
//var key = '66y750yw2m4qg3jv';
//var iv = '66y750yw2m4qg3jv';
//key = CryptoJS.enc.Utf8.parse(key);
//iv = CryptoJS.enc.Utf8.parse(iv);
//var encrypted = CryptoJS.AES.encrypt(str,key,{
//	iv: iv,
//	mode: CryptoJS.mode.CBC,
//	padding: CryptoJS.pad.ZeroPadding	
//});
//encrypted = encrypted.toString();

//第一步
var phonetoken = "";
var step = 1;
var newTel = new Vue({
	el:"#container",
	data: {},
	methods: {
		encrypted:function(){
			var date = new Date();
			var time = date.getTime()/1000;
			var type = 'modiphoneone';
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
				},
				error: function(error) {
					w.close();
					console.log(error);
				}
			});
		},
		goto_newTel:function(){
			var smscode = mui(".smscode")[0].value;
			
			var w=plus.nativeUI.showWaiting("",{back:'none',modal:true});
			mui.ajax('http://app.zhonglaiwang.com/my/phone/update',{
				headers: {
					token: app.get_item("token")
				},
				data: {
					uid: app.get_item("uid"),
					step: step,
					smscode: smscode
				},
				datatype: 'json',
				type: 'post',
				success: function(data) {
					w.close();
					if(data.code == 200){
						phonetoken = data.data;
						app.show_webview_fire("newTel","newTel",{'phonetoken': phonetoken});
						mui(".smscode")[0].value = '';
					}
					else
						mui.toast(data.desc);
				},
				error: function(error) {
					w.close();
					console.log(error);
				}
			});
			
		}
	}
});

mui.ready(function(){
	window.addEventListener('back',function(event){
		mui.back();
	});
});
mui.back = function(event){
	mui(".smscode")[0].value = '';
    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
};
mui.plusReady(function(){
	//mui.preload({url:"newTel.html",id:"newTel"});
});


