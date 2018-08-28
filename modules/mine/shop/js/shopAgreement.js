mui.init();
var id = 0;
var url = '';
var protocol='';
var invitetype = 0;

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		id = event.detail.id; 
		url = event.detail.url;
		protocol = event.detail.protocol;
		invitetype = event.detail.invitetype;
		document.getElementById("protocol").src = "http://m.zhonglaiwang.com"+protocol;
		
	});
	mui("iframe")[0].style.height = (document.documentElement.clientHeight-72)+'px';
});
var container = new Vue({
	el:"#container",
	data:{
		desc:{}
	},
	methods:{
		goto_shopApp:function(){
			var argument = id == 0 ?{}:{invitecode:id};
			var w = plus.nativeUI.showWaiting("");
			app.http_post(url,argument,
				function(ret){
					w.close();
					if(ret.code == 200){
						app.show_webview_fire("shopApp","loadinfo",{id: id});
						plus.webview.hide(plus.webview.currentWebview(),"fade-out");
					}else{
						mui.toast(ret.desc);
						container.desc = ret.desc;
					}
				},function(x,t,e){
					w.close();
					console.log(e);
				}
			);
		},
		agree:function(){
			if(invitetype == 1){
				//
				this.goto_shopApp();
	   			
			}
			else if(invitetype == 2){
				app.http_post(url,{invitecode:id},
					function(ret){
						plus.nativeUI.toast(ret.desc,{duration:"long",verticalAlign:'center'});
						if(ret.code == 200){
							mui.back();
						}
					},function(x,t,e){
						console.log(e);
					}
				);
			}
		},
		mask_close:function(){
			mui(".mui-popover").popover('hide');
		}
	}
})




