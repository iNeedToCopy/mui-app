mui.init();
var redBeans = new Vue({
	el: "#container",
	data: {
		redBeans:{
			"today": 0,
		    "count": 0,
		    "active": 0,
		    "sellcount": 0,
		    "days": 0,
		    "stock": 0,
		    iftrade:false,
		    nonetradedesc:'手持红豆天数必须大于'
		    
		}
	},
	methods: {
		//红豆分红
		goto_shareBeans: function(){
			var v = app.show_webview_fire("shareBeans",'loadinfo',{});
		},
		//红豆交易
		goto_tradeBeans: function(){
			if(this.redBeans.sellcount == 0){
				mui.toast("没有可交易的红豆");return;
			}
			if(this.redBeans.iftrade == false){
				mui.toast(this.redBeans.nonetradedesc);return;
			}
			var v = app.show_webview_fire("tradeBeans",'loadinfo',{});
		},
		//红豆明细
		goto_beansDetail: function(){
			var v = app.show_webview_fire("beansDetail",'loadinfo',{});
		},
	}
});
//关于红豆
mui(".mui-row").on('tap','.help',function(){
	app.show_webview_fire('url_view','goto_url',{url:redBeans.redBeans.abouturl});
})
mui.ready(function(){
	mui.back = function(event)
	{
    	var opener = plus.webview.getWebviewById('mine');
    	mui.fire(opener,'loadinfo',{});
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
	window.addEventListener('loadinfo',function(event){
		app.http_get("/hongdou/home",function(ret){
			if(ret.code == 200){
				redBeans.redBeans = ret.data;
			}
			else
			{
				console.log(ret.desc);
				mui.back();
				return;
			}	
		});
	});
});
//hongdou/home
mui.plusReady(function(){
	//mui.preload({url:"shareBeans.html",id:"shareBeans"});
	//mui.preload({url:"tradeBeans.html",id:"tradeBeans"});
	//mui.preload({url:"beansDetail.html",id:"beansDetail"});
	
	
});
//window.addEventListener('loadinfo',function(event){
//	var redBeansId = event.detail.redBeansId;
//	redBeans.id = redBeansId;
//	//alert(shopid);
//	app.http_get("/hongdou/home?uid=" + app.get_item("uid"),function(ret){
//		if(ret.code == 200){
//			redBeans.redBeans = ret.data;
//		}
//		else
//		{
//			console.log(ret.desc);
//			mui.back();
//			return;
//		}	
//	});
//});

