mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items: []
	},
	methods:{
		//显示地址
		load_info:function(){
			app.http_get('/my/address',
				function(ret){
					if(ret.code==200){
						container.items = ret.data;
						
					}
				},function(x,t,e){
					console.log(e)
				}
			)
		},
		selected:function(item){
			mui.fire(plus.webview.currentWebview().opener(),"location_selected",{address:item});
			container.items = [];
			mui.back();
			plus.webview.close(plus.webview.currentWebview(),"slide-out-right");
		}
	}
});
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_info();
	});
	//mui.back = function(event)
	{
	   //app.update_opener();	
	   //plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
})

