mui.init();

var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},
	methods:{
		goto_addShop:function(){
			app.show_webview_fire("addShop","loadinfo",{commerceid: _commerceid});
		},
		load_info:function(){
			app.http_get('/areauser/commerce/shop?commerceid='+_commerceid,
				function(ret){
					console.log(JSON.stringify(ret));
					if(ret.code == 200){
						container.items = ret.data.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		cancel:function(_shopid){
			var btnArray = ['确认', '取消'];
			var _data = {
				"shoplist[]" : _shopid
			};
			mui.confirm('确认取消关联？', '取消关联', btnArray, function(e) {
				if (e.index == 0) {
					app.http_post('/areauser/commerce/shop/modi?commerceid='+_commerceid+'&otype=cancel',_data,
						function(ret){
							if(ret.code == 200){
								container.load_info();
								mui.toast(ret.desc);
							}
						},function(x,t,e){
							console.log(e);
						}
					)
				} else {
					setTimeout(function() {
						mui.swipeoutClose(elem);
					}, 0);
				}
			});
		}
	}
});
var _commerceid = '';
mui.plusReady(function(){
	window.addEventListener('loadinfo',function(event){
		_commerceid = event.detail.commerceid;
		container.load_info();
	});
	//mui.preload({url:'addShop.html',id:'addShop'});
	//mui.preload({url:'myTradeZone.html',id:'myTradeZone'});
})
