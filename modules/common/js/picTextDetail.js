mui.init();

//展示数据
var id = '3565462';
var container = new Vue({
	el:"#container",
	data:{
		show_type:0,//0文字说明,1图片说明
		box:{}
	},
	methods:{
		load_info:function(goodsid){
			app.http_get('/goods/detail?id='+ id +'&goodsid='+ goodsid,
				function(ret){
					if(ret.code == 200){
						container.box = ret.data;
					}
				},function(x,t,e){
					console.log(e)
				}
			)
		},
		set_viewtype:function(_type){
			this.show_type = _type;
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.show_type = 0;
		container.load_info(e.detail.goodsid);
	})
});
 