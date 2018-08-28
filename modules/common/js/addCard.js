mui.init();
mui.ready(function(){
	mui(".getIdCode").on('tap','button',function(){
		var num = 60;
		var time = setInterval(function(){
			mui(".getIdCode button")[0].innerText=num;
			mui(".getIdCode button")[0].setAttribute("disabled","disabled");
			num--;
			if(num<-1){
				clearInterval(time);
				mui(".getIdCode button")[0].innerText="获取验证码";
				mui(".getIdCode button")[0].removeAttribute("disabled");
			}
		},1000)
	});

	//获取后传值
	mui("#popover").on('tap','a',function(){
		var bankName = this.innerText;
		var id = this.id;
		mui("#popover").popover('hide');
		mui(".selected")[0].value = bankName;
		mui(".selected")[0].id = id;
	})
});

//银行列表渲染
var container = new Vue({
	el:"#container",
	data:{
		item:[],
		username:'',
		banknumber:'',
		address:'',
		smscode:''
	},
	methods:{
		load_info:function(){
			app.http_get('/bank/list',
				function(ret){
					if(ret.code == 200){
						container.item = ret.data;
					}
				},function(x,t,e){
					console.log()
				}
			)
		},
		encrypted:function(){
			var date = new Date();
			var time = date.getTime()/1000;
			var type = 'addbank';
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
		add:function(){
			var bankid = mui(".selected")[0].id;
			var _data = {
				"uid" : app.get_item("uid"),
				"username" : container.username,
				"banknumber" : container.banknumber,
				"bankid" : bankid,
				"address" : container.address,
				"smscode" : container.smscode
			};
			
			app.http_post('/my/bank/add',_data,
				function(ret){
					mui.toast(ret.desc);
					if(ret.code == 200){
						
						app.update_opener();
						mui.back();
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
});
mui(".mui-scroll-wrapper").scroll();
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_info();
	});
	
	mui.back = function(event)
	{
	   container.username = '';
	   container.banknumber = '';
	   container.bankid = 0;
	   container.address = '';
	   container.smscode = '';
	   
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
//
////短信加密
//CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//var date = new Date();
//var time = date.getTime()/1000;
//var type = 'addbank';
//var str = '17760555570'+','+type+','+time;
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
//mui(".getIdCode").on('tap','button',function(){
//	mui.ajax('http://'+app.get_item("domain")+'/send/sms', {
//		headers:{
//			token: app.get_item("token")
//		},
//		data:{
//			enctypestr: encodeURIComponent(encrypted),
//			uid: app.get_item("uid")
//		},
//		datatype: 'json',
//		type: 'get',
//		async: false,
//		success: function(data) {
//			mui.toast(data.desc);
//			console.log(data)
//		},
//		error: function(error) {
//			console.log(error);
//		}
//	})
//});




