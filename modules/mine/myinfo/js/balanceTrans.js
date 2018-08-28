mui.init();

var container = new Vue({
	el:'#container',
	data:{
		phone:'',
		money:'',
		freepass:false,
		paytoken:'',
	},
	methods:{
		pre_transfer:function()
		{
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在获取转账信息...");
			app.http_post('/transfer/money',{user:this.phone,money:this.money},function(ret){
				w.close();
				if(ret.code == 200){
					_self.paytoken = ret.data.paytoken;
					_self.$refs.paypad.set_info(ret.data);
					_self.$refs.paypad.show();
				}
				else
				{
					mui.toast(ret.desc);
				}
			},function(x,t,e){
				w.close();
			});
		},
		do_action:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在执行转账...",{back:'none'});
			app.http_post('/transfer/money/confirm',
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					app.update_opener();
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
		}
	}
});

mui.ready(function(){
	window.addEventListener('active',function(e){
		container.phone='';
		container.money='';
	});
    mui.back = function(event)
	{
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
})