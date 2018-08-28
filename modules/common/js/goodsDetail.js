mui.init();
mui.ready(function(){
	//关闭蒙版
	mui("#popover .title").on('tap','img',function(){
		mui("#popover").popover('hide');
	});
});

var container = new Vue({
	el:"#container",
	data:{
		goods_id:0,
		sliders: {},
		baseinfo: {},
		shop: {},
		comment: {
	      total: 0,
	      allscore: 0
	    },
		items: {},
		ifbuy: {},
		ifanytimeback: {},
		ifexpireback: {},
		ifgohome: {}
	},
	methods:{
		reset:function(){
			this.sliders={};
			this.baseinfo={};
			this.shop={};
			this.items={};
			this.comment={
		      total: 0,
		      allscore: 0
		    };
		},
		call_phone:function(phone){
			plus.device.dial(phone);
		},
		goto_map:function(_lng,_lat,_name,_addr){
			app.show_webview_fire("seeShopLocation","setinfo",{lng:_lng,lat:_lat,name:_name,addr:_addr});
		},
		buy:function(_goodsid){
			console.log(_goodsid);
			app.show_webview_fire("submitOrder","loadinfo",{goodsid:_goodsid});
		},
		//提交订单
		goto_applyShop:function(_goodsid){
			app.show_webview_fire("applyShop","loadinfo",{goodsid:_goodsid});
			
		},
		//图文详情
		goto_picTextDetail:function(){
			app.show_webview_fire("picTextDetail","loadinfo",{goodsid:this.baseinfo.id});
			
		},
		//全部评论
		goto_allComment:function(){
			app.show_webview_fire("allComment","loadinfo",{type:"goods" ,id:this.goods_id});
			
		},
		//最近的门店
		goto_shopDetail:function(_shopId){
			app.show_webview_fire("shopDetail","loadinfo",{shopid: _shopId});
			
		},
		load_info:function(goods_id){
			this.goods_id = goods_id;
			app.http_get('/goods/home?goodsid='+ goods_id,
				function(ret){
					if(ret.code == 200){
						container.sliders = ret.data.slides;
						container.baseinfo = ret.data.baseinfo;
						container.shop = ret.data.shop;
						container.comment = ret.data.comment;
						container.items = ret.data.attr;
						container.ifbuy = ret.data.ifbuy;
						container.ifanytimeback = ret.data.ifanytimeback;
						container.ifexpireback = ret.data.ifexpireback;
						container.ifgohome = ret.data.ifgohome;
						setTimeout(function(){
							mui(".mui-slider").slider();
							var indicator = document.getElementById("indicator");
							indicator.querySelector('.mui-indicator').classList.add('mui-active');
						},100);
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
});
mui.plusReady(function(){
//	mui.preload({url:'buy/submitOrder.html',id:'submitOrder'});
//	mui.preload({url:'applyShop.html',id:'applyShop'});
//	mui.preload({url:'picTextDetail.html',id:'picTextDetail'});
//	mui.preload({url:'allComment.html',id:'allComment'});
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		console.log("loadinfo goodsdetail");
		container.lng = event.detail.lng;
		container.lat = event.detail.lat;
		container.name = event.detail.name;
		container.addr = event.detail.addr;
		container.load_info(event.detail.goodsid);
	});
	
	mui.back = function(event)
	{
	   container.reset();
	   mui("#popover").popover('hide');
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
})
//大图浏览
setTimeout(function(){
	mui(".commentPic .pic").on('tap','img',function(){
		var curpos = this.getAttribute('data_id');
		var curHef = this.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.innerText;
		mui.openWindow({
			url: curHef + '&curpos=' + curpos,
			id: curHef,
			show: {
				aniShow: 'slide-in-right'
			}
		})
	});
},1000);

