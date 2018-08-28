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
	app.show_webview_fire('shopping_car','loadinfo',{})
}
var container = new Vue({
	el:"#container",
	data:{
		isshop: true,
		items:[],
		order_status:[
			{status:"店铺收藏",active:true,isshop_:true},
			{status:"商品收藏",active:false,isshop_:false},
		]
	},
	methods:{
		reset:function(){
	       	this.items=[];
	       	this.isshop=true;
	       	this.order_status=[
				{status:"店铺收藏",active:true,isshop_:true},
				{status:"商品收藏",active:false,isshop_:false},
			];
		},
		change_status:function(item){
			this.isshop = item.isshop_;
			this.$refs.pullup.object = item.isshop_ ? '/my/coll/shop' : '/mall/coll/goods';
			this.isloading = true;
			for (var i=0;i<this.order_status.length;i++) {
				if(this.order_status[i].status == item.status){
					this.order_status[i].active = true;
				}else{
					this.order_status[i].active = false;
				}
			}
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		goto_shopDetail:function(e){
			if(this.isshop){
				app.show_webview_fire("shopDetail","loadinfo",{shopid: e.id});
				return;
			}
			var THIS = this;
			var webview = plus.webview.create("/modules/market/market_goods.html", "market_goods", {
			  	titleNView:title_market
			});
			plus.webview.show(webview,"slide-in-right", 300);
            webview.addEventListener('loaded',function(){
				mui.fire(webview,"send_id",{
					goodsid: e.id,
					regionuid: app.get_item('regionuid'),
					cid: e.cid,
				});
			});
		},
		reload:function(){
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			this.items = this.items.concat(data.data); 
		}
	}
})


mui.ready(function(){
    window.addEventListener('loadinfo',function(event){
        container.reload();
    });
    window.addEventListener('reset',function(event){
        container.reset();
    });
    
    mui.back = function(event)
    {
    	container.reset();
       	plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});
