mui.init();

var container = new Vue({
	el:"#container",
	data:{
		items:[],
		show:true,
		slider:true,
		qtype:'cash'
	},
	methods:{
		loadinfo: function(){
			var _self = this;
			this.items = [];
			setTimeout(function(){
				_self.$refs.loadmore.newrequest();
			},100);
		},
		append:function(data){ 
			this.items = this.items.concat(data.data); 
		},
		load_list:function(e){
			this.qtype = e == 0 ? 'cash':'hongbao';
			this.loadinfo();
		},
		load_detail:function(item){
			var _self = this;
			if(!('max' in item.details)){
				var w = plus.nativeUI.showWaiting("");
				app.http_get('/seller/cash/hongbao/detail?qtype='+this.qtype+"&id="+item.id,function(ret){
					if(ret.code == 200)
					{
						for(var i in _self.items){
							if(_self.items[i].id == item.id){
								_self.items[i].details = ret.data;
								console.log(JSON.stringify(_self.items[i]));
								break;
							}
						}
					}	
					w.close();
				},function(x,t,e){w.close();});
			}
		},
		gotoAdd:function(e){
			app.show_webview_fire("addPreferential","loadinfo",{addtype:this.qtype});
		},
		show_tip:function(){
			mui("#tip").popover("show");
		}
	},
	updated:function(){
		
	}
});

mui.plusReady(function(){
	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.qtype = 'cash';
		container.loadinfo();
	});
});
