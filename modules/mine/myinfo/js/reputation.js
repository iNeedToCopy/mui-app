mui.init();
var container = new Vue({
	el:"#container",
	data:{
		usertype:0,
		yesterday: 0,
	    rate: "0",
	    abouturl: "",
	    moreurl: "",
	    rechargeurl: "",
	    all: 0,
	    my: 0
	},
	methods:{
		
		reload:function(){
			var _self = this;
			app.http_get('/letter/home',function(ret){
				if(ret.code == 200)
				{
					_self.yesterday = ret.data.yesterday;
					_self.rate = ret.data.rate;
					_self.abouturl = ret.data.abouturl;
					_self.moreurl = ret.data.moreurl;
					_self.rechargeurl = ret.data.rechargeurl;
					_self.all = ret.data.all;
					_self.my = ret.data.my;
				}
			});
		},
		//信值充值
		goto_recharge:function(){
			var v = app.show_webview_fire("recharge","active",{});
		},
		//代理充值
		goto_rechargeService:function(){
			var v = app.show_webview_fire("rechargeService","loadinfo",{});
		},
		//信值明细
		goto_reputationDetail:function(){
			app.show_webview_fire('reputationDetail',"loadinfo",{});
		},
		goto_about:function(){
			app.show_webview_fire('url_view','goto_url',{url:this.abouturl});
		},
		goto_other:function(){
			mui.toast("暂未开通");
		}
	}
});
mui.ready(function(){
	window.addEventListener('active',function(event){
		container.reload();
		container.usertype = parseInt(app.get_item("usertype"));
		
	});

	mui.back = function(event)
	{
    	var opener = plus.webview.getWebviewById('mine');
    	mui.fire(opener,'loadinfo',{});
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

mui.plusReady(function(){
	//mui.preload({url:'reputationDetail.html',id:'reputationDetail'});

});
