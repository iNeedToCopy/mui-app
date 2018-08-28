mui.init();

var flag = true;
var container = new Vue({
	el:"#container",
	data:{
		order:{},
		ordertype:'',
		orderid:0,
		goods_comment:'',
		goods_imgs:[],
		shop_comment:'',
		shop_imgs:[],
		service_logo:'',
		service_id:0,
		service_nickname:'',
		service_comment:'',
		service_imgs:[]
	},
	methods:{
		getImageStr:function(imgs){
			if(!!imgs.length){
				var imageStr = [];
				for (var i = 0; i < imgs.length; i++) {
					imageStr.push(imgs[i].url);
				}
				return imageStr.join();
			}
			return '';
		},
		reset:function(){
			this.order = {};
			this.ordertype = '';
			this.orderid = 0;
			this.goods_comment = '';
			this.goods_imgs = [];
			this.shop_comment = '';
			this.shop_imgs = [];
			this.service_logo = '';
			this.service_id = 0;
			this.service_nickname = '';
			this.service_comment = '';
			this.service_imgs = []
		},
		load_info:function(orderid,ordertype){
			var _self = this;
			var ordertype = ordertype ? ordertype : 'online';
			_self.orderid = orderid;
			app.http_get("/order/comment?orderid="+orderid+"&ordertype="+ordertype,function(ret){
				if(ret.code == 200){
					console.log(JSON.stringify(ret.data));
					_self.order = ret.data;
				}
				else
					mui.toast(ret.desc);
			},function(x,t,e){});
		},
		take_img:function(_type){
			var _self = this;
			image_uploader.upload('comment',function(data){
				if(data.code == 200){
					if(_type == 1)
						_self.goods_imgs.push({
							url:data.url,
							thumb:data.data.thumb
						});
					else if(_type == 2){
						_self.shop_imgs.push({
							url:data.url,
							thumb:data.data.thumb
						});
					}
					else if(_type == 3){
						_self.service_imgs.push({
							url:data.url,
							thumb:data.data.thumb
						});
					}
				}
			});
		},
		select_service:function(_shopid){
			app.show_webview_fire("selectService","loadinfo",{shopid:_shopid});
		},
		save:function(){
			//获取星星评价，当没有相关信息时，读取星星会报错，try catch处理一下
			var goods_star;
			var shop_star;
			var service_star;
			try{//商品星星
				goods_star = this.$refs.goods_star.star;
			}catch(e){
				goods_star = 0;
			}
			try{//店铺星星
				shop_star = this.$refs.shop_star.star;
			}catch(e){
				shop_star = 0;
			}
			try{//服务人员星星
				service_star = this.$refs.service_star.star;
			}catch(e){
				service_star = 0;
			}
			//order/comment/save
			if(!!this.order.goods.name && this.goods_comment.length == 0){mui.toast('请填写商品评价');return;}
			if(!!this.order.shop.name && this.shop_comment.length == 0){mui.toast('请填写店铺评价');return;}
			if(this.order.service.length>0 && this.service_id != 0 && (this.service_comment.length == 0)){mui.toast('请填写服务评价');return;}
			console.log("join 1");
			var goodsimg_str = this.getImageStr(this.goods_imgs);
			var shopimg_str = this.getImageStr(this.shop_imgs);
			var service_imgs = this.getImageStr(this.service_imgs);
			app.http_post('/order/comment/save',{
				orderid:this.orderid,
				ordertype:this.ordertype,
				
//				goodsid:this.goods.id,
				goodscontent:this.goods_comment,
				goodsimg:goodsimg_str,
				goodsscore:goods_star,
				
//				shopid:this.shop.id,
				shopcontent:this.shop_comment,
				shopimg:shopimg_str,
				shopscore:shop_star,
				
				serviceid:this.service_id,
				servicecontent:this.service_comment,
				servicescore:service_star,
				serviceimg:service_imgs,
			},function(ret){
				mui.toast(ret.desc);
				if(ret.code == 200)
				{
					app.fire_opener('refresh',{});
					mui.back();
				}
			},function(x,t,e){});
		}
	}
});

mui.ready(function(){
	window.addEventListener("loadinfo",function(e){
		container.ordertype = e.detail.ordertype ? e.detail.ordertype : 'online';
		container.load_info(e.detail.orderid);
	});
	window.addEventListener("select_service",function(e){
		container.service_logo = (e.detail.logo);
		container.service_nickname = (e.detail.nickname);
		container.service_id = (e.detail.id);
	});
	window.addEventListener("postId",function(e){
		container.ordertype = e.detail.ordertype ? e.detail.ordertype : 'online';
		container.load_info(e.detail.orderid,e.detail.ordertype);
	})
});
mui.plusReady(function(){
	mui.back = function(){
		container.reset();
		plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
	}
})
