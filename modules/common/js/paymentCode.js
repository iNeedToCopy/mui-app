mui.init();
var container = new Vue({
	el:"#container",
	data:{},
	methods:{
		load_info:function(){
			app.http_get('/my/payment/code',
				function(ret){
					if(ret.code == 200){
						mui(".box")[0].src = 'data:image/png;base64,' + ret.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		}
	}
})

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_info();		
	});
	
	setInterval(function(){
		container.load_info();		
	},60000);
});


