mui.init();

//
var container = new Vue({
	el:"#container",
	data:
	{
		credit:0,
		base:0
	},
	methods:{
		goto_footReputation:function(){
			app.show_webview_fire('footReputation',"loadinfo",{});
		},
		loadinfo:function(){
			app.http_get("/credit/home",function(ret){
				if(ret.code == 200){
				    container.credit = ret.data.credit;
				    container.base = ret.data.base;
				}
			},function(x,r,e){});
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.loadinfo();
	});
	mui.back = function(event)
	{
	   //app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

mui.plusReady(function(){
	//mui.preload({url:'footReputation.html',id:'footReputation'});
});
