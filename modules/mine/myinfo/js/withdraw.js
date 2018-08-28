mui.init();

var container = new Vue({
	el:'#container',
	data:{
		remain:0,
		money:'',
		card_id:-1,
		card:'',
		name:'',
		bankaddr:''
	},
	methods:{
		load_info:function(){
			app.http_get('/my/remain',function(ret){
				container.remain = ret.data.remain;
			});
		},
		goto_history:function(){
			app.show_webview_fire("withdrawHistory","loadinfo",{});
		},
		goto_selectBank:function(){
			app.http_get("/my/detail",function(ret){
				if(ret.code == 200)
				{
					if(ret.data.verifystatus === 1){//审核通过
						app.show_webview_fire("selectBank","loadinfo",{});
					}
					if(ret.data.verifystatus === 2){//审核中
						mui.toast('实名认证审核中。。。')
					}
					if(ret.data.verifystatus === 3){//未认证
						app.show_webview_fire("realAuth","loadinfo",{});
					}
				}
			},function(x,t,e){
				mui.toast('网络异常')
			});
		},
		do_withdraw:function(){
			var btnArray = ['取消', '确定'];
			if(this.money === 0){
				mui.toast('请输入提现金额');
				return;
			}
			if(!+this.money){
				mui.toast('请输入正确的提现金额');
				return;
			}
			var poundage = (+this.money)*2/100;
			var finalMoney = (+this.money)*98/100;
			var confirmText = '提现金额:' + this.money + '  手续费:' + poundage + '  到帐金额:' + finalMoney + '  您确定要提现吗?';
			mui.confirm(confirmText, '提现', btnArray, function(e) {
			if (e.index == 1) 
			{
				var w = plus.nativeUI.showWaiting("正在申请提现...");
				app.http_post("/withdraw",{
					bankid:container.card_id,
					money:container.money
				},function(ret){
					w.close();
					mui.toast(ret.desc);
					if(ret.code == 200)
					{
						app.update_opener();
						mui.back();
					}
					
				},function(x,t,e){
					w.close();
				});
			}});
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_info();
	});
	window.addEventListener('bank_selected',function(event){
		//console.log(JSON.stringify(event.detail));
		container.card_id = event.detail.id;
		container.card=event.detail.bankno;
		container.name=event.detail.name;
		container.bankaddr=event.detail.bank_address;
	});
	
	mui.back = function(event)
	{
		container.remain=0;
		container.money=0;
		container.card_id=-1;
		container.card='';
		container.name='';
		container.bankaddr='';
		
	   app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	   
	};
})

