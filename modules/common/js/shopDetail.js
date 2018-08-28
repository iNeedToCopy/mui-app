mui.init({
    statusBarBackground: '#f7f7f7',
    preloadPages: [
	    {
	        url: "../home/homeSon/tradeZoneDetail.html",
	        id: "tradeZoneDetail"
	    },
	    {
	    	url: "goodsDetail.html",
	        id: "goodsDetail"
	    }
    ]
});
var titleNView1 = {
    backgroundColor: '#f7f7f7',
    titleText: '商圈详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    }
}
var titleNView2 = {
    backgroundColor: '#ffffff',
    titleText: '商品详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    }
}
var shopDetail = new Vue({
	el:'#container',
	data:{
		shopid:0,
		baseinfo: {
	      id: 0,
	      receivecode:0,
	      name: "",
	      addr: "",
	      logo:"../../images/placeholder.png",
	      phone: "",
	      lng: 0,
	      lat: 0,
	      allscore: 0,
	      distance: 0,
	      perprice: 0,
	      classname: "",
	      discount: 0,
	      ifcollect: false,
	      shopcount: 0,
	      imgcount: 0,
	      imgopenurl: "",
	      worktime: "",
	      tag: []
    },
    hot: {
      amount: 0,
      data: []
    },
    choice: {
      amount: 0,
      data: []
    },
    low: {
      amount: 0,
      data: []
    },
    service: {
      amount: 0,
      data: []
    },
    cash: {
      data: [],
      "amount": 0
    },
    hongbao: [
    {
        minmoney: 0,
        sendmoney: 0
    },
    {
        minmoney: 0,
        sendmoney: 0
    }
    ],
    commerce: {
    	id: 0,
      	name: "",
      	logo: ""
    },
    comment: {
      total: 0,
      allscore: 0
    },
    relateshop: [],
    qiang:true
	},
	methods:{
		set_qiang:function(_value){
			this.qiang = _value;
		},
		reset:function(){
			this.baseinfo = {
			      id: 0,
			      name: "",
			      addr: "",
			      receivecode:0,
			      logo:"../../images/placeholder.png",
			      phone: "",
			      lng: 0,
			      lat: 0,
			      allscore: 0,
			      distance: 0,
			      perprice: 0,
			      classname: "",
			      discount: 0,
			      ifcollect: false,
			      shopcount: 0,
			      imgcount: 0,
			      imgopenurl: "",
			      worktime: "",
			      tag: []
		   };
		   this.qiang = true;
		   this.hot={
		      amount: 0,
		      data: []
		   };
		    this.choice={
		      amount: 0,
		      data: []
		    };
		    this.low={
		      amount: 0,
		      data: []
		    };
		    this.service={
		      amount: 0,
		      data: []
		    };
		    this.cash={
		      data: [],
		      amount: 0
		    };
		    this.comment={
		      total: 0,
		      allscore: 0
		    };
		    this.hongbao=[
		    {
		        minmoney: 0,
		        sendmoney: 0
		    },
		    {
		        minmoney: 0,
		        sendmoney: 0
		    }
		    ];
		    this.commerce={
		    	id: 0,
		      	name: "",
		      	logo: ""
		    };
		},
		collect_shop:function(){
			var _self = this;
			app.http_get('/shop/collect?shopid='+this.shopid+'&uid=619796793',function(data){
				if(data.code == 200)
					_self.baseinfo.ifcollect = !_self.baseinfo.ifcollect;
				mui.toast(data.desc);
			},function(a,b,c){});
		},
		goto_shopService:function(){var v = app.show_webview_fire('shopService','loadinfo',{shopid:shopDetail.shopid});},
		goto_singleHot:function(){var v = app.show_webview_fire('singleHot','loadinfo',{shopid:shopDetail.shopid});},
		goto_onSale:function(){
			app.show_webview_fire("onSale","loadinfo",{shopid:shopDetail.shopid});
		},
		goto_otherShop:function(){
			app.show_webview_fire("otherShop","loadinfo",{shopid:shopDetail.shopid});
		},
		goto_tradeZoneDetail:function(zone_id){
//			app.show_webview_fire('tradeZoneDetail','loadinfo',{'zone_id':zone_id,titleNView: titleNView});
   			var v = plus.webview.create("../home/homeSon/tradeZoneDetail.html","tradeZoneDetail", {titleNView: titleNView1});
            plus.webview.show(v,"slide-in-right",300);
            mui.fire(v,"loadinfo",{'zone_id':zone_id});
		},
		goto_voucher:function(){var v = app.show_webview_fire('seeAllVoucher','loadinfo',{shopid:shopDetail.shopid});},
		call_phone:function(phone){
			plus.device.dial(phone);
		},
		goto_map:function(_lng,_lat,_name,_addr){ 
			app.show_webview_fire("seeShopLocation","setinfo",{lng:_lng,lat:_lat,name:_name,addr:_addr});
		},
		userpay:function(code){
			if(code == 0){
				return;
			}
			if(app.check_login()) {
				var v = app.open_webview("/modules/common/buy/userPay.html", "userPay");
				setTimeout(function() {
					mui.fire(v, "init", {
						code: code
					});
				}, 200);
			}
		},
		goto_detail:function(_shopid)
		{
			var v = app.open_webview("shopDetail.html","shopDetail2"); 
			mui.fire(v,"loadinfo",{shopid:_shopid});
		},
		goto_allComment:function(){
			app.show_webview_fire("allComment","loadinfo",{type:"shop",id:this.baseinfo.id});
		},
		show_servicedetail:function(_id){
			app.show_webview_fire('serviceDetail','loadinfo',{id:_id});	
		},
		goto_goodsdetail:function(_goods_id)
		{
			var THIS = this;
			var v = plus.webview.create("goodsDetail.html","goodsDetail", {titleNView: titleNView2});
            plus.webview.show(v,"slide-in-right",300);
//          mui.fire(v,"loadinfo",{goodsid: _goods_id});
            v.addEventListener('loaded',function(){
				mui.fire(v,"loadinfo",{//baseinfo.lng,baseinfo.lat,baseinfo.name,baseinfo.addr
					goodsid: _goods_id,
					lng:THIS.baseinfo.lng,
					lat:THIS.baseinfo.lat,
					name:THIS.baseinfo.name,
					addr:THIS.baseinfo.addr
				});
			});
		},
		get_cash:function(cash_id){
			app.http_get("/gain/cash?cashid="+cash_id,function(ret){
				mui.toast(ret.desc);
			});
		}
	}
});

