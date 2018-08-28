mui.init();

var container = new Vue({
    el:'#container',
    data:{
    	commerceid:0,
        baseinfo: {
	      logo: "",
	      bgimg: "",
	      phone: "",
	      name: "",
	      address: "",
	      lng: 0,
	      lat: 0,
	      worktime: ""
	    },
	    shoplist: [],
	    low: [],
	    good: []
    },
    methods:{
        goto_shopdetail:function(_shopid)
		{
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid}); 
		},
		goto_goodsdetail:function(_goodsid)
		{
			app.show_webview_fire("goodsDetail","loadinfo",{goodsid:_goodsid}); 
		},
		goto_seeAll:function(){
			app.show_webview_fire("selected","loaddata",{id:this.commerceid});
		},
		goto_nearbyReductionMore:function(){
			app.show_webview_fire("near","loadinfo",{});
		},
		goto_Jmore:function(){
			app.show_webview_fire("jmore","loadinfo",{});
		},
		load_info:function(){
			var  url = '/commerce/home?id='+this.commerceid;
	        app.http_get(url,
		        function(ret){
		        	console.log(JSON.stringify(ret))
		            if(ret.code == 200){
		                next_page_url = ret.data.next_page_url;
		                container.baseinfo = ret.data.baseinfo;
		                container.shoplist = ret.data.shoplist;
		                container.low = ret.data.low;
		                container.good = ret.data.good;
		            }
		        },function(e,x,h){
		            console.log(x);
		    });
		}
    }
});

mui.ready(function(){
    window.addEventListener('loadinfo',function(event){
        container.shoplist.length = 0;
        container.low.length = 0;
        container.good.length = 0;
       	container.commerceid = event.detail.zone_id;
        container.load_info();
	});
    
    mui.back = function(event)
    {
       plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});

