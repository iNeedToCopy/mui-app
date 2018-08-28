mui.init();	

var show = new Vue({
	el:"#show",
	data:{
		shopName:"",
		location:"",
		navs:[]
	},
	methods:{
		transformAxes:function(gg_lng, gg_lat){//高德坐标转百度
			var X_PI = Math.PI * 3000.0 / 180.0;  
		    var x = gg_lng, y = gg_lat;  
		    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);  
		    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);  
		    var bd_lng = z * Math.cos(theta) + 0.0065;  
		    var bd_lat = z * Math.sin(theta) + 0.006;  
		    return {  
		        bd_lat: bd_lat,  
		        bd_lng: bd_lng  
		    }; 
		},
		addMarker:function(lat,lng){
			 var map = new AMap.Map('amap', {
			    resizeEnable: true,
			    zoom:15,
			    center: [lng, lat]
			});
			// 创建 AMap.Icon 实例：
			var icon = new AMap.Icon({
			    imageSize: new AMap.Size(30, 40),   // 根据所设置的大小拉伸或压缩图片
			    size: new AMap.Size(30, 40),   // 图标尺寸
			    image: '../../images/shop_location.png',  // Icon的图像
			});
		    // 将 Icon 实例添加到 marker 上:
			var marker = new AMap.Marker({
			    position: new AMap.LngLat(lng, lat),
			    icon: icon, // 添加 Icon 实例
			    zoom: 15
			});
			map.add(marker);
		},
		reset:function(){
			this.navs = [];
		},
		openMaps:function(){
			var btns = this.navs;
			if(btns.length>0){
				plus.nativeUI.actionSheet({cancel:"取消",buttons:btns},
					function(e){
						var title = (e.index>0)?btns[e.index-1].title:"取消";
						if(title != '取消') window.location = btns[e.index-1].href;
					}
				);
			}else{
				// 弹出系统提示对话框
				plus.nativeUI.alert( "未检测到您设备上的导航软件，请下载百度/高德地图进行导航", function(){},"","OK" );
			}
		},
		checkMaps:function(lat,lng,name){
    		show.reset();//重置地图信息
			var ua = navigator.userAgent;// 获取当前设备信息
			if(ua.search('Android') != -1){//判断Android已安装地图
				if(plus.runtime.isApplicationExist({pname:'com.baidu.BaiduMap'})){//百度地图
					var axes = show.transformAxes(lng,lat);//坐标转换
					var href_ = encodeURI('bdapp://map/direction?destination=latlng:'+axes.bd_lat+','+axes.bd_lng+'|name:'+name+'&mode=driving');
					this.navs.push({
						title:'百度地图',
						href:href_//`bdapp://map/direction?destination=latlng:${axes.bd_lat},${axes.bd_lng}|name:${name}&mode=driving`
					})
				}
				if(plus.runtime.isApplicationExist({pname:'com.autonavi.minimap'})){
					var href__ = encodeURI('androidamap://navi?sourceApplication=海掌柜&poiname='+name+'&lat='+lat+'&lon='+lng+'&dev=0&amp;style=2');
		        	this.navs.push({
						title:'高德地图',
						href:href__//`androidamap://navi?sourceApplication=海掌柜&poiname=${name}&lat=${lat}&lon=${lng}&dev=0&amp;style=2`
					})
				}
			}else{//ios
				var UIApplication = plus.ios.importClass("UIApplication");
				var NSURL = plus.ios.importClass("NSURL");
				var app_ = UIApplication.sharedApplication();
				var bdScheme = NSURL.URLWithString("baidumap://");//百度scheme
				var gdScheme = NSURL.URLWithString("iosamap://");//高德scheme
				var hasBadiu = app_.canOpenURL(bdScheme);
				var hasGaode = app_.canOpenURL(gdScheme);
				if (hasBadiu) {//百度
					var axes = show.transformAxes(lng,lat);//坐标转换
					var href_ = encodeURI('baidumap://map/navi?location='+axes.bd_lat+','+axes.bd_lng+'&src=push&type=BLK&src=webapp.line.yourCompanyName.海掌柜')
					this.navs.push({
						title:'百度地图',
						href:href_//`baidumap://map/navi?location=${axes.bd_lat},${axes.bd_lng}&src=push&type=BLK&src=webapp.line.yourCompanyName.海掌柜`
					})
		        }
		        if(hasGaode){//高德
		        	var href_ = encodeURI('iosamap://navi?sourceApplication=海掌柜&poiname='+name+'&lat='+lat+'&lon='+lng+'&dev=0&amp;style=2')
		        	this.navs.push({
						title:'高德地图', 
						href:href_//`iosamap://navi?sourceApplication=海掌柜&poiname=${name}&lat=${lat}&lon=${lng}&dev=0&amp;style=2`
					})
		        }
			}
		}
	}
})
mui.ready(function(){
	window.addEventListener('setinfo',function(e){
		//标点
		show.addMarker(e.detail.lat,e.detail.lng);
		show.shopName = e.detail.name;
		show.location = e.detail.addr;
		setTimeout(function(){
			//进入页面延迟获取已安装地图信息
			show.checkMaps(e.detail.lat,e.detail.lng,e.detail.name);
		},200)
	});
	mui.back = function(event)
    {
    	show.reset();
        plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});


	
		

