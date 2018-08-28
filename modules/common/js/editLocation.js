mui.init();

function _getParam(obj, param) {
	return obj[param] || '';
}

var cityPicker3 = new mui.PopPicker({
		layer: 3
	});
	
	cityPicker3.setData(cityData3);
	
var container = new Vue({
	el:"#container",
	data:{
		locationMsg:  {
	      "id": 17,
	      "name": "11",
	      "phone": "13980672517",
	      "ifdefault": false,
	      "areaname": "北京市 北京市市辖区 东城区",
	      "address": "马上好",
	      "provindex": 0,
	      "cityindex": 0,
	      "areaindex": 0,
	      "provid": "1",
	      "cityid": "2",
	      "areaid": "3"
	    }
	},
	methods:{
		load_info:function(_id){
			app.http_get('/my/get/address?id='+ _id,
				function(ret){
					if(ret.code == 200){
						container.locationMsg = ret.data[0];
						console.log(JSON.stringify(ret));
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		set_default:function(){
			this.locationMsg.ifdefault = !this.locationMsg.ifdefault;
		},
		select_city:function(){
			var _self = this;
			var provindex = _self.locationMsg.provindex;
			var cityindex = _self.locationMsg.cityindex;
			var areaindex = _self.locationMsg.areaindex;
			cityPicker3.pickers[0].setSelectedIndex(provindex);
			setTimeout(function(){
				cityPicker3.pickers[1].setSelectedIndex(cityindex);
				cityPicker3.pickers[2].setSelectedIndex(areaindex);
			}, 200)
			cityPicker3.show(function(items) {
				_self.locationMsg.areaname = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
				_self.locationMsg.provid = items[0].value;
      			_self.locationMsg.cityid = items[1].value;
      			_self.locationMsg.areaid = items[2].value;
			});	
		},
		save:function(){
			var _data = {
				"username" : this.locationMsg.name,
				"phone" : this.locationMsg.phone,
				"provid" : this.locationMsg.provid,
				"cityid" : this.locationMsg.cityid,
				"areaid" : this.locationMsg.areaid,
				"areaname" : this.locationMsg.areaname,
				"address" : this.locationMsg.address,
				"ifdefault" : this.locationMsg.ifdefault,
				"id" : this.locationMsg.id
			};
			var w = plus.nativeUI.showWaiting("");
			app.http_post('/my/address/modi',_data,
				function(ret){
					w.close();
					mui.toast(ret.desc);
					if(ret.code == 200){
						
						app.update_opener();
						mui.back();
					}
				},function(x,t,e){
					w.close();
					console.log(e)
				}
			)
		}
	},
	computed:{
		default_img:function(){
			return this.locationMsg.ifdefault?"../../images/btn_xuanz.png":"../../images/btn_weixuan.png";
		}
	}
});
	
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		id = event.detail.editId;
		container.load_info(id);
	});
	mui.back = function(event)
	{
	   app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
	
	
});
