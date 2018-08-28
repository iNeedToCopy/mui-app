
//递归删除目录
function remove_directory(path,_done){
	plus.io.resolveLocalFileSystemURL(path, function ( entry ) {
		entry.removeRecursively(function(s){_done();},function(e){console.log(e.message);_done();});
	}, function(e){_done();});
}

/*版本更新检测*/
function version_update()
{
	//http://app.zhonglaiwang.com/get/app/version?platform=android | ios
	var platform = "ios";
	if(plus.os.name == "Android")
		platform = "android";
		
	app.http_get("/get/app/version?platform="+platform,function(ret){
		
		if(ret.code == 200){
			if(plus.runtime.version != ret.data.version){
				
				plus.nativeUI.alert("发现新版本:"+ret.data.version +"\n\n" + ret.data.log, function(){
					app.save_item("hide_start","false");
					plus.runtime.openURL(ret.data.downloadurl);
					setTimeout(function(){
						plus.runtime.quit();
					},500);
				}, "版本更新", "马上升级" );
				
	//			plus.nativeUI.confirm("发现新版本:"+ret.data.version +"\n\n" + ret.data.log,function(e){
	//				if(e.index == 1)
	//					plus.runtime.openURL(ret.data.downloadurl);
	//				else if(e.index == 0)
	//					plus.runtime.quit();
	//			},{title:"版本更新",buttons:["暂不更新","马上更新"]});
			}
		}
	},function(){});
	
}

function switch_main(){
	
	plus.webview.create("modules/common/login.html","login");
	remove_directory("_doc/update",function(){});
	//
	//console.log("进入主界面");
	if(app.get_item("hide_start") == "true"){
		var v = plus.webview.create("main.html","main");
		plus.webview.show(v);
		
		app.save_item("hide_start","true");
		version_update();
	}
	else{
		plus.navigator.closeSplashscreen();
	}
} 

function sortCompareEntry( a, b ) {
	if ( a.isDirectory && b.isFile ) {
		return -1;
	} else if ( a.isFile && b.isDirectory ) {
		return 1;
	} else {
		return a.name - b.name;
	}
}

//var exclude_page=["home","nearby","mine"];

//function preload_page_in_dir(root,entry)
//{
//	var dirReader = entry.createReader();
//	dirReader.readEntries( function( entries ) {
//		entries.sort(sortCompareEntry);//按类型排序
//		for(var idx in entries)
//		{
//			var entry = entries[idx];
//			if(entry.isDirectory)
//				preload_page_in_dir(root,entry);
//			else
//			{
//				if(entry.name.indexOf(".html", entry.name.length - 5) !== -1)
//				{
//					var _url = entry.fullPath;
//					var _id = entry.name.replace(".html","");
//					var v = plus.webview.create(_url, _id);
//					//var v = mui.preload({url:_url,id:_id})
//					console.log(v.id + " => " + _url);
//					
//				}
//			}
//				
//		}
//		
//	}, function ( e ) {
//		
//	} );
//}
/*
 void cb( Download download, Number status ) {
	
}
 * */
function do_download(url,local_path,cb){
	console.log("download"+local_path);
	
	dtask = plus.downloader.createDownload( url, {filename:local_path}, cb).start();
}

/*
 	检查本地文件是否存在
 	file_path 文件相对路径
 	callback(true/false)
 */
function if_file_exists(file_path,callback)
{
	plus.io.resolveLocalFileSystemURL(file_path, function(entry) {
		callback(true);
	},function (e) {
		callback(false);
	});
}

