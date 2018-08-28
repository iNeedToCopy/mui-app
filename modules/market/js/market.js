mui.init();
var title_market = {
    backgroundColor: '#ffffff',
    titleText: '商品详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    },
    buttons:[{text:'\ue107',fontSrc:'/fonts/mui-icons-extra.ttf',float:'right',onclick:clickButton}]
}
function clickButton(){//跳转购物车
	container.goto_car();
}
var container = new Vue({
	el: "#container",
	data:{
		phone:0,
		location:'',
		tabs_show:false,//控制隐藏class组
		isscroll:false,//控制slider z-index
		slide:[{
			img: '../../images/market/market_banner1.jpeg'
		},{
			img: '../../images/market/market_banner2.png'
		}],//轮播图
		show_market:[],//显示的class
		hide_market:[],//隐藏的class
		goods_list:[],//商品列表
		current_cid:'0',//当前点击的class cid
		regionuid:'',
		active_show_class:0,//控制第一排active_class
		active_hide_class:-1,//控制隐藏的active_class
		isloading:false,//控制上拉加载
		next_page_url:'no',//上拉刷新的下一页请求路径
	},
	methods:{
		goto_call:function(){
			plus.device.dial(this.phone);
		},
		goto_url:function(url){
			var url = url.split(',');
			if(url.length == 1){
				app.show_webview_fire("url_view","goto_url",{url:url[0]});
			}
			if(url.length == 2){
				var id = url[0];
				var cid = url[1];
				this.goto_detail(id,cid)
			}
		},
		get_banner_info:function(){ 
			var _self = this;
			app.http_get("/mall",function(res){ 
				if(res.code === 200){
					//没联网默认两张宣传图，联网后台banner设置为空就是空
					_self.slide = res.data.slide;
					_self.show_market = res.data.marketclass; 
//					_self.hide_market = res.data.marketclass.slice(5); 
					_self.load_info(_self.show_market[0].id);
					_self.regionuid = res.data.regionuid;
					_self.phone = res.data.phone;
					app.save_item("regionuid", res.data.regionuid+'');
				}
			})
		},
		load_info:function(id){
			this.isloading = true;
			this.goods_list = [];
			var _self = this; 
			app.http_get('/mall/class/view?cid='+id,function(res){
				_self.goods_list = res.data.data;
				_self.next_page_url = res.data.next_page_url;
				_self.isloading = false;
			},function(){
				_self.isloading = false; 
			})
		},
		load_more:function(){
			if(this.isloading == false && this.next_page_url != "no" ){
				var _self = this;
				_self.isloading = true;
				app.http_get(this.next_page_url,function(res){
					_self.goods_list = _self.goods_list.concat(res.data.data);
					_self.next_page_url = res.data.next_page_url;
	        		_self.isloading = false;
				},function(x,t,e){
					_self.isloading = false;
				});
			}
		},
		goto_car:function(){//跳转购物车 
			app.show_webview_fire('shopping_car','loadinfo',{})
		},
		goto_detail:function(id,cid){//跳转详情
			var THIS = this;
			var webview = plus.webview.create("market_goods.html", "market_goods", {
			  	titleNView:title_market
			});
			plus.webview.show(webview,"slide-in-right", 300);
            webview.addEventListener('loaded',function(){
				mui.fire(webview,"send_id",{
					goodsid: id,
					regionuid: THIS.regionuid,
					cid: cid,
				});
			});
		},
		goto_orders:function(){
			app.show_webview_fire('market_orders', 'loadinfo', {action_type:'nopay'}) 
		},
		change_cid:function(id,index,type){
			this.tabs_show = false;
			this.current_cid = id;
			if(type == 'show') {
				this.active_show_class = index; 
				this.active_hide_class = -1;
			}
			if(index != 0&&index != 1){
				mui('.tabs').scroll().scrollTo(0,0,300); 
				mui('.tabs').scroll().scrollTo(-45*this.active_show_class-45,0,300);  
			}else{
				mui('.tabs').scroll().scrollTo(-45*this.active_show_class,0,300);
			}
			this.load_info(id);
		},
		append:function(data){
			container.goods_list = container.goods_list.concat(data.data)
		} 
	},
	updated: function () {
		//获得slider插件对象
		this.location = app.get_item("district");
		if(this.slide.length > 1){
			mui('.mui-slider').slider({
				interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
			});
		}
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	}  
}) 
mui.plusReady(function(){
	container.get_banner_info();
})
mui.ready(function(){
    var backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) { 
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出');
		}
		setTimeout(function() { 
			backButtonPress = 0;
		}, 1000);
		return false;
	};
	window.addEventListener('loadinfo',function(){
		container.get_banner_info();
	});
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isiOS){
		function fn(){
			var wScrollY = window.scrollY;
		    var wInnerH = window.innerHeight;
		    var bScrollH = document.body.scrollHeight;
			var offset_top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		    if (wScrollY + wInnerH >= bScrollH) { 
		        container.load_more();
		    }   
			if(offset_top > 225){
				document.getElementsByClassName('tabBox')[0].style.position = 'fixed';
				document.getElementsByClassName('tabBox')[0].style.top = '65px';
			}else{
				document.getElementsByClassName('tabBox')[0].style.position = 'relative'; 
				document.getElementsByClassName('tabBox')[0].style.top = 0;
			}
		    if(wScrollY > 5){
		    	container.isscroll = true;
		    	document.getElementsByClassName('tabBox')[0].style.zIndex = 1 
		    }else{
		    	container.isscroll = false;
		    	document.getElementsByClassName('tabBox')[0].style.zIndex = 2
		    }
		}
		window.addEventListener('touchmove',fn);
		window.addEventListener('scroll',fn);
	}else{
		window.addEventListener('scroll',function(){
			var wScrollY = window.scrollY;
		    var wInnerH = window.innerHeight;
		    var bScrollH = document.body.scrollHeight;
		    if (wScrollY + wInnerH >= bScrollH) { 
		        container.load_more();
		    }   
		    if(wScrollY > 5){
		    	container.isscroll = true;
		    	document.getElementsByClassName('tabBox')[0].style.zIndex = 1 
		    }else{
		    	container.isscroll = false;
		    	document.getElementsByClassName('tabBox')[0].style.zIndex = 2
		    }
			var offset_top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			if(offset_top > 225){
				document.getElementsByClassName('tabBox')[0].style.position = 'fixed';
				document.getElementsByClassName('tabBox')[0].style.top = '65px';
			}else{
				document.getElementsByClassName('tabBox')[0].style.position = 'relative'; 
				document.getElementsByClassName('tabBox')[0].style.top = 0;
			}
		});
	}
});