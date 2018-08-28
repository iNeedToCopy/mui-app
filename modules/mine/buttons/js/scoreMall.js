mui.init();
var container = new Vue({
	el:"#container",
	data:{
		integral:0,
		items:[],
		about_url:'',
	},
	methods:{
		goto_url:function(){
			if(!!this.about_url){}
				app.show_webview_fire('url_view','goto_url',{url:this.about_url});
		},
		load_info:function(){
			var _self = this;
			
			setTimeout(function(){
				app.http_get("/integral/home",function(ret){
					_self.integral = ret.data.myintegral;
					_self.about_url = ret.data.abouturl;
					_self.items = ret.data.goodslist;
					_self.$refs.loadmore.newrequest();
				},function(x,t,e){});
			},200);
			
		},
		dummy:function(){
			app.show_webview_fire("specialtyLocation","specialtyLocation",{});
		},
		//积分明细
		goto_scoreDetail:function(_id){
			app.show_webview_fire("scoreDetail","loadinfo",{});
		},
		//兑换历史
		goto_exchangeHistory:function(){
			app.show_webview_fire("exchangeHistory","loadinfo",{});
		},
		//兑换商品详情
		goto_exchangeDetail:function(_id){
			app.show_webview_fire("exchangeDetail","loadinfo",{id:_id});
		},
		append:function(data){
			this.items=this.items.concat(data.data);
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

mui.plusReady(function(){
	//mui.preload({url:'exchangeHistory.html',id:'exchangeHistory'});
	//mui.preload({url:'scoreDetail.html',id:'scoreDetail'});
	//mui.preload({url:'exchangeDetail.html',id:'exchangeDetail'});
});