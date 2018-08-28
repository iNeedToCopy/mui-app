mui.init();

var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},methods:{
		reload:function(){
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.items = this.items.concat(data.data); 
		},
		goto_shopdetails:function(_shopid){
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid});
		}
	}
	
});

mui.ready(function(){
	window.addEventListener('active',function(event){
		container.reload();
	});
	
	mui.back = function(event)
	{
	   container.details=[];
	   app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
});
