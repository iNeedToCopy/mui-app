 mui.init({
    preloadPages: [ {
        url: "../common/goodsDetail.html",
        id: "goodsDetail"
    }],
});
mui(".mask")[0].style.width = document.documentElement.clientWidth+"px";
var titleNView = {
    backgroundColor: '#f7f7f7',
    titleText: '商品详情',
    titleColor: '#000000', 
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    },
    
}

var container = new Vue({
	el:'#container',
	data:{
		isloading:true,//记录数据是否加载完成
		district:'&nbsp;&nbsp;&nbsp;',
		loading_more:false,
		default_mini_img:'../../images/placeholder_mini.png',
		show_topbj:false,
		next_page_url:"http://app.zhonglaiwang.com/home/more", 
		classpages:[[[],[]],[[],[]]],
		nearshop:[],
		fullshop:[],
		slide:[],
		goods:[],
		advert:[]
	},
	methods:{
		set_default_mini_img:function(itm){
			itm.logo=this.default_mini_img;
		},
		goto_search:function(_shopid){
			
			app.show_webview_fade("search");
		},
		goto_shop_details:function(_shopid){
			if(_shopid !=0 )
				app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid});
		},
		goto_goods_details:function(_goodsid){
			if(_goodsid !=0){
				var v = app.open_webview("../common/goodsDetail.html","goodsDetail",{titleNView:titleNView});
				mui.fire(v,"loadinfo",{goodsid:_goodsid});
			}
		},
		goto_reduce_more:function(){
			app.show_webview_fire("near","loadinfo",{cid:0,text: "全部分类"});
		},
		goto_jmore:function(){
			app.show_webview_fire("jmore","loadinfo",{cid:0,ttext: "全部分类"});
		},
		cat_taped:function(item){
			
			if(item.ifcommerce){
				app.show_webview_fire("tradeZone","loadinfo",{});
			}
			else{
				app.show_webview_fire("near","loadinfo",{cid:item.cid,text: item.text});
			}
		},
		slide_tap:function(s){
			if(s.ifshop){
				this.goto_shop_details(s.shopid);
			}
			else{
				if(s.url.length>0 && s.url.indexOf("local") == -1)
					app.show_webview_fire("url_view","goto_url",{url:s.url});
			}
		},
		open_url:function(item){
			if(item.ifshop){
				app.show_webview_fire("shopDetail","loadinfo",{shopid:item.shopid});
			}
			else{
				if(item.url.length>0 && item.url.indexOf("local") == -1)
					app.show_webview_fire("url_view","goto_url",{url:item.url});
			}
		},
		scan_qr:function(){app.scanqr();},
		payment_code:function(){
			if(app.check_login()){
				app.show_webview_fire("paymentCode","loadinfo",{});
			}
		},
		load_data:function(){
			var _self = this;
			app.http_get("/home",function(ret){
				//console.log(JSON.stringify(ret)) 
				_self.nearshop = ret.data.nearshop;
				_self.fullshop = ret.data.fullshop;
				_self.slide = ret.data.slide;
				_self.goods = ret.data.goods;
				_self.advert = ret.data.advert;
				_self.next_page_url="http://app.zhonglaiwang.com/home/more";
				_self.load_more();
				_self.isloading = false; 
			},function(x,t,e){
				_self.isloading = false; 
				mui.toast('服务器异常');
			});
		},
		load_more:function()
		{
			if(this.loading_more == false && this.next_page_url != "no" ){
				var _self = this;
				//console.log("LOAD_MORE:"+this.next_page_url);
				_self.loading_more = true;
				app.http_get(this.next_page_url,function(ret){
					
					_self.next_page_url =ret.data.next_page_url;
	        		_self.fullshop = _self.fullshop.concat(ret.data.data);
	        		_self.loading_more = false;
	        		//console.log(_self.fullshop.length);
				},function(x,t,e){
					_self.loading_more = false;
				});
	        }
		}
	},
	updated:function(){
		var items = document.querySelectorAll(".mui-content #Gallery .mui-slider-item");
	
		for(var i=0;i<items.length;i++){
			items[i].style.width=screen.width+"px";
		}
		mui("#catalog").slider({
		  	interval:0//自动轮播周期，若为0则不自动播放，默认为0；
		});
		mui("#slider").slider({
		  	interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
		});
	
		app.dg("search_form").style.width=app.dg("search_form_d").style.width = 
		(window.innerWidth-140) + "px";
	
		window.addEventListener('active',function(e){
	//		if(pready == true)
	//			container.load_data(); 
	//		else{
	//			setTimeout(function(){
	//				container.load_data(); 
	//			},200);
	//		}
			//alert(app.dg("position").style.width);
		});
	 
		window.addEventListener('scroll',function(){
	
			if(window.scrollY >60)
				container.show_topbj = true;
			else
				container.show_topbj = false;
				
			var wScrollY = window.scrollY;
		    var wInnerH = window.innerHeight;
		    var bScrollH = document.body.scrollHeight;
		    if (wScrollY + wInnerH >= bScrollH) {             
		        container.load_more();
		    }   
		});
	}
});
var pready = false;

mui.ready(function(){
    window.addEventListener('load_message',function(e){
    	layerOpen({
			"title":"",
			"content":"<h4 style='text-align:center;padding-bottom:10px'>掌柜信息</h4><img style='float:left;width:80px;margin-bottom:15px' src='../../images/inner.jpg'><span style='float:left;font-size:12px;padding-left:10px;width:15em;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;'>您有新的消息，请注意查收您有新的消息，您有新的消息，请注意查收您有新的消息，请注意查收您有新的消息，请注意查收</span>",
			"btn":["取消","前往查看"],
			"event":[null,function () {
				//消息中心
				console.log(12312312)
//				if(app.check_login()){
//					app.show_webview_fire("msgCenter","loadinfo",{});
//				}
			}]
		});
   })
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
});

mui.plusReady(function (){
	//定位
    var data = app.get_item("district");
    if(data){
    	data = data.replace("\"","").replace("\"","");
    		container.district = data;
    }
   mui.preload({url:'homeSon/search.html',id:'search'});
	
	
	app.load_conf(function(conf){
		container.classpages = [[[],[]],[[],[]]];
		for(var i =0;i<conf.data.class.data.length;i++)
		{
			if(i<5)
				container.classpages[0][0].push(conf.data.class.data[i]);
			else if(i<10)
				container.classpages[0][1].push(conf.data.class.data[i]);
			else if(i<15)
				container.classpages[1][0].push(conf.data.class.data[i]);
			else
				container.classpages[1][1].push(conf.data.class.data[i]);
		}
		console.log(JSON.stringify(container.classpages));
		setTimeout(function(){
			container.load_data();
		},300);
	
	});
	pready = true;
});

