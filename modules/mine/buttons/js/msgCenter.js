mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:{
			system: {
				ifhas: false,
				desc: '',
				datetime:'' 
			},
			notify: {
				ifhas: false,
				desc: '',
				datetime:'' 
			}, 
			invite: {
				ifhas: false,
				desc: '',
				datetime:'' 
			}
		}
	},
	methods:{
		goto_systemMsg:function(){
			app.show_webview_fire("systemMsg","loadinfo",{});
		},
		goto_inviteMsg:function(){
			app.show_webview_fire("inviteMsg","loadinfo",{});
		},
		goto_information:function(){
			app.show_webview_fire("information","loadinfo",{});
		},
		load_info:function(){
			app.http_get('/my/message/home',
				function(ret){
					if(ret.code == 200){
						container.items = ret.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
})

mui.ready(function(){
	window.addEventListener('loadinfo',function(){
		container.load_info();
	})
	
	//mui.preload({url:"systemMsg.html",id:"systemMsg"});
	//mui.preload({url:"inviteMsg.html",id:"inviteMsg"});
	//mui.preload({url:"information.html",id:"information"});
})