mui.init();

var container = new Vue({
	el:"#container",
	data:{
		commerceid:0,
		shops:[]
	},
	methods:{
		load_data:function(_commerceid){
			this.shops = [];
			this.commerceid = _commerceid;
			var _self = this;
			setTimeout(function(){
				_self.$refs.loadmore.newrequest();
			},200);
			
		},
		append:function(ret){
			this.shops = this.shops.concat(ret.data);
		},
		goto_shopdetail:function(_shopid)
		{
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid}); 
		},
	}
});

mui.ready(function(){
	window.addEventListener('loaddata',function(e){
		
		container.load_data(e.detail.id);
	});
});
