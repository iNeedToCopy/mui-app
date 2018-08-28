
mui.ready(function(){
	mui.back = function(event)
	{
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

var container = new Vue({
	el:'#container',
	data:{
		code:''
	},
	methods:{
		check:function(){
			if(this.code.length == 0)
			{mui.toast('请输入券码');return;}
			var w = plus.nativeUI.showWaiting("正在验券...",{back:'none'});
			app.http_get('/seller/check/code?shopid='+app.get_item('shopid')+'&paycode='+this.code,function(ret){
				w.close();
				if(ret.code == 200){
					app.fire_opener(loadinfo,{});
					app.show_webview_fire("cashier_success","loadinfo",{info:ret.desc});
				}
				else
				{
					app.show_webview_fire("cashier_failed","loadinfo",{info:ret.desc});
					
				}
			},function(x,t,e){w.close();});
		}
	}
});