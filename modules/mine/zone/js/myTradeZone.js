mui.init();

var container = new Vue({
    el:'#container',
    data:{
        items:[]
    },
    methods:{
        goto_tradeShop:function(_commerceid){
        	app.show_webview_fire("tradeShop","loadinfo",{commerceid: _commerceid});
        },
        reload:function(){
        	this.items = [];
        	this.$refs.pullup.newrequest();
        },
        append:function(data){
        	console.log(JSON.stringify(data));
        	this.items = this.items.concat(data.data);
        }
    }
});

mui.ready(function(){
    window.addEventListener('loadinfo',function(event){
    	container.reload();
    });
    
    mui.back = function(event)
    {
       plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');
    };
});

mui.plusReady(function(){
	//mui.preload({url:'tradeShop.html',id:'tradeShop'});
})


