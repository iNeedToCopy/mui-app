var container = new Vue({
	el:'#container',
	data:{
		front:{url:'',thumb:'../../../images/mine_idZ.png'},
		behind:{url:'',thumb:'../../../images/mine_idF.png'},
		hand:{url:'',thumb:'../../../images/mine_idSC.png'}
	},
	methods:{
		take_image:function(idx){
			var _self = this;
			image_uploader.upload("verify",function(ret){
				if(ret.code == 200){
					if(idx == 1){
						_self.front.url = ret.url;
						_self.front.thumb = ret.data.thumb;
					}
					else if(idx == 2){
						_self.behind.url = ret.url;
						_self.behind.thumb = ret.data.thumb;
					}
					else if(idx == 3){
						_self.hand.url = ret.url;
						_self.hand.thumb = ret.data.thumb;
					}
				}
			});
		}
		,save:function(){
			if(this.front.url.length == 0 || this.behind.url.length == 0 || this.hand.url.length == 0){
				mui.toast("请先指定照片");return;
			}
			app.http_post('/my/verify',{
					"front" : this.front.url,
					"behind" : this.behind.url,
					"hand" : this.hand.url
				},
				function(ret){
					mui.toast(ret.desc);
					app.update_opener();
					mui.back();
				},function(e,x,h){
					console.log(x)
			});
		}
	}
});
