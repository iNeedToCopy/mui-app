mui.init();

var container  = new Vue({
	el:'#container',
	data:{
		allmoney:0,
		items:[]
	},
	methods:{
		reload:function(){
			allmoney = 0;
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.allmoney = data.allMoney;
			this.items = this.items.concat(data.data); 
		}
	}
});

mui.ready(function(){
	window.addEventListener('active',function(event){
		container.reload();
	});
	
	mui.back = function(event)
	{
	   container.details=[];
	   app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
});