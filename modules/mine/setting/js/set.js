mui.init();
var container = new Vue({
	el:"#container",
	data:{
		iflogin:false,
		version:''
	},
	methods:{
		goto_about:function(){
			app.show_webview_fire("about","loadinfo",{});
		}
		,logout:function(){
			var btnArray = [ '确定','取消'];
			mui.confirm('确定要退出当前账号?', '退出', btnArray, function(e) {
			if (e.index == 0) 
			{
				app.logout();
				app.update_opener();
				hiauth.logout();
				mui.back();
			}});
		},check_update:function(){
			var platform = "ios";
			if(plus.os.name == "Android")
				platform = "android";
			var w = plus.nativeUI.showWaiting("正在检查...");
			app.http_get("/get/app/version?platform="+platform,function(ret){
				w.close();
				if(ret.code == 200){
					if(plus.runtime.version != ret.data.version){
						plus.nativeUI.confirm("发现新版本:"+ret.data.version +"\n\n" + ret.data.log,function(e){
							if(e.index == 1)
								plus.runtime.openURL(ret.data.downloadurl);
						},{title:"版本更新",buttons:["暂不更新","马上更新"]});
					}
					else{
						mui.toast("当前已经是最新版本")
					}
				}
			},function(){
				w.close();
			});
		},
		feedback:function(){
			app.show_webview_fire("feedback","loadinfo",{});
		}
	}
});

mui.plusReady(function(){
	hiauth.updateservice();
	container.version = plus.runtime.version;
	//mui.preload({url:"about.html",id:"about"})
})

mui.ready(function(){
	window.addEventListener('active',function(e){
		app.http_get("/login/check",function(ret){
			container.iflogin = ret.iflogin;
		},function(x,e,t){container.iflogin = false;});
	});
	
	mui.back = function(event)
	{
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});