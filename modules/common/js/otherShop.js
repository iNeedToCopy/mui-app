
var container = new Vue({
	el:"#container",
	data:{
		shopid:0,
		total:0,
		items:[]
	}
	,methods:
	{
		reload:function(_id){
			this.shopid = _id;
			this.items = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},100);
		},
		goto_map:function(_lng,_lat,_name,_addr){
			app.show_webview_fire("seeShopLocation",'setinfo',{lng:_lng,lat:_lat,name:_name,addr:_addr});
		},
		append:function(data){ 
			this.items = this.items.concat(data.data);
			this.total = data.total;
		},
		goto_shop_details:function(_shopid){
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid});
		},
	},
	computed:{
		
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.reload(event.detail.shopid);
	});
	
	mui.back = function(event)
	{
	   container.items=[];
	   container.total=0;
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});



