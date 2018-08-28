mui.init();

var container = new Vue({
	el:"#container",
	data:{
		shops:[]
	},
	methods:{
		loadinfo:function(){
			this.shops = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},200);
			
		},
		append:function(data){ 
			this.shops = this.shops.concat(data.data); 
		},
		gotoDetail:function(orderid){
	    	//app.show_webview_fire("shopDetail",'loadinfo',{orderid:orderid,is_seller:true});
	    },
	}
});

mui.plusReady(function(){
	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.loadinfo();
	});
});
