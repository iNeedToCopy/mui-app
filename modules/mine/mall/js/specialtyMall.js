
mui.init();


var container = new Vue({
	el:"#container",
	data:{
		cityCode:'',//区县Code
		pos:'定位',//位置信息
		goods:[],//商品信息
		city:'',
		cityid:0,
	},
	methods:{
		getPosition:function(e) {
			app.refresh_location();
			plus.geolocation.getCurrentPosition(function(pos){
				if(pos.address != undefined && pos.address.cityCode != undefined)
					container.cityCode = pos.address.cityCode
				if(pos.address != undefined)
					container.pos = pos.address.district
			}, function(e) {
				mui.toast("定位当前位置失败" + e.message);
			});
		},
		loadinfo:function(e){
			const THIS = this;
			this.goods = [];
			app.http_get('/integral/local/home?id='+ this.cityid,function(ret){
				if(ret.code == 200)
				{
					THIS.goods = ret.data;
				}
			},function(x,t,e){});
		},
		append:function(ret){
			//console.log(JSON.stringify(ret));
			this.goods = ret;
		},
		goToLocation:function(){
			if(container.pos === '定位'){
				container.getPosition();
			}else{
				app.show_webview_fire('specialtyLocation','loadinfo',{'a':1})
			}
		},
		goBack:function(){
			mui.back()
		},
		//兑换商品详情
		gotoGoods:function(_id){
			var url = '/integral/local/goods/home?goodsid=' + _id;
			app.show_webview_fire("exchangeDetail","loadUrl",{url:url,exchangeUrl:'/integral/local/exchange',payUrl:'/integral/local/exchange/pay'});
		}
	},
	updated:function(){
		var items = document.querySelectorAll(".mui-content #Gallery .mui-slider-item");
		for(var i=0;i<items.length;i++){
			items[i].style.width=screen.width+"px";
		}
		mui(".mui-slider").slider();
	}
})

mui.plusReady(function(){
//	container.getHomeInfo();
//	container.getPosition();
	mui.back = function(){
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.city = e.detail.city;
		container.cityid = e.detail.id;
		container.loadinfo();
	});
});





