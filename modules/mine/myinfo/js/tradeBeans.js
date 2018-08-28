mui.init();
//展示数据
var inputValue = mui("input")[0].value;
var sell = new Vue({
	el:"#container",
	data:{
		score:{}	
	},
	methods:{
		sell:function(){
			var sellcount = mui(".score")[0].innerText.substring(1);
			mui.ajax('http://app.zhonglaiwang.com/hongdou/sell/opera?uid=619796793',{
				headers:{
					token: app.get_item("token")
				},
				data:{
					uid: app.get_item("uid"),
					sellcount: sellcount
				},
				datatype: 'json',
				type: 'post',
				success:function(data){
					console.log(JSON.stringify(data));
					mui.toast(data.desc);
				},
				error:function(error){
					console.log(error);
				}
			})
		}
	}
});
window.addEventListener('loadinfo',function(event){
	app.http_get("/hongdou/sell?uid=" + app.get_item("uid"),function(ret){
		if(ret.code == 200){
			sell.score = ret.data;
			//卖出
			today = sell.score.today;
			
			mui(".trade .score")[0].innerText = '￥' + inputValue*today;
			mui(".trade").on('tap','.add',function(){
				var value = parseInt(mui("input")[0].value);
				mui("input")[0].value = ++value;
				inputValue = mui("input")[0].value;
				mui(".trade .score")[0].innerText = '￥' + inputValue*today;
			});
			mui(".trade").on('tap','.reduce',function(){
				var value = parseInt(mui("input")[0].value);
				if(value>1){
					mui("input")[0].value = --value;
					inputValue = mui("input")[0].value;
					mui(".trade .score")[0].innerText = '￥' + inputValue*today;
				}
			});
		}
		else
		{
			console.log(ret.desc);
			mui.back();
			return;
		}	
	});
});






