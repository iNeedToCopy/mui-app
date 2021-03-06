
var container = new Vue({
	el:"#container",
	data:{
		shopid:0,
		items:[]
	},
	methods:{
		show_detail:function(_service_id)
		{
			app.show_webview_fire("serviceDetail","loadinfo",{id:_service_id});
		},
		reload:function(_shopid){
			this.shopid = _shopid;
			this.items = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.loadmore.newrequest();
			},100);
			
		},
		append:function(data){ 
			this.items = this.items.concat(data.data); 
		},
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.reload(event.detail.shopid);
	});
	
	mui.back = function(event)
	{
	   //清空Vue里面的Data
	   container.items=[];

	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
