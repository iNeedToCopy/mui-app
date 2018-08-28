mui.init({
	statusBarBackground: '#f7f7f7',
    preloadPages: [ {
        url: "tradeZoneDetail.html",
        id: "tradeZoneDetail"
    }]
});

var titleNView = {
    backgroundColor: '#f7f7f7',
    titleText: '商圈详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    }
}
var container = new Vue({
    el:'#container',
    data:{
        items:[]
    },
    methods:{
        goto_detail:function(zone_id){
        	var v = plus.webview.create("tradeZoneDetail.html","tradeZoneDetail", {titleNView: titleNView});
            plus.webview.show(v,"slide-in-right",300);
            mui.fire(v,"loadinfo",{'zone_id':zone_id});
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

