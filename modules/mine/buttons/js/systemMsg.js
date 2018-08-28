mui.init();

var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},
	methods:{
		reload:function(){
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.items = this.items.concat(data.data); 
			console.log(JSON.stringify(this.items))
		},
		open_url:function(url){
			app.show_webview_fire("url_view","goto_url",{url:url});
		}
	}
})
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.reload();
	});
});