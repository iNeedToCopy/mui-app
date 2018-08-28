
mui.init();

var container = new Vue({
	el:"#container",
	data:{
		id:0,
		type:'shop',
		comments:[]
	}
	,methods:
	{
		reload:function(_type,_id){
			this.id = _id;
			this.type = _type;
			this.comments = [];
			var _self = this;
			setTimeout(function(){
				_self.$refs.pullup.newrequest();
			},100);
			
		},
		append:function(data){ 
			this.comments = this.comments.concat(data.data); 
		},
		previewImage:function(index,j){//评论点击大图
			var options = {
				current:j,
				indicator:"number"
			};
			plus.nativeUI.previewImage(this.comments[index].bigimg,options);
		},
	},
	computed:{
		init_url:function(){
			if(this.type == 'shop')
				return '/shop/comment?shopid='+this.id;
			else if(this.type == 'goods')
				return '/goods/comment?goodsid='+this.id;
			else if(this.type == 'mall')
				return '/mall/goods/comment/list?id='+this.id;
			else
				return '';
		}
	}
});


mui.ready(function(){
	window.addEventListener('loadinfo',function(event){ 
		container.reload(event.detail.type,event.detail.id);
	});
	
	mui.back = function(event)
	{
	   container.comments=[];
	   
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right"); 
	};
});


