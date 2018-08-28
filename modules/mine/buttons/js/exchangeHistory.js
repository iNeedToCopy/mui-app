mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:[],
		url:'/integral/history'
	},
	methods:{
		load_info:function(){
			//this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.items = this.items.concat(data.data);
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		if(event.detail.url){
			container.$refs.pullup.object = event.detail.url;
		}
		container.load_info();
	});
	mui.back = function(event)
    {
       container.items = [];
       plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});
