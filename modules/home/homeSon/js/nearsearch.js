mui.init();
var titleNView = {
    backgroundColor: '#f7f7f7',
    titleText: '商品详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    }
}

var container = new Vue({
	el:"#container",
	data:{
		items:[],
		code:'',
		classid:0,
		distance:"",
		sort:0,
		filter:""
	},
	methods:{
		reset:function(){
			this.classid=0;
			this.distance="";
			this.sort=0;
			this.filter="";
			this.items = [];
		},
		load_info:function(){
			this.items = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},200);
			
		},
		append:function(data){
			container.items = container.items.concat(data.data);
		},
		goto_shop:function(_shopid){ 
			app.show_webview_fire("shopDetail","loadinfo",{shopid: _shopid});
		},
		goto_goods_details:function(_goodsid){
			if(_goodsid !=0){
				var v = app.open_webview("../../common/goodsDetail.html","goodsDetail",{titleNView:titleNView});
				mui.fire(v,"loadinfo",{goodsid:_goodsid});
			}
		},
		category_changed:function(cid){
			this.classid = cid;
			var _self = this;
			setTimeout(function(){_self.load_info();},200);
		},
		distance_changed:function(distance){
			this.distance=distance;var _self = this;
			setTimeout(function(){_self.load_info();},200);
		},
		sort_changed:function(sort){
			this.sort = sort;var _self = this;
			setTimeout(function(){_self.load_info();},200);
		},
		filter_changed:function(filter){
			this.filter = filter;var _self = this;
			setTimeout(function(){_self.load_info();},200);
		},
	}
}); 
mui.ready(function(){
	window.addEventListener("loadinfo",function(e){
		app.load_conf(function(conf){
			container.$refs.filter.init(conf);
		});
		container.$refs.filter.reset();
		
		container.classid = e.detail.cid;
		console.log(container.classid);
		container.load_info();
	});
	mui.back = function(){
		container.reset();

		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	}
});

mui.plusReady(function(){
	
});



	



