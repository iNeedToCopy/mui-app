mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:[]
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
		container.load_info();
	});
	mui.back = function(event)
    {
       container.items = [];
       plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});
