mui.init();

var container = new Vue({
	el:'#container',
	data:{
		all:0,
		user:'',
		nowmoney:0,
		beforemoney:0,
		remain:0,
		recharge_items:[],
		rechargeid:-1,
		freepass:false,
		paytoken:''
	},
	methods:{
		reload:function(){
			app.http_get('/my/remain',function(ret){
				container.remain = ret.data.remain;
			});
			app.http_get('/letter/agent/recharge/home',function(ret){
				if(ret.code == 200){
					container.all = ret.data.all;
					container.nowmoney = ret.data.nowmonth;
					container.beforemoney = ret.data.beforemonth;
				}
				//container.remain = ret.data.remain;
			});
			
		},sel:function(item,idx){
			var index = parseInt(idx);
			for(var i in this.recharge_items)
			{
				Vue.set(this.recharge_items[parseInt(i)],"active",parseInt(i) == index);
			};
			this.rechargeid = this.recharge_items[index].id;
		},
		pre_recharge:function()
		{
			var _self = this;
			app.http_post("/letter/agent/recharge",
				{rechargeid:this.rechargeid,user:this.user},
				function(ret){
					if(ret.code == 200)
					{
						_self.freepass = ret.data.freepass;
						_self.paytoken = ret.data.paytoken;
						_self.$refs.paypad.set_info(ret.data);
						_self.$refs.paypad.show();
					}
					else
						mui.toast(ret.desc);
			},function(x,t,e){});
			
		},
		do_action:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在支付...",{back:'none'});
			app.http_post('/letter/agent/recharge/pay',
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
	},mounted:function(){
	}
});

mui.ready(function(){
	window.addEventListener('active',function(event){
		container.reload();
	});
});

mui.plusReady(function(){

	app.load_conf(function(conf){
		container.recharge_items = conf.data.agentrecharge;
		for(var i in container.recharge_items)
		{
			mui.extend(container.recharge_items[0],{active:parseInt(i)!=0}); 
		};
		container.rechargeid = container.recharge_items[0].id;
	});
});
