mui(".mui-scroll-wrapper").scroll();
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			auto: false,
			height: 50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

var monthShare = new Vue({
	el:"#container",
	data:{
		total:{},
		items:[]
	}
})


var next_page_url ="no";
function pullupRefresh() {
	if(next_page_url == "no"){
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		return;
	}
	app.http_get(next_page_url,
		function(ret){
			if(ret.code == 200){
				next_page_url = ret.data.next_page_url;
				
				for(var i in ret.data.data){
					var item = ret.data.data[i];
					monthShare.total = ret.data;
					monthShare.items.push({money: item.money,month: item.month,date: item.date});
				}
			}
		},function(e,x,h){
			console.log(x);
		});
};
mui.plusReady(function(){
	monthShare.items.length = 0;
	next_page_url = "/hongdou/share?uid=" + app.get_item("uid");
	pullupRefresh();
});
//mui.ready(function(){
//	window.addEventListener('loadinfo',function(event){
//		monthShare.items.length = 0;
//		next_page_url = "/hongdou/share?uid=" + app.get_item("uid");
//		pullupRefresh();
//	});
//	
//	mui.back = function(event)
//	{
//	   //清空Vue里面的Data
//	   
//	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
//	};
//});