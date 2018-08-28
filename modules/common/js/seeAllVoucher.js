var container = new Vue({
    el:'#container',
    data:{
    	shopid:0,
        items:[]
    },
    methods:{
    	load_info:function(_shopid){
    		this.shopid = _shopid;
    		var _self = this;
    		this.items = [];
    		setTimeout(function(){
    			_self.$refs.loadmore.newrequest();
    		},200);
    	},
        get_cash:function(cash_id){
			app.http_get("/gain/cash?cashid="+cash_id,function(ret){
				mui.toast(ret.desc);
			});
		},
		append:function(ret){
			this.items = this.items.concat(ret.data);
		}
    }
});

mui.ready(function(){
    window.addEventListener('loadinfo',function(event){
		container.load_info(event.detail.shopid);
    });
    
    mui.back = function(event)
    {

        plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});