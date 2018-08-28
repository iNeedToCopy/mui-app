mui.init();
mui.ready(function(){
	mui(".mui-content").on('tap','button',function(){
		app.show_webview_fire("addCard","loadinfo",{});
	});
	window.addEventListener('loadinfo',function(event){
		container.load_info();
	});
	mui.back = function(event)
	{
	   app.update_opener();
	   container.reset();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
mui.plusReady(function(){
	//mui.preload({url:"addCard.html",id:"addCard"});
})
//展示数据
var container = new Vue({
	el:"#container",
	data:{
		can_check:false,
		items:[]
	},
	methods:{
		reset:function(){
		   container.can_check = false;
		   for(var i=0;i<this.items.length;i++){
				this.items[i].checked = false
			}
		},
		delete_:function(){
			var ids = [];
			var index_ = [];
			for(var i=0;i<this.items.length;i++){
				if(this.items[i].checked){
					ids.push(this.items[i].id);
					index_.push(i)
				}
			}
			if(ids.length<=0){
				mui.toast('请选择需要移除的银行卡');
				return;
			}else{
				mui.confirm('确认移除选中的银行卡？','',function(e){
					if(e.index === 1){//确定回调
						var w = plus.nativeUI.showWaiting();//转菊花
						app.http_get('/my/bank/del?id='+ids.join(','),function(e){
							if(e.code === 200){
								//请求成功，手动删掉数据 
								for (var i = index_.length-1;i>=0;i--) {
									container.items.splice(index_[i],1)
								}
								w.close();//关掉菊花
								container.reset();
								mui.toast('移除成功'); 
							}else{
								w.close();//关掉菊花
								mui.toast('网络错误');
							}
						},function(e){w.close();mui.toast('网络错误');})
					}else{//取消回调
	   					container.reset();
					}
				})
			}
		},
		edit_:function(){
			if(this.items.length<=0){
				mui.toast('没有银行卡可编辑')
			}else{
				this.can_check = true;
			}
		},
		edit_item:function(i){
			if(this.can_check === false) return;
			container.items[i].checked = !container.items[i].checked;
		},
		load_info:function(){
			app.http_get('/my/bank',
				function(ret){
					if(ret.code == 200)
					{	
						for(var i=0;i<ret.data.length;i++) {
							mui.extend(ret.data[i],{checked:false})
						}	
						container.items = ret.data;
					}
					
				},function(x,t,e){
					console.log(e)
				}
			)
		}
	}
});
	
