mui.init();

var container = new Vue({
	el:'#container',
	data:{
		statistics: {
	  		curmonthconsume: 0,
	  		beforemonthconsume: 0,
	  		allconsume: 0,
	  		curmonthrecharge: 0,
	  		beforemonthrecharge: 0,
	  		allrecharge: 0
   		 },
   		 items:[]
	},
	methods:{
		reset:function(){
			this.items = [];
		},
		loadinfo:function(){
			var _self = this;
			app.http_get('/letter/history',function(ret){
				_self.statistics = ret.data.static;
				_self.items = ret.data.list;
				_self.$refs.loadmore.newrequest();
			},function(x,t,e){});
		},
		append:function(data){
			this.items = this.items.concat(data.data);
		}
	}
});

mui.ready(function(){
	window.addEventListener("loadinfo",function(e){
		container.loadinfo();
	});
	mui.back = function(event)
	{
		container.reset();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
