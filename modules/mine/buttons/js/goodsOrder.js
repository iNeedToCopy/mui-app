
mui('.mui-scroll-wrapper').scroll();
mui.init();

var container = new Vue({
    el:'#container',
    data:{
    	qtype:"now",
        items:[],
        offline_orders:[],
        online_orders:[]
    },
    methods:{
	    	load_online:function(){
	    		container.online_orders=[];
	    		var _self = this;
				setTimeout(function(){
					_self.$refs.online_order.newrequest();
				},100);
	    	},
	    	load_offline:function(){
	        	container.offline_orders=[];
	    		this.$refs.offline_order.newrequest();
	    	},
	    gotoDetail:function(orderid){
	    	app.show_webview_fire("orderDetail",'loadinfo',{orderid:orderid,is_seller:false});
	    },
	    append_online:function(data){ 
	    	this.online_orders =  this.online_orders.concat(data.data);
	    },
	    append_offline:function(data){
	    	this.offline_orders =  this.offline_orders.concat(data.data); 
	    },
	    goto_appraise:function(id,ifablecomment){
	    	if(!!ifablecomment){ 
	    		app.show_webview_fire("comment",'postId',{orderid:id,ordertype:'offline'});
	    	}
	    }
    }
});

mui.ready(function(){
    window.addEventListener('loadinfo',function(event){
        container.online_orders=[];
        container.offline_orders=[];
        container.load_online();
    });
    
    mui.back = function(event)
    {
       plus.webview.close(plus.webview.currentWebview(),'slide-out-right');
    };
    
//  //打开订单详情页面(到店)
//	mui("#goodsOrder").on('tap','.pic',function(){
//		mui.openWindow({
//			url:'orderDetailShop.html',
//			id:'orderDetailShop.html',
//			show:{
//				aniShow:'silde-in-right'
//			}
//		})
//	})
//	//打开订单详情页面(上门)
//	mui("#payOrder").on('tap','li',function(){
//		mui.openWindow({
//			url:'orderDetailWait.html',
//			id:'orderDetailWait.html',
//			show:{
//				aniShow:'silde-in-right'
//			}
//		})
//	})
	//小tab
	mui(".list").on('tap','li',function(){
		if(this.childNodes[0].innerText=="全部"){
			//清除
			var li = this.previousElementSibling;
			var span1 = li.childNodes;
			span1[0].classList.remove("current3");
			//添加
			var span2 = this.childNodes;
			span2[0].classList.add("current3");
			container.qtype="all";
			container.load_online();
			//mui("#being")[0].classList.add("hide");
			//mui("#All")[0].classList.remove("hide");
		}else{
			//清除
			var li = this.nextElementSibling;
			var span3 = li.childNodes;
			span3[0].classList.remove("current3");
			//添加
			var span4 = this.childNodes;
			span4[0].classList.add("current3");
			//mui("#All")[0].classList.add("hide");
			//mui("#being")[0].classList.remove("hide");
			container.qtype="now";
			container.load_online();
		}
	});
	//大tab
	mui(".title").on('tap','div',function(){
		if(this.childNodes[1].innerText=="支付订单"){
			//清除
			mui(".title .left")[0].classList.remove("current1")
			mui(".title .left")[0].childNodes[1].classList.remove("current2");
			//添加
			mui(".title .right")[0].classList.add("current1");
			mui(".title .right")[0].childNodes[1].classList.add("current2");
			mui("#payOrder")[0].classList.remove("hide");
			mui("#goodsOrder")[0].classList.add("hide");
			container.load_offline();
		}else{
			//清除
			mui(".title .right")[0].classList.remove("current1")
			mui(".title .right")[0].childNodes[1].classList.remove("current2");
			//添加
			mui(".title .left")[0].classList.add("current1");
			mui(".title .left")[0].childNodes[1].classList.add("current2");
			mui("#goodsOrder")[0].classList.remove("hide");
			mui("#payOrder")[0].classList.add("hide");
			container.load_online();
		}
	})
	
});

mui.plusReady(function(){
	//mui.preload({url:'orderDetail.html',id:'orderDetail'});
});