function sortCompareEntry( a, b ) {
	if ( a.isDirectory && b.isFile ) {
		return -1;
	} else if ( a.isFile && b.isDirectory ) {
		return 1;
	} else {
		return a.name - b.name;
	}
}


function preload_page_in_dir(entry,_id,cb)
{
	var dirReader = entry.createReader();
	dirReader.readEntries( function( entries ) {
		entries.sort(sortCompareEntry);//按类型排序
		for(var idx in entries)
		{
			var e = entries[idx];
			if(e.isDirectory)
				preload_page_in_dir(e,_id,cb);
			else
			{
				if(e.name.indexOf(".html", e.name.length - 5) !== -1)
				{
					var _url = "file://"+e.fullPath;
					var _id_ = e.name.replace(".html","");
					//console.log(_id_);
					if(_id == _id_){
						//console.log("调用页:"+window.location.href);
						//console.log("动态加载页面:"+_url);
						//var v = plus.webview.create(_url, _id);
						var v = mui.preload({url:_url,id:_id})
						plus.webview.hide(v);
						//console.log(v.id + " => " + _url);
						cb(v);
						break;
					}
					
				}
			}
				
		}
		
	}, function ( e ) {
		
	} );
}

var app = {
	
	current_timestamp:function(){
		return Date.parse(new Date());
	},
	show_webview: function(id) {/*打开一个新窗口，以从右向左滑动的方式展示*/
		var v = plus.webview.getWebviewById(id);
		if(v != null) {
			plus.webview.show(v, "slide-in-right", 300);
			mui.fire(v, "active", {});
		} else
			console.log(id + "不存在");
	},
	show_webview_fade: function(id) {
		var v = plus.webview.getWebviewById(id);
		if(v != null) {
			plus.webview.show(v, "fade-in", 100);
			mui.fire(v, "loadinfo", {});
		} else
		{
			console.log("null");
			plus.io.resolveLocalFileSystemURL("_www/modules/", function (entry) {
				preload_page_in_dir(entry,id,function(vv){
					setTimeout(function() {
						mui.fire(vv, "loadinfo", {});
						//mui.fire(vv, event_name, parameters);
						plus.webview.show(vv, "fade-in", 100);
					}, 100);
				});
			});
		}
	},
	open_webview: function(_url, _id, parameters) {
		var v = plus.webview.getWebviewById(_id);
		if(v == null)
			v = plus.webview.create(_url, _id, parameters);
		plus.webview.show(v, "slide-in-right", 300);
		mui.fire(v, "active", {});
		return v;
	},
	load_webview: function(_url, _id) {
		var v = plus.webview.getWebviewById(_id);
		if(v == null)
			v = plus.webview.create(_url, _id);
		plus.webview.hide(v, "slide-in-right", 300);
		return v;
	},
	open_webview_fire: function(_url, _id, event_name, parameters,style) {
		var v = plus.webview.getWebviewById(_id);
		if(v == null)
			v = plus.webview.create(_url, _id,style);
		plus.webview.show(v, "slide-in-right", 300);
		v.addEventListener('loaded',function(){
			mui.fire(v, "active", {});
			mui.fire(v, event_name, parameters);
		});
		return v;
	},
	show_webview_fire: function(_id, event_name, parameters) {
		var v = plus.webview.getWebviewById(_id);
		if(v == null) {
			plus.io.resolveLocalFileSystemURL("_www/modules/", function (entry) {
				preload_page_in_dir(entry,_id,function(vv){
					plus.webview.show(vv, "slide-in-right", 300);
					setTimeout(function() {
						mui.fire(vv, "active", {});
						mui.fire(vv, event_name, parameters);
					}, 1000);
				});
			});
		}
		else{
			setTimeout(function() {
				mui.fire(v, "active", {});
				mui.fire(v, event_name, parameters);
				plus.webview.show(v, "slide-in-right", 300);
			}, 100);
		}
	},
	dg: function(_id) {
		return document.getElementById(_id);
	},
	/*为元素增加一个手指点击事件处理函数*/
	tap: function(_id, _handler) {
		//		this.dg(_id).addEventListener('tap',_handler);
	},
	scanqr: function() {
		var v = plus.webview.getWebviewById("scanqr");
		if(v == null) {
			v = plus.webview.create("/modules/common/scanqr.html", "scanqr");
		}
		plus.webview.show(v, "slide-in-bottom", 300);
		mui.fire(v, "show", {});
		return v;
	},
	http_get: function(_object, _success_callback, _error_callback,showWaiting) {
		if(_object == "no") {
			if(_error_callback)
				_error_callback({}, {}, {});
			return;
		}
		var default_data = {
			lng: app.get_item("lng"),
			lat: app.get_item("lat"),
			citycode: app.get_item("citycode"),
			postalCode:app.get_item("postalCode"),
			uid: app.get_item("uid"),
			district: app.get_item("district"),
			width:plus.screen.resolutionWidth,
			height:plus.screen.resolutionHeight,
			os:plus.os.name,
			uuid:plus.device.uuid,
			vendor:plus.device.vendor,
			imsi:plus.device.imsi.join(),
			imei:plus.device.imei,
			random:Math.random(),
			regionuid:app.get_item("regionuid"),
		};
		console.log(_object);
		if(_object == null)
			console.log(_error_callback);
		var _url = "";
		if(_object.substr(0, 4) == "http")
			_url = _object;
		else
			_url = "http://" + this.get_item("domain") + _object;

		//console.log("发起页面:" + window.location.href);
		console.log(_url);
		mui.ajax(_url, {
			headers: {
				token: app.get_item("token")
			},
			async: true,
			dataType: 'json',
			type: 'get',
			data: default_data,
			timeout: 10000,
			success: function(data) {
				if(data.code == 201)
					app.login();
				else
					_success_callback(data);
					
				plus.nativeUI.closeWaiting();
				if (showWaiting) showWaiting.close();//登录之前如果开启了showWaiting，需要在这里close掉 
			},
			error: function(xhr, type, errorThrown) {
				if(_error_callback)
					_error_callback(xhr, type, errorThrown);
				else
					console.log("http_get error: " + _url+xhr.responseText);
			}
		});
	},
	http_post: function(_object, _data, _success_callback, _error_callback) {
		var _url = "http://" + this.get_item("domain") + _object;
		var default_data = {
			lng: app.get_item("lng"),
			lat: app.get_item("lat"),
			citycode: app.get_item("citycode"),
			postalCode:app.get_item("postalCode"),
			uid: app.get_item("uid"),
			district: app.get_item("district"),
			width: plus.screen.resolutionWidth,
			regionuid: app.get_item("regionuid"),
		};

		mui.extend(default_data, _data);
		console.log(_url);
		
		mui.ajax(_url, {
			headers: {
				token: app.get_item("token")
			},
			dataType: 'json',
			type: 'post',
			data: default_data,
			timeout: 10000,
			success: function(data) {
				_success_callback(data)
			},
			error: function(xhr, type, errorThrown) {
				_error_callback(xhr, type, errorThrown);
			}
		});
	},
	/*在手机上存储一个键值对，比如姓名，手机号等*/
	save_item: function(_key, _value) {
		plus.storage.setItem(_key, _value);
	},
	/*和save_item对应，根据键名获取值*/
	get_item: function(_key) {
		//console.log(_key);
		return plus.storage.getItem(_key);
	},
	translatePoint: function(pos) {
		console.log("定位成功:" + pos.coords.longitude + "," + pos.coords.latitude);

		app.save_item("lng", pos.coords.longitude.toString());

		app.save_item("lat", pos.coords.latitude.toString());
		if(pos.address != undefined && pos.address.cityCode != undefined)
			app.save_item("citycode", pos.address.cityCode);
		if(pos.address != undefined)
			app.save_item("district", pos.address.district);
		if(pos.address != undefined)
			app.save_item("postalCode", pos.address.postalCode);
	},
	/*刷新当前位置*/
	refresh_location: function() {
		plus.geolocation.getCurrentPosition(this.translatePoint, function(e) {
			mui.toast("定位当前位置失败" + e.message);
		},{
			provider: "amap"
		});
	},
	login: function() {
		this.show_webview_fade("login");
	},
	logout: function() {
		app.http_get("/exit", function(ret) {
			console.log(ret.desc);
			plus.storage.removeItem("token");
			plus.storage.removeItem("uid");
			plus.storage.removeItem("username");
			plus.storage.removeItem("usertype");
			plus.storage.removeItem("need_bind_phone");
			plus.storage.removeItem("ifViewMyRegion");
			plus.storage.removeItem("ifViewApplySeller");
		}, function(a, b, c) {
			console.log(b);
		});
	},
	check_login: function() { /*检查当前是否是登录状态,如果未登录则打开登录页面*/
		if(this.get_item("token") == null || this.get_item("uid") == null) {
			this.login();
			return false;
		} else
		{
			if(app.get_item("need_bind_phone") =="true"){
				app.show_webview_fade("bind_phone");
			}
			else
				return true;
		}
			
	},
	update_opener: function() { /*向上级页面发送更新通知*/
		var v = plus.webview.currentWebview().opener();

		mui.fire(v, "active", {});
		mui.fire(v, "loadinfo", {});
	},
	fire_opener: function(event_name,arguments) { /*向上级页面发送事件*/
		var v = plus.webview.currentWebview().opener();
		mui.fire(v, event_name, arguments);
	},
	load_conf: function(callback /*加载完成配置文件并回调 参数1:解析后的json*/ ) /*加载配置文件*/ {
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			fs.root.getFile("config.json", {}, function(entry) {
				var reader = null;
				entry.file(function(file) {
					reader = new plus.io.FileReader();
					reader.onloadend = function(e) {
						var conf = JSON.parse(e.target.result);
						//解析配置
						callback(conf);
					};
					reader.readAsText(file);
				}, function(e) {
					callback(null);
				});
			}, function(e) {
				callback(null);
			});
		}, function(e) {
			callback(null);
		});
	},
	upload_image: function(image_fullpath, uploadtype, onsuccess, onfailed) {
		//上传到服务端
		var wt = plus.nativeUI.showWaiting();
		var url = 'http://' + app.get_item("domain") + '/upload/image?uid=' + app.get_item("uid") + '&uploadtype=verify';
		var task = plus.uploader.createUpload(url, {
				method: "POST"
			},
			function(t, status) {
				if(status == 200) {
					wt.close();
					

				} else {
					wt.close();
					console.log(data.desc);
				}
			}
		);
		task.setRequestHeader("token", app.get_item("token"));
		task.addFile(image_fullpath, {
			key: "file"
		});
		task.start();
	},
	capture_image: function() { //点击拍照
		var c = plus.camera.getCamera();
		c.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				var s = entry.toLocalURL() + "?version=" + new Date().getTime();

				var full_path = entry.toLocalURL();
				upload_image(full_path);
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(s) {
			console.log("error" + s);
		});
	},
	pick_image: function() { //本地相册选择 
		plus.gallery.pick(function(a) {
			plus.io.resolveLocalFileSystemURL(a, function(entry) {
				upload_image(entry.fullPath);

			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(a) {}, {
			filter: "image"
		})
	},
	json:function(obj){
		console.log(JSON.stringify(obj));
	}
};

var hiauth = {
	weixin: {},

	updateservice: function() {
		var _self = this;

		plus.oauth.getServices(function(services) {
			//console.log(JSON.stringify(services));
			for(var i in services) {
				var service = services[i];
				if(service.id == 'weixin')
					_self.weixin = service;
			}
		}, function(e) {

		});
	},
	available: function() {
		console.log(JSON.stringify(this.weixin));
		return JSON.stringify(this.weixin) != "{}";
	},
	auth: function(_auth_success) {
		if(JSON.stringify(this.weixin) == "{}") {
			mui.toast("未检测到微信客户端");
			return;
		}
		
		var w = plus.nativeUI.showWaiting("", {
			back: 'none',
			modal: false
		});
		var _weixin = this.weixin;
		_weixin.login(function() {
			w.setTitle("正在获取信息...");
			_weixin.getUserInfo(function() {
				w && w.close();
				w = null;
				_auth_success(_weixin.userInfo); //调用外层处理方法

			}, function(e) {
				w && w.close();
				w = null;
				plus.nativeUI.alert("获取用户信息失败！", null, "登录");
			});

		}, function(e) {
			
			w && w.close();
			w = null;

		});
	},
	logout: function() {
		//登录完成以后，注销登录状态
		this.weixin.logout(function() {

		}, function(e) {

		});
	}
};

var hipay = {
	wxpay: {},
	updateservice: function() {
		var _self = this;
		plus.payment.getChannels(function(channels) {
			console.log(JSON.stringify(channels));
			for(var i in channels) {
				var channel = channels[i];
				if(channel.id == 'wxpay') {
					if(!channel.serviceReady) {
						var txt = '系统未安装“' + channel.description + '”服务，无法完成支付.';
						mui.toast(txt);
						
//						plus.nativeUI.confirm(txt, function(e) {
//							if(e.index == 0) {
//								channel.installService();
//							}
//						}, channel.description);
					} else
						_self.wxpay = channel;
					break;
				}

			}

		}, function(e) {});
	},
	do_pay: function(order,type) {
		if(JSON.stringify(this.wxpay) == "{}") {
			mui.toast("检测到您没有安装微信");
			return;
		}
		//plus.nativeUI.alert();
		plus.payment.request(this.wxpay, order, function(result) {
			//mui.toast(JSON.stringify(result));
			if(type == 'market'){
				console.log('进入微信支付');
				console.log(result);
			}
//			mui.back();
		}, function(e) {
			//plus.nativeUI.alert(JSON.stringify(e));
		});
	},
	recharge: function(order,type) {
		this.updateservice();
		if(JSON.stringify(this.wxpay) == "{}") {
			mui.toast("检测到您没有安装微信");
			return;
		}
		this.do_pay(order,type);
	}
};

var hishare = {
	weixin: {},
	updateservice: function() {
		var _self = this;
		this.shares = [];
		plus.share.getServices(function(s) {
			for(var i in s) {
				if(s[i].nativeClient == true && s[i].id == "weixin")
					_self.weixin = s[i];
			}
			//console.log(JSON.stringify(_self.weixin));
		}, function(e) {});
	},
	do_share: function(friend,image_path) {
		var _self = this;
		var msg = {
			//content: "用海掌柜，嗨翻生活",
			extra: {
				scene: friend ? "WXSceneSession" : "WXSceneTimeline"
			}
		};
		//msg.href = "http://www.zhonglaiwang.com/";
		//mui.toast("425"+image_path);
		plus.io.resolveLocalFileSystemURL(image_path, function(entry){
			//mui.toast(entry.toLocalURL());
			msg.pictures = [entry.toLocalURL()];
			_self.weixin.send(msg, function() {
				//mui.toast("分享到\"" + _self.weixin.description + "\"成功！ ");
				//console.log("分享到\"" + _self.weixin.description + "\"成功！ ");
	
			}, function(e) {
				//console.log("分享到\"" + _self.weixin.description + "\"失败: " + JSON.stringify(e));
	
			});
		}, function(e){
			//mui.toast("437"+e.message);
		});
	
		
	},
	share: function(friend,image_path) {
		if(JSON.stringify(this.weixin) == "{}") {
			mui.toast("检测到您没有安装微信");
			return;
		}
		if(this.weixin.authenticated) {
			this.do_share(friend,image_path);
		} else {
			this.weixin.authorize(function() {
				this.do_share(friend,image_path);
			}, function(e) {
				alert("认证授权失败：" + e.code + " - " + e.message);

			});
		}
	}
};

function GetFilePath(filepath) {
    if (filepath != "") {
       return filepath.substring(0, filepath.lastIndexOf("/") + 1);
    }
}
function GetFileName(filepath) {
    if (filepath != "") {
        var names = filepath.split("/");
        return names[names.length-1];
    }
}

var image_uploader = {
	internal_do_upload:function(_type, filepath, callback){
		var wt = plus.nativeUI.showWaiting();
		var task = plus.uploader.createUpload('http://' + app.get_item("domain") + '/upload/image?uid=' + app.get_item("uid") + '&uploadtype=' + _type, {
				method: "POST"
			},
			function(t, status) {
				if(status == 200) {
					console.log(t.responseText)
					var data = JSON.parse(t.responseText);
					callback(data)
					wt.close();
					console.log(data.desc);
				} else {
					wt.close();
					console.log(data.desc);
					callback({});
				}
			}
		);
		task.setRequestHeader("token", app.get_item("token"));
		task.addFile(filepath, {
			key: "file"
		});
		task.start();
	},
	internal_upload: function(_type, filepath, callback) {
		var _self = this;
		var new_path = "_doc/temp/"+GetFileName(filepath);
		console.log("压缩"+new_path);
		plus.zip.compressImage({src:filepath,dst:new_path,overwrite:true,width:"800px"},function(event){
				console.log("压缩成功"+event.target);
				_self.internal_do_upload(_type,event.target,callback);
			},function(){
				console.log("压缩失败");
				_self.internal_do_upload(_type,filepath,callback);
			}
		);
	},
	upload: function(_type, callback) {
		var _self = this;
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从相册中选择"
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: a
			}, function(b) { /*actionSheet 按钮点击事件*/
				switch(b.index) {
					case 0:
						break;
					case 2:
						plus.gallery.pick(function(path) {
							_self.internal_upload(_type, path, callback);
						}, function(e) {}, {
							filter: 'image'
						});
						break;
					case 1:
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(path) {
							plus.io.resolveLocalFileSystemURL(path, function(entry) {
								var spath = entry.toLocalURL() + "?version=" + new Date().getTime();
								_self.internal_upload(_type, spath, callback);
							}, function(e) {});
						}, function(e) {}, {
							filename: '_doc/gallery/',
							index: 1
						});
						break;
					default:
						break;
				}
			})
		}
	}
};


mui.plusReady(function(){
	//console.log('plusready: '+window.location.href);
});