mui.init();
var ifdefault = '';
function doImg(s){
	c = s.src;
	right = c.substring(c.lastIndexOf("/")+1);
	if(right == "btn_weixuan.png"){
		s.src = "../../images/btn_xuanz.png";
		ifdefault = "yes";
	}else{
		s.src = "../../images/btn_weixuan.png";
	}
}
//省市区
(function($, doc) {
	var cityPicker3 = new $.PopPicker({
		layer: 3
	});
	var _getParam = function(obj, param) {
		return obj[param] || '';
	};
	cityPicker3.setData(cityData3);
	var showCityPickerButton = doc.getElementById('showCityPicker3');
	var inputSelect = $("#showCityPicker3 input")[0];
	showCityPickerButton.addEventListener('tap', function(event) {
		cityPicker3.show(function(items) {
			inputSelect.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
			getid(items[0],items[1],items[2]);
		});
	}, false);
})(mui,document)
//取编号
var idArr = [];
function getid(provid,cityid,areaid) {
	idArr[0] = provid.value;
	idArr[1] = cityid.value;
	idArr[2] = areaid.value;
}
//返回数据
mui("header").on('tap','span',function(){
    username = mui(".username")[0].value;
	phone = mui(".phone")[0].value;
	areaname = mui(".areaname")[0].value;
	address = mui(".address")[0].value;
	var _data = {
		uid: app.get_item("uid"),
		username: username,
		phone: phone,
		provid: idArr[0],
		cityid: idArr[1],
		areaid: idArr[2],
		areaname: areaname,
		address: address,
		ifdefault: ifdefault
	};
	app.http_post('/my/address/add',_data,
		function(ret){
			mui.toast(ret.desc);
			if(ret.code == 200){
				mui(".username")[0].value ='';
				mui(".phone")[0].value ='';
				mui(".areaname")[0].value ='';
				mui(".address")[0].value ='';
				console.log("open"+plus.webview.currentWebview().opener().id);
				mui.fire(plus.webview.currentWebview().opener(),"location_selected",{address:ret.data});
				
				//app.update_opener();
				mui.back();
				plus.webview.close(plus.webview.currentWebview(),"slide-out-right");
				
			}
		},function(x,t,e){
			console.log(e);
			mui.toast(e.desc);
		}
	)
});