mui.ready(function(){   		
	window.addEventListener('loadinfo',function(event){
		var shopid = event.detail.shopid;
		shopDetail.shopid = shopid;
		window.scrollTo(0,0);
		//alert(shopid);
		 var w = plus.nativeUI.showWaiting();
		app.http_get("/shop/home?shopid="+shopDetail.shopid,function(ret){
			//console.log(JSON.stringify(ret))
			w.close();
			if(ret.code == 200){
				shopDetail.baseinfo = ret.data.baseinfo;
				shopDetail.service = ret.data.service;
				shopDetail.hot = ret.data.hot;
				shopDetail.relateshop = ret.data.relateshop;
				shopDetail.choice = ret.data.choice;
				shopDetail.low = ret.data.low;
				shopDetail.comment = ret.data.comment;
				shopDetail.commerce = ret.data.commerce;
				shopDetail.cash = ret.data.cash;
			}
			else
			{
				mui.toast(ret.desc);
				mui.back();
				return;
			}	
		},function(x,t,e){w.close();});
	});
	
	mui.back = function(event)
	{
	   shopDetail.reset();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
	
	//打开图片url
	setTimeout(function(){
		mui(".goods").on('tap','.logoImg',function(){
			var curHef = this.parentNode.firstChild.innerText;
			mui.openWindow({
				url: curHef,
				id: curHef,
				show: {
					aniShow: 'slide-in-right'
				}
			})
		});
	},100);
});

mui.plusReady(function(){
	
});
