mui.init();

var container = new Vue({
	el:"#container",
	data:{
		edit_mode:false,
		items:[]
	},
	methods:{
		
		loadinfo:function(){
			this.items = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},200);
			
		},
		append:function(data){ 
			for(var i in data.data){
				mui.extend(data.data[i],{checked:false});
			}
			this.items = this.items.concat(data.data); 
		},
		gotoDetail:function(orderid){
	    	
	    },
	    toggle_editmode:function(){
	    	this.edit_mode = !this.edit_mode;
	    },
	    cancel:function(){
	    	this.edit_mode = false;
	    }
	    ,new_cashier:function(){
	    	console.log("new_cashier");
			app.show_webview_fire("new_cashier",'loadinfo',{});
		},
		del:function(){
			var count = 0;
			var list = "";
			var _self = this;
			for(var i in this.items){
				if(this.items[i].checked == true){
					count++;
					if(list.length > 0)
						list = list +",";
					list = list + this.items[i].id;
				}
			}
			
			if(count == 0){mui.toast("请选择要删除的收银员");return;}
			
			plus.nativeUI.confirm("确定要删除选中的"+count+"名收银员吗?",function(e){
				if(e.index == 1)
				{
					app.http_post('/seller/shop/admin/del',{
						shopidlist:list
					},function(ret){
						mui.toast(ret.desc);
						if(ret.code == 200){
							_self.edit_mode == false;
							_self.loadinfo();
						}
					},function(){});
				}
			},{title:"删除收银员",buttons:["取消","确定"]});
			
		}
	},
	computed:{
		
	}
});

mui.plusReady(function(){
	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		console.log("cashier_list_loadinfo");
		container.loadinfo();
	});
	mui.back = function(event)
	{
	   container.edit_mode = false;
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
