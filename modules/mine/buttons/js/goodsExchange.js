mui.init();

var container = new Vue({
	el:'#container',
	data:{
		logo:'',
		count:0,
		baseinfo:{
			"name": "",
	      	"id": 0,
	      	"letter": 0,
	      	"integral": 0,
	      	"credit": 0,
	      	"stock": 0,
	      	"single_buy_count": 1
		},
		freepass:false,
		paytoken:'',
		address:{
			id:0,
			name:0,
			phone:0,
			detail:0,
		},
		exchangeUrl:'',
		no_silver:true,
	},
	methods:{
		pre_exchange:function(){
			var url = !!container.exchangeUrl ? container.exchangeUrl.exchangeUrl : "/integral/exchange";
//			console.log(url)
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在获取兑换信息...");
			app.http_post(url,{
				goodsid:this.baseinfo.id,
				count:this.count,
				addressid:this.address.id
			},function(ret){
				w.close();
				if(ret.code != 200){
					mui.toast(ret.desc);return;
				}
				_self.paytoken = ret.data.paytoken;
				_self.$refs.paypad.set_info(ret.data);
				_self.$refs.paypad.show();
					
			},function(x,t,e){
				w.close();
			});
		},
		exchange:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在执行兑换...",{back:'none'});
			
			var url = !!container.exchangeUrl ? container.exchangeUrl.payUrl : '/integral/exchange/pay';
			console.log(url)
			app.http_post(url,
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					//app.update_opener();
					mui.toast(ret.desc);
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
		},goto_selectlocation: function() {
			app.show_webview_fire('selectedLocation', 'loadinfo', {})
		},
		goto_addLocation: function() {
			app.show_webview_fire('addLocation', 'loadinfo', {})
		},
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		if(e.detail.type == '银豆'){
			container.no_silver = false;
		}
		container.baseinfo = e.detail.info;
		container.logo = e.detail.logo;
		container.count = e.detail.count;
		container.address = e.detail.address;
		container.exchangeUrl = e.detail.exchangeUrl;
		console.log(JSON.stringify(e.detail))
	});
	window.addEventListener('location_selected', function(event) {
		container.address = event.detail.address;
		container.address.detail = event.detail.address.address;
		console.log(JSON.stringify(container.address));
	});
	mui.back = function(){
		var opener = plus.webview.getWebviewById('silverBeans');
		mui.fire(opener,'loadinfo',{});
		plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
	}
})
