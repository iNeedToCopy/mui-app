mui.init();

var container =  new Vue({
	el:'#container',
	data:{
		tab_items:[
			{text:'优惠券', idx:0, href:'',active:true,target_id:'#target_id_1',action:'/my/cash'},
			{text:'红包',  idx:1,href:'',active:false,target_id:'#target_id_2',action:'/my/hongbao'}
		],
		cash_items:[],
		hongbao_items:[]
	},
	methods:{
		load_cash:function(){
			this.cash_items = [];
			this.$refs.pullup_cash.newrequest();
		},
		load_hongbao:function(){
			this.hongbao_items = [];
			this.$refs.pullup_hongbao.newrequest();
		},
		append_hongbao:function(items){
			this.hongbao_items = this.hongbao_items.concat(items.data);
		},
		append_cash:function(items){
			this.cash_items = this.cash_items.concat(items.data);
		}
	}
});

mui.ready(function(){
	mui('.mui-scroll-wrapper').scroll();
	window.addEventListener('active',function(event){
		container.cash_items = [];
		container.hongbao_items = [];
		
		container.load_cash();
	});
	
	mui.back = function(event)
	{
	   //app.update_opener();
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

//my/hongbao