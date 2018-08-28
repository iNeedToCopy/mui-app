mui.init();
var container = new Vue({
	el:"#container",
	data:{
		
	},
	methods:{
		change_page:function(){
			app.show_webview_fire("order_comments","loadinfo",{}) 
		}
	}
})
