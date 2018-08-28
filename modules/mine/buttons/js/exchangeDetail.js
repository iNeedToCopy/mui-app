mui.init();

var container = new Vue({
	el:"#container",
	data:{
		count:1,
		show_type:0,//0文字说明,1图片说明
		slides:[{url:"../../../images/placeholder.png"}],
		baseinfo:{
			"name": "",
	      	"id": 0,
	      	"letter": 0,
	      	"integral": 0,
	      	"credit": 0,
	      	"stock": 0,
	      	"single_buy_count": 20,
	      	longimg:''
		},
		address:{},
		phone:'',
		money:'',
		intro:"",
		exchangeUrl:'',
		url:"/integral/goods/home?goodsid=",
		no_silver:true,
	},
	methods:{
		reset:function(){
			this.count=1;
			this.slides=[{url:"../../../images/placeholder.png"}];
			this.baseinfo={
				"name": "",
		      	"id": 0,
		      	"letter": 0,
		      	"integral": 0,
		      	"credit": 0,
		      	"stock": 0,
		      	"single_buy_count": 20,
		      	longimg:''
			},
			this.address={},
			this.intro="";
			this.url = "/integral/goods/home?goodsid=";
			this.no_silver = true
		},
		set_viewtype:function(_type){
			this.show_type = _type;
		},
		update_amount: function() {
			var _self = this;
			setTimeout(function(){
				
				_self.count = mui(".mui-numbox").numbox().getValue();
			},100);
			
		},
		load_info:function(_id){
			var _self = this;
			
			app.http_get(this.url+_id,function(ret){
				_self.slides = ret.data.slides;
				_self.baseinfo = ret.data.baseinfo;
				_self.intro = ret.data.intro;
				_self.address = ret.data.address;
				console.log(JSON.stringify(_self.baseinfo));
				mui(".mui-numbox").numbox().setOption('max',_self.baseinfo.single_buy_count);
			},function(x,t,e){});
		},
		linkUrl:function(url){
			var _self = this;
			
			app.http_get(url,function(ret){
				_self.slides = ret.data.slides;
				_self.baseinfo = ret.data.baseinfo;
				_self.intro = ret.data.intro;
				_self.address = ret.data.address;
				mui(".mui-numbox").numbox().setOption('max',container.baseinfo.single_buy_count);
			},function(x,t,e){});
		},
		goto_exchange:function(info,logo){
			var type = this.no_silver ? '' : '银豆';
			app.show_webview_fire("goodsExchange","loadinfo",{type:type,exchangeUrl:this.exchangeUrl,count:this.count,info:info,logo:logo,address:this.address});
		},
		
	},
	updated:function(){
		mui(".mui-slider").slider();
	}
})

mui.ready(function(){
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	});

	window.addEventListener('loadinfo',function(event){
		container.count = 1;
		container.show_type = 0;
		container.exchangeUrl = event.detail.exchange_url;
		mui(".mui-numbox").numbox().setValue(1);
		if(event.detail.url){
			container.url = event.detail.url;
			container.no_silver = false;
		}
		container.load_info(event.detail.id);
	});
	window.addEventListener('loadUrl',function(event){
		container.linkUrl(event.detail.url);
		container.exchangeUrl = event.detail;
		console.log(JSON.stringify(event.detail))
	});
	mui.back = function(event)
    { 
        container.reset();
        plus.webview.close(plus.webview.currentWebview(),'slide-out-right');
    };
});
