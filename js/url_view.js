var subView = null;

mui.init();
mui.ready(function () {
   	window.addEventListener('goto_url',function(event){
		var url = event.detail.url;
		
		if(url.indexOf('uid') == -1 && url.indexOf('zhonglaiwang.com') != -1){
			if(url.indexOf('?') != -1)
				url += "&uid="+app.get_item("uid")+"&token="+app.get_item("token");
			else
				url += "?uid="+app.get_item("uid")+"&token="+app.get_item("token");
		}
			
		subView.setCssText("img{width:90%;height:auto}");
		console.log("goto_url:"+url);
		
	  	subView.loadURL(url);
	  	//plus.webview.show(plus.webview.currentWebview(),"slide-in-right",300);
	});
	mui.back = function(event) {
		subView.loadURL("blank.html");
	    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
  });

mui.plusReady(function () {
   // var _back =mui.back;

	subView = plus.webview.create("blank.html", "mywebview", {
		top: '64px',
		bottom: '1px'
	});
	plus.webview.currentWebview().append(subView);
});
