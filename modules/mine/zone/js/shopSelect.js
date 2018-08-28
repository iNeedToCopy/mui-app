mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:[
//			{shopName:"永辉超市一店",location:"四川成都市双流县"},
//			{shopName:"永辉超市一店",location:"四川成都市双流县"},
//			{shopName:"永辉超市一店",location:"四川成都市双流县"}
//		]
	},
	methods:{
		goto_shopStop:function(){
			app.show_webview_fire("shopStop","loadinfo",{stopId:""});
		}
	}
});
 