mui.init();
var container = new Vue({
	el:"#container",
	data:{
		text:{},
		allMoney:'',
		allNumber:''
	},
	methods:{
		reload:function(){
			this.text = {};
			this.allMoney = '';
			this.allNumber = '';
		},
		load_info:function(){
			app.http_get('/areauser/hongbao/home',
				function(ret){
					if(ret.code == 200){
						container.text = ret.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		sendCash:function(){
			var val = mui("input")[0].value;
			var reg = /^[1-9]\d*|0$/;
			if(val != ''){
				if(!reg.test(val)){
					mui.toast('请输入正确的单位');
				}else{
					var _data = {
						"allMoney" : container.allMoney,
						"allNumber" : container.allNumber
					}
					app.http_post('/areauser/send/hongbao',_data,
						function(ret){
							console.log(JSON.stringify(ret))
							if(ret.code == 200){
								container.reload();
								container.load_info();
								mui.toast(ret.desc);
							}
						},function(x,t,e){
							console.log(e);
						}
					)
				}
			}else{
				mui.toast('红包金额不能为空');				
			}
		}
	}
});
mui.plusReady(function(){
	window.addEventListener('loadinfo',function(){
		container.load_info();
	})
})
