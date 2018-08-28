mui.init();
//function goto_searching(){
//	var v = app.open_webview("searching.html","searching");
//	mui.fire(v,"loadinfo",{});
//}
//热门
var container = new Vue({
	el:"#container",
	data:{
		show_hot:true,
		word:"",
		hot:{},
		history:[],
		items:[]
	},
	methods:{
		goto_searching:function(_history){
			app.show_webview_fire("searching","history",{content: _history});
		},
		load_hot:function(){
			var history_item = app.get_item("history");
			for(i in container.history){
				if(container.history[i].name != history_item){}
				else{
					container.history.push({name: history_item});
					console.log(container.history)
				}
			}
			app.http_get('/hot/search/word',
				function(ret){
					if(ret.code == 200){
						container.hot = ret.data;
					}
				},function(x,t,e){
					console.log(e);
				}
			)
		},
		loadinfo:function(_word){
			this.word = _word;
			this.search();
		},
		search:function(){
			if(this.word.length>0){
				this.show_hot = false;
				this.items=[];
				var _self = this;
	        		setTimeout(function(){
	        			_self.$refs.loadmore.newrequest();
	        		},100);
        		}
		},
		goto_shopDetail:function(_shopid){
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid});
		},
		append:function(data){
			this.items = this.items.concat(data.data);
		},
		endload:function(e){
			
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.load_hot();
//		document.getElementById("word").focus();
	});
	mui.back = function(event)
    {
    	container.word = "";
		container.items = [];
       	container.show_hot = true;
       	plus.webview.hide(plus.webview.currentWebview(),'fade-out');
    };
});
