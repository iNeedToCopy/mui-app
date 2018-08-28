mui.init();

var container = new Vue({
	el:"#container",
	data:{
		qtype:'all',
		show_type:0,
		orders:[]
	},
	methods:{
		loadinfo:function(){
			this.orders = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},200);
			
		},
		set_typetype:function(_type){
			this.show_type = _type;
			this.loadinfo();
		},
		append:function(data){ 
			//this.allmoney = data.allMoney;
			this.orders = this.orders.concat(data.data); 
		},
		gotoDetail:function(orderid){
	    	app.show_webview_fire("orderDetail",'loadinfo',{orderid:orderid,is_seller:true});
	    },
	},
	computed:{
		url:function(){
			var urls = [
				'/seller/urgent/order/list',
				'/seller/online/order/list?qtype=now',
				'/seller/online/order/list?qtype=all',
				'/seller/offline/order/list'
			];
			return urls[this.show_type];
		}
	}
});

mui.plusReady(function(){
	
});
//var interval = 0;
mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		console.log("seller_orders_loadinfo");
		container.show_type = 0;
		container.loadinfo();
//		interval=setInterval(function(){
//			container.loadinfo();		
//		},10000);
	});
	
	mui.back = function(event)
	{
	  //  clearInterval(interval);
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
