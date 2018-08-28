mui.init();

var container = new Vue({
el:"#container",
	data:{
		goodsid:0,
		items:[],
		title:{}
	},
	methods:{
		loadinfo:function(){
    		container.items=[];
    		var _self = this;
			setTimeout(function(){
				_self.$refs.loadmore.newrequest();
			},100);
    		
    	},
		append:function(data){ 
	    	this.items =  this.items.concat(data.data);
	    },
	    gotoDetail:function(_shopid){
	    	app.show_webview_fire("shopDetail",'loadinfo',{shopid:_shopid});
	    },
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.goodsid = event.detail.goodsid;
        container.loadinfo();
   });
})
