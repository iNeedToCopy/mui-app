mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},
	methods:{
		goto_invitation:function(_id){
			app.show_webview_fire("invitation","loadinfo",{id: _id});
		},
		reload:function(){
			this.items = [],
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.items = this.items.concat(data.data);
		}
	}
});
mui.ready(function(){
	window.addEventListener('loadinfo',function(){
		container.reload();
	})
})
