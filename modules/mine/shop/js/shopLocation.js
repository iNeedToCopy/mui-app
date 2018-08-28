//地图配置
//var em=null,map=null;
var shop_point = null;
var container = new Vue({
	el:'#container',
	data:{
		provid:-1,
		cityid:-1,
		areaid:-1,
		short_addr:'',
		addr:'',
		lng:0,
		lat:0
	},methods:{
		select_short_addr:function(){
			var _self = this;
			var cityPicker3 = new mui.PopPicker({
				layer: 3
			});
			//map.hide();
			cityPicker3.setData(cityData3);
			cityPicker3.show(function(items){
				
				var _getParam = function(obj, param) {
						return obj[param] || '';
				};
				_self.short_addr = ((items[0])?items[0].text:'') + '-'+((items[1])?items[1].text:'')+'-'+((items[2])?items[2].text:'');
				_self.provid = (items[0])?(items[0]).value:-1;
				_self.cityid = (items[1])?(items[1]).value:-1;
				_self.areaid = (items[2])?(items[2]).value:-1;
				//value
			},function(){
				//map.show();
			});
		},
		save:function(){
			if(this.provid == -1){mui.toast("请选择 省/市/县");return;}
			if(this.addr.length == 0){mui.toast("请填写详细地址");return;}
			
//			var v = plus.webview.currentWebview().opener();
			var v = plus.webview.getWebviewById("shopApp");
			mui.fire(v,'set_addr',{
				provid:this.provid,
				cityid:this.cityid,
				areaid:this.areaid,
				addr:this.addr,
				lng:this.lng,
				lat:this.lat
			});
			mui.back();
		}
	}
});

mui.ready(function(){
	window.addEventListener('reset',function(event){
		container.provid = -1;
		container.cityid = -1;
		container.areaid = -1;
		container.short_addr = '';
		container.addr = '';
		container.lng = 0;
		container.lat = 0;
	});
})

mui.plusReady(function(){
	//map = new plus.maps.Map("map");
	container.lng = app.get_item("lng");
	container.lat = app.get_item("lat");
	//shop_point = new plus.maps.Point(container.lng,container.lat);
	
	//var markObj = new plus.maps.Marker(shop_point);

	//markObj.setIcon("../../../images/shop_location.png");
	//map.addOverlay(markObj);
	
	//if(container.lng && container.lat){
	//	shop_point.setLng(container.lng);
	//	shop_point.setLat(container.lat);
		
		//map.centerAndZoom(shop_point, 13 ); 
	//}
	
//	map.getUserLocation(function( state, point ) {
//		if(state == 0)
//		{
//			container.lng = point.lng;
//			container.lat = point.lat;
//			map.centerAndZoom(point, 13 );
//		}
//	});
//	map.onstatuschanged = function( event ){
//		var center = event.center;
//		markObj.setPoint(center);
//		container.lng = center.getLng();
//		container.lat = center.getLat();
//	}
//	map.onclick = function(point){
//		map.centerAndZoom(point, 13 );
//	};
});
