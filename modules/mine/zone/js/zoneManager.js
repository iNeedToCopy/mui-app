mui.init();

var container = new Vue({
	el:"#container",
	data:{
		name: "",
	    grade: 1,
	    moreurl:"",
	    checkurl:"",
	    statistics: [
	      {
	        name: "区域总营业额",
	        value: 0
	      },
	      {
	        name: "区域总充值额",
	        value: 0
	      },
	      {
	        name: "本月总营业额",
	        value: 0
	      },
	      {
	        name: "本月总充值额",
	        value: 0
	      }
	    ]
	},
	methods:{
		goto_red:function(){
			app.show_webview_fire("redCash","loadinfo",{});
		},
		goto_shopSelect:function(){
			app.show_webview_fire("shopSelect","loadinfo",{});
		},
		goto_mytradezone:function(){
			app.show_webview_fire("myTradeZone","loadinfo",{});
		},
		goto_more:function(){
			app.show_webview_fire("url_view","goto_url",{url:container.moreurl});
		}
	}
});

mui.plusReady(function(){
	//mui.preload({url:'redCash.html',id:'redCash'});	
	//mui.preload({url:'shopSelect.html',id:'shopSelect'});	
	//mui.preload({url:'myTradeZone.html',id:'myTradeZone'});	
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
        app.http_get('/areauser/home',function(ret){
			container.name = ret.data.name;
			container.grade = ret.data.grade;
			container.statistics = ret.data.statistics;
			container.moreurl = ret.data.moreurl;
			container.checkurl = ret.data.checkurl;
		},function(a,b,c){});
    });
    
    mui.back = function(event)
    {
       plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
})


