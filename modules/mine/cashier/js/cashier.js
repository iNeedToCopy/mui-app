mui.init();


var container = new Vue({
	el:"#container",
	data:{
		orders:[]
	},
	methods:{
		load_orders:function(){
			this.orders=[];
			this.$refs.loadmore.newrequest();
		},
		scanqr:function(){
			var v = app.scanqr();
			mui.fire(v,"set_responder","cashier");
		},
		receive_qr:function(){
			app.show_webview_fire("url_view","goto_url",{url:'http://m.zhonglaiwang.com/generate/seller/receive/code'});
		},
		check_ticket:function(){
			app.show_webview_fire('validateCode',"loadinfo",{});
		},
		append:function(data){
			this.orders = this.orders.concat(data.data);
		},
		
	}
});

mui.plusReady(function(){
	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.load_orders();
	});
	window.addEventListener('refresh',function(e){
		container.load_orders();
	});
});
