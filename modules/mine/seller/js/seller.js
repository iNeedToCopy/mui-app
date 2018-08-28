mui.init();


var container = new Vue({
	el:"#container",
	data:{
		shops:[]
	},
	methods:{
		loadinfo:function(){
			this.shops = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){ 
			this.shops = this.shops.concat(data.data); 
		},
		scanqr:function(){
			var v = app.scanqr();
			mui.fire(v,"set_responder","seller");
		},
		receive_qr:function(){
			app.show_webview_fire("seller_code",'loadinfo',{shop:{id:0,name:''}});
			//app.show_webview_fire("url_view","goto_url",{url:'http://m.zhonglaiwang.com/generate/seller/receive/code'});
		},
		check_ticket:function(){
			app.show_webview_fire('validateCode',"loadinfo",{});
		},
		seller_orders:function(){
			app.show_webview_fire("seller_orders","loadinfo",{});
		},
		shoplist:function(){ 
			app.show_webview_fire("seller_shoplist","loadinfo",{});
		},
		gotoDetail:function(orderid){
	    	app.show_webview_fire("orderDetail",'loadinfo',{orderid:orderid,is_seller:true});
	    },
	    cashier_list:function(){
	    	app.show_webview_fire("cashier_list",'loadinfo',{});
	    },
	    seller_discount:function(){
	    	app.show_webview_fire("seller_discount",'loadinfo',{});
	    },
	    goto_detail:function(_shop){
	    	app.show_webview_fire("seller_code",'loadinfo',{shop:_shop});
	    },
	    preferential:function(){//优惠
	    	app.show_webview_fire("preferential",'loadinfo',{});
	    },
		show_tip:function(){
			mui("#tip").popover("show");
		}
	}
});

mui.plusReady(function(){
	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.loadinfo();
	});
	window.addEventListener('refresh',function(e){
		container.loadinfo();
	});
	mui.back = function(event)
	{
	  //  clearInterval(interval);
	  container.shops = [];
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
