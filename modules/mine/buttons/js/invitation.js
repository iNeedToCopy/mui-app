mui.init();
var id = '';
mui.ready(function(){
	window.addEventListener('loadinfo', function(event) {
	    id = event.detail.id;
		container.load_info();
	}); 
})
var container = new Vue({
	el:"#container",
	data:{
		text:{}
	},
	methods:{
		load_info:function(){
			app.http_get('/my/invite/message/detail?id='+id,
				function(ret){
					if(ret.code == 200){
						container.text = ret.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		accept:function(invitetype){
			if(invitetype == 1){
				app.show_webview_fire("shopAgreement","loadinfo",{id: id,protocol:'/seller/protocol',url:'/apply/can/seller',invitetype:invitetype});
			}
			else if(invitetype == 2){
				app.show_webview_fire("shopAgreement","loadinfo",{id: id,protocol:'/partner/protocol',url:'/apply/partner',invitetype:invitetype});
			}
		},
		ignore:function(){
			app.http_get('/ignore/invite?id='+id,
				function(ret){
					if(ret.code == 200){
						mui.toast(ret.desc);
						app.update_opener();
						mui.back();
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
})