//更新界面资源
function update_configfile(ret)
{
	plus.io.resolveLocalFileSystemURL("_doc/", function(e){
		e.getFile("config.json",{create:true}, function(entry){
			entry.createWriter(function (writer){
				var config_content = ret;
				//设置配置文件中的图片资源为本地路径
				console.log("设置配置文件中的图片资源为本地路径");
				for(var i in ret.data.class.data){
					var _new = ret.data.class.data[i].logo;
					ret.data.class.data[i].logo = _new.replace("http://img.zhonglaiwang.com/images/","_doc/resource/class/");
					ret.data.class.data[i].logo = "file://"+plus.io.convertLocalFileSystemURL(ret.data.class.data[i].logo);
				}
				
				for(var i in ret.data.tab){
					var _def = ret.data.tab[i].defaultimg;
					var _clk = ret.data.tab[i].clickimg;
					ret.data.tab[i].defaultimg = _def.replace("http://img.zhonglaiwang.com/images/","_doc/resource/tab/");
					ret.data.tab[i].clickimg = _clk.replace("http://img.zhonglaiwang.com/images/","_doc/resource/tab/");
					
					ret.data.tab[i].defaultimg = "file://"+plus.io.convertLocalFileSystemURL(ret.data.tab[i].defaultimg);
					ret.data.tab[i].clickimg = "file://"+plus.io.convertLocalFileSystemURL(ret.data.tab[i].clickimg);
					
				}
				console.log(JSON.stringify(ret));
				writer.write(JSON.stringify(ret));
				
				switch_main();return;
			}, 
			function (e) {
				console.log(e.toString());
				switch_main();
			});
		},function(e){
			console.log(e.message);
			switch_main();
		});
	},function(e){console.log(e.message);} );
	/*return;

	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function( fs ) {
		console.log("准备更新配置文件"+fs.root.name);
		fs.root.getFile("config.json",{create:true}, function(entry){
			console.log("得到entry");
			entry.createWriter(function (writer){
				var config_content = ret;
				//设置配置文件中的图片资源为本地路径
				console.log("设置配置文件中的图片资源为本地路径");
				for(var i in ret.data.class.data){
					var _new = ret.data.class.data[i].logo;
					ret.data.class.data[i].logo = _new.replace("http://img.zhonglaiwang.com/","_doc/resource/");
					
				}
				
				for(var i in ret.data.tab){
					var _def = ret.data.tab[i].defaultimg;
					var _clk = ret.data.tab[i].clickimg;
					ret.data.tab[i].defaultimg = _def.replace("http://img.zhonglaiwang.com/","_doc/resource/");
					ret.data.tab[i].clickimg = _clk.replace("http://img.zhonglaiwang.com/","_doc/resource/");
					
				}
				console.log(JSON.stringify(ret));
				writer.write(JSON.stringify(ret));
				
				switch_main();return;
			}, 
			function (e) {
				console.log(e.toString());
				switch_main();
			});
	
		},function(e){
			console.log(e.message);
			switch_main();
		});
	}, function ( e ) {
		console.log(e.message);
		switch_main();
	});*/
}

function start(){
	var v = plus.webview.create("main.html","main");
	plus.webview.show(v);
	app.save_item("hide_start","true");
}

mui.plusReady(function(){ 
	
	plus.io.resolveLocalFileSystemURL("_www/modules/", function (entry) 
	{
		app.save_item("domain","app.zhonglaiwang.com");
		//do_download("http://s1.safecat.com.cn/index.php/home/login","_doc/xx/yy/xx.html");
		
		//检查记录凭据是否过期,
		app.http_get("/login/check",function(ret){
			if(ret.iflogin == false){
				plus.storage.removeItem("token");
				plus.storage.removeItem("uid");				
			}
		});
			
		//app.logout();
		app.refresh_location(); 
		
		var conf_version = app.get_item("conf_version");
		app.http_get("/get/config",function(ret)
		{
			if(ret.code == 200)
			{
				app.save_item("cause",JSON.stringify(ret.data.cause));
				if(conf_version  != ret.data.version.toString()) 
				{
					console.log("发现新配置"+ret.data.version.toString());
					app.json(ret.data);
					//更新本地版本号
					
					app.save_item("lng",ret.data.lng);
					app.save_item("lat",ret.data.lat);
					app.save_item("city",ret.data.city);
					
					remove_directory("_doc/resource",function(){
						console.log("下载资源文件:"+ret.data.imgzipurl);
						console.log("已清空resource");
						
						dtask = plus.downloader.createDownload(ret.data.imgzipurl, {filename:"_doc/update/r.zip"}, function(d,status){
							console.log("下载完成:"+status+",=>"+d.filename);
							if(status == 200)
							{
								setTimeout(function(){
									console.log("解压文件"+d.filename);
									plus.zip.decompress(d.filename,"_doc/resource/",
									function(){
										//remove_directory("_doc/update",function(){
											var conf_url = "http://"+app.get_item("domain")+"/get/config";
											update_configfile(ret);
											app.save_item("conf_version",ret.data.version.toString());
										//});
									},function(){
										console.log("解压出错");
										//remove_directory("_doc/update",function(){});
									});
								},100);
								
							}
						}).start();
					});
				}
				else {
					console.log(conf_version);
					switch_main();}
			}
			else {
				console.log(ret.desc);
				switch_main();return;}
		},function(a,b,c){
			mui.toast("获取配置失败");
			switch_main();});
	
	}, function (e) {});
});