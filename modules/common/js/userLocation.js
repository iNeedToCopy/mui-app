mui.init();
//展示数据
var container = new Vue({
	el:"#container",
	data:{
		item: []
	},
	methods:{
		//显示地址
		load_info:function(){
			this.item = [];
			app.http_get('/my/address',
				function(ret){
					if(ret.code==200){
						container.item = ret.data;
						console.log(ret.desc);
					}
				},function(x,t,e){
					console.log(e)
				}
			)
		},
		//设置默认地址
		set_info:function(_ifdefault,_id){
			var w = plus.nativeUI.showWaiting("正在设置...");
			app.http_get('/my/address/default?ifdefault='+ _ifdefault + '&id='+ _id,
				function(ret){
					w.close();
					console.log(JSON.stringify(ret));
					if(ret.code==200){
						mui.toast(ret.desc);
						container.load_info();
					}
				},function(x,t,e){
					w.close();
					console.log(e)	
				}
			);
		},
		//添加地址
		goto_addLocation:function(){
			app.show_webview_fire("addLocation","loadinfo",{});
		},
		//编辑地址
		goto_editLocation:function(_id){
			app.show_webview_fire("editLocation","loadinfo",{editId: _id});
		},
		//删除地址
		goto_deleteLocation:function(_id){
			plus.nativeUI.confirm("确定要删除吗?",function(e){
				if(e.index == 1)
				{
					var w = plus.nativeUI.showWaiting("正在删除...");
					app.http_get('/my/address/del?id='+ _id,
						function(ret){
							w.close();
							if(ret.code==200){
								container.load_info();
								mui.toast(ret.desc);
							}
						},function(x,t,e){
							w.close();
						}
					)
				}
			},{title:"删除地址",buttons:["取消","确定删除"]});

			
		}
	}
});
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		
		container.load_info();
	});
	window.addEventListener('location_selected',function(event){
		
		container.load_info();
	});
	
	mui.back = function(event)
	{
	   app.update_opener();	
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
})

var ifdefault = '';
function doImg(s){
	c = s.src;
	right = c.substring(c.lastIndexOf("/")+1);
	if(right == "btn_weixuan.png"){
//		s.src = "../../images/btn_xuanz.png";
		ifdefault = "yes";
		container.set_info(ifdefault,s.id);
	}else{
		s.src = "../../images/btn_weixuan.png";
		ifdefault = '';
	}
}

