var default_url = '../../../images/updateP.png';

var container = new Vue({
	el:'#container',
	data:{
		photos:[]
	},methods:{
		upload:function(){
			var _self = this;
			image_uploader.upload('shopinner',function(ret){	
				_self.photos.push({url:ret.url,thumb:ret.data.thumb});
			});
		},
		remove:function(idx){
			this.photos.splice(idx,1);
		},
		save:function(){
			if(this.photos.length <2)
			{
				mui.toast('请先完成上传');return;
			}
			//var v = plus.webview.currentWebview().opener();
			var v = plus.webview.getWebviewById("shopApp");
			var temp = [];
			for(var i in this.photos){
				if(this.photos[i].url.indexOf("http") != -1)
					temp.push(this.photos[i].url);
			}
			var inner_url = temp.join();
			console.log(inner_url);
			mui.fire(v,'set_inner_url',{url:inner_url});
			mui.back();
		}
	}
});

mui.ready(function(){
	window.addEventListener('reset',function(event){
		container.photos = []
	});
	mui.back = function(event)
	{
//		container.photos = []; 
	    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
