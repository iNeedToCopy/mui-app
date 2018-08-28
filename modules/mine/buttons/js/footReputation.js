
var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},
	methods:{
		reload:function(){
			this.items = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},100);
		},
		append:function(data){ 
			this.items = this.items.concat(data.data); 
		},
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.items=[];
		container.reload();
	});
	
	mui.back = function(event)
	{
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
