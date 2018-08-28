mui.init();
mui('.mui-numbox').numbox();
var container = new Vue({
	el:"#container",
	data:{
		should_add_car:false,//点击确定是否立即加入购物车
		should_buy:false,//点击确定是否立即购买
		size_id: {
			id: 0,
			checked: false
		},//规格对应id
		current_cid:'',
		current_goodsid:'',
		current_regionuid:'',
		slide:{
			small:[]
		},//轮播图
		base_info:{//基本信息
			price:{
				intpart:0,
				floatpart:0 
			}},
		recom:[],//为您推荐
		specs:[],//规格
		goods_sizes:'未选择',
		comments:[],//用户评价
		size_price:{
			price:{
				intpart:0,
				floatpart:0
			}
		},//规格对应价格
		stock: 0,//规格对应库存
		checked_sizes:'',//选择的商品规格
		current_img:1,//滚动当前slide的index
		buy_count:1,
		iscollect:false,//是否收藏
	},
	methods:{
		previewImage:function(index,imgs){//评论点击大图
			var options = {
				current: index,
				indicator: "number",
			};
			plus.nativeUI.previewImage(imgs, options);
		},
		update_amount:function(){//购买数量
			var _self = this;
			setTimeout(function(){
				_self.buy_count = mui(".mui-numbox").numbox().getValue();
			},1);
		},
		load_info:function(id,regionuid,cid,fn){//加载数据，fn为滚动到顶部的回调
			var THIS = this;
			var checked_sizes = [];
			app.http_get('/mall/goods/home?id='+id+'&regionuid='+regionuid+'&cid='+cid,function(res){
				THIS.slide = res.data.slide;
				THIS.base_info = res.data.baseinfo;
				THIS.recom = res.data.recom;
				THIS.comments = res.data.comment;
				THIS.iscollect = res.data.ifcollect;
				for (var i=0;i<res.data.specs.length;i++) {
					for (var j=0;j<res.data.specs[i].list.length;j++) {
						res.data.specs[i].list[j] = {
							name:res.data.specs[i].list[j],
							checked:j === 0 ? true :false
						};
					}
					checked_sizes.push(res.data.specs[i].list[0].name);
				}
				THIS.specs = res.data.specs;
				THIS.checked_sizes = checked_sizes+'';  
				if(fn) fn();
			})
		},
		choose_size:function(){//点击规格选择
			var THIS = this;
			this._change_size(this.current_goodsid,this.checked_sizes.split(',').join('-'),function(){
				mui('.mui-popover').popover('toggle');//show hide toggle
			});
		},
		_change_size:function(id,spec,fn){
			var THIS = this;
			var w = plus.nativeUI.showWaiting();
			app.http_get('/mall/get/stock?id='+id+'&spec='+spec,function(res){
				if(res.code === 200){
					THIS.size_price.price = res.data.price;
					THIS.stock = res.data.stock;
					mui('.mui-numbox').numbox().setOption('max',res.data.stock);
					THIS.size_id.id = res.data.id;
					w.close(); 
					if(fn) fn();
				}
			},function(){
				w.close();
			})
		},
		change_size:function(i,k){//每个item加上checked字段进行区分
			var temp = this.checked_sizes.split(',');
			for (var j=0;j<this.specs[i].list.length;j++) {
				this.specs[i].list[j].checked = false;
			}
			this.specs[i].list[k].checked = true;
			temp[i] = this.specs[i].list[k].name;
			this.checked_sizes = temp+'';
			this._change_size(this.current_goodsid,temp.join('-'));
		},
		goto_recom:function(goodsid){//点击为您推荐切换
			this.current_goodsid = goodsid;
			var w = plus.nativeUI.showWaiting();
			this.load_info(goodsid,this.current_regionuid,this.current_cid,function(){
				scrollTo(0,0);
				w.close();
			}); 
		},
		ok_size:function(){//确定规格
			this.goods_sizes = this.checked_sizes;//确定之后替换‘未选择’
			this.size_id.checked = true;
			if(this.should_add_car) this.submit_car();
			if(this.should_buy) this.buy_now();
			mui('#popover').popover('toggle'); 
		},
		goto_detail:function(){
			var THIS = this;
			var webview = plus.webview.create("market_goods_detail.html", "market_goods_detail", {
			  	hardwareAccelerated:true
			});
			plus.webview.show(webview,"slide-in-right", 300);
            webview.addEventListener('loaded',function(){
				mui.fire(webview,"loadinfo",{
					goodsid: THIS.current_goodsid,
					gname: THIS.base_info.gname 
				});
			});
		},
		//点击遮罩重置should_add_car
		reset_should:function(){
			mui(".mui-backdrop").on('tap',function(){
				console.log('点击了蒙版')
			});
		},
		//全部评论
		goto_allComment:function(){
			app.show_webview_fire("allComment","loadinfo",{type:"mall" ,id:this.current_goodsid});
		},
		//点击加入购物车
		add_car:function(){
			if(!this.size_id.checked){//未选择规格
				this.should_add_car = true;
				this.choose_size();
				return;
			}
			this.submit_car();
		},
		//提交购物车信息
		submit_car:function(){
			var w = plus.nativeUI.showWaiting();
			var THIS = this;
			app.http_get('/mall/shopping/cart/add?id='+this.size_id.id+'&buycount='+this.buy_count,function(res){
				THIS.should_add_car = false;
				mui.toast(res.desc)
				w.close();
			},function(){
				THIS.should_add_car = false;
				w.close();
			},w); 
		},
		pay_now:function(){
			if(!this.size_id.checked){//未选择规格
				this.should_buy = true;
				this.choose_size();
				return;
			}
			this.buy_now();
		},
		buy_now:function(){//立即购买先加入购物车，加上字段immediately=yes，然后拿到数据再进入提交订单页面
			var w = plus.nativeUI.showWaiting();
			var THIS = this;
			app.http_get('/mall/shopping/cart/add?id='+this.size_id.id+'&buycount='+this.buy_count+'&immediately=yes',function(res){
				w.close();
				THIS.should_buy = false;
				if(res.code == 200){
					var _data = {
						updatestr: [{
							id: res.data.lastid,
							count: THIS.buy_count
						}],//需要转码
						cardidlist: res.data.lastid//勾选则购物车id,需要转码
					}
					_data.updatestr = JSON.stringify(_data.updatestr);
					app.http_post('/mall/shopping/cart/settle/info',_data,function(res){
						if(res.code == 200){
							app.show_webview_fire('submit_order','loadinfo',{
								data:res.data,
								cardidlist:_data.cardidlist
							});
						}else{
							w.close()
						}
					},function(){
						w.close(); 
						mui.toast('服务器异常')
					})
				};  
			},function(){
				THIS.should_buy = false;
				w.close();
			},w); 
		},
		//收藏
		collect:function(){
			var THIS = this;
			app.http_get('/mall/goods/collect?id='+this.current_goodsid,function(res){
				app.json(res);
				if(res.code == 200){
					mui.toast(res.desc);
					if(res.desc == '收藏成功') THIS.iscollect = true;
					if(res.desc == '取消收藏成功') THIS.iscollect = false;
				}else{
					mui.toast('服务器异常');
				}
			},function(){
				mui.toast('服务器异常');
			})
		}
	}, 
	updated:function(){ 
		mui('.mui-slider').slider({
			interval:0//自动轮播周期，若为0则不自动播放，默认为0；
		});
		document.querySelector('.mui-slider').addEventListener('slide', function(event) {
		    //注意slideNumber是从0开始的；
		    container.current_img = event.detail.slideNumber+1;
		});
		
	},
});
mui.ready(function(){
	window.addEventListener('send_id',function(e){
		container.current_goodsid = e.detail.goodsid;
		container.current_regionuid = e.detail.regionuid;
		container.current_cid = e.detail.cid;
		setTimeout(function(){
			container.load_info(e.detail.goodsid,e.detail.regionuid,e.detail.cid); 
		},200)
	});
	//关闭蒙版
	mui("#popover-preferential .title").on('tap','img',function(){
		mui("#popover-preferential").popover('hide');
	});
	mui.back = function(){
		var opener = plus.webview.getWebviewById('shopping_car');
		mui.fire(opener,'loadinfo',{should_reset:true});
	   	plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	}
})
