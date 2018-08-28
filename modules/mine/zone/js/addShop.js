mui.init();
var _data = {};
var selected = mui(".selectedScore")[0];
var num = 0;
selected.innerText = num;

var container = new Vue({
	el:"#container",
	data:{
		items:[],
		sword:''
	},
	methods:{
		complete:function(){
			app.http_post('/areauser/commerce/shop/modi?commerceid='+_commerceid+'&otype=add',_data,
				function(ret){
					if(ret.code == 200){
						mui.back();
						mui.toast(ret.desc);
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		doImg:function(event,_id){
			c = event.currentTarget.src;
			right = c.substring(c.lastIndexOf("/")+1);
			if(right == "btn_weixuan.png"){
				event.currentTarget.src = "../../../images/btn_xuanz.png";
				num++;
				selected.innerText = num;
				
				var obj = {};  
				var key = "shoplist[]";  
				var value = _id;  
				obj[key] = value;
				mui.extend(_data,obj);
			}else{
				event.currentTarget.src = "../../../images/btn_weixuan.png";
				num--;
				selected.innerText = num;
			}
		},
		reload:function(){
			this.items = [];
			this.sword = '';
		}
	}
});

mui("#shop_search")[0].onsubmit = function(){
	app.http_get('/areauser/shop/search?sword='+container.sword,
		function(ret){
			console.log(JSON.stringify(ret));
			if(ret.code == 200){
				container.items = ret.data.data;
			}
		},function(x,t,e){
			console.log(e);
		}
	)
}

mui.plusReady(function(){
	//mui.preload({url:'tradeShop.html',id:'tradeShop'});
	
	window.addEventListener('loadinfo',function(event){
		_commerceid = event.detail.commerceid;
		container.reload();
	})
	mui.back = function(){
		container.reload();
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	}
})