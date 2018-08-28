mui.init();
var _type = '';
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		_type = event.detail.type;
	})
})
var container = new Vue({
	el:"#container",
	data:{
		user:''
	},
	methods:{
		send:function(){
			console.log(1)
			var _data = {
				otype: _type,
				user: this.user
			};	
			app.http_post('/invite/seller/partner',_data,
				function(ret){
					mui.toast(ret.desc);
					if(ret.code == 200){
						
						mui.back();
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
})
