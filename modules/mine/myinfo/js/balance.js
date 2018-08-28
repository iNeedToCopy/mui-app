mui.init();

var container = new Vue({
	el:"#container",
	data:{
		remain:0,
		details:[]
	}
	,methods:
	{
		reload:function(){
			remain = 0;
			this.details = [];
			
			app.http_get('/my/remain',function(ret){
				container.remain = ret.data.remain;
			});
			
			this.$refs.pullup.newrequest();
		},
		append:function(data){ 
			//this.allmoney = data.allMoney;
			this.details = this.details.concat(data.data); 
		},
		goto_transform:function(){
			app.show_webview_fire("banlanceToReputation","loadinfo",{});
		},
		goto_transfer:function(){
			app.show_webview_fire("balanceTrans","loadinfo",{});
		},goto_withdraw:function(){
			app.show_webview_fire("withdraw","loadinfo",{});
		}
	},mounted:function(){
		
	}
});


mui.ready(function(){
	//console.log("balance ready");
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


