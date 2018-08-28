
mui.init();

var init_baseinfo=  {
    defaultcolor: "#fff",
    defaultbgcolor: "#fa7921",
    selectcolor: "#fff",
    selectbgcolor: "rgba(255,255,255,0.3)"
}

var container = new Vue({
	el:'#container',
	data:{
		current_cid:0,
		baseinfo: init_baseinfo,
		addParam:'',
		tab_items:[],
		items:[]
	},
	methods:{
		load_shoplist:function(itm){
			for(var i in container.tab_items)
				container.tab_items[i].active = container.tab_items[i] == itm;
			this.current_cid = itm.cid;
			if(itm.addparam)
			{
				for(var i in itm.addparam){
				    container.addParam += "&" + itm.addparam[i].name+'='+itm.addparam[i].value+'';	
				}
			}
			else
				container.addParam = '';
			this.current_cid += container.addParam;
			//console.log(this.current_cid);
			container.items=[];
			//debugger
			this.$refs.pullup.newrequest('/near?cid='+this.current_cid);
		},
		append:function(items){
			this.items = this.items.concat(items.data);
		},
		get_itm_name:function(itm){
			if(!itm.ifmultiple)
				return itm.name;
			var d = new Date();
			var seconds = 	d.getHours()*3600 +
							d.getMinutes()*60 +
							d.getSeconds();
			for(var c in itm.child)
			{
				if(seconds>= itm.child[c].start && seconds <= itm.child[c].end)
				{
					for(var i in container.tab_items)
					if(container.tab_items[i] == itm)
						container.tab_items[i].cid = itm.child[c].cid;
				
					return itm.child[c].name;
				}
			}
			return false;
		},
		goto_detail:function(_shopid)
		{
			app.show_webview_fire("shopDetail","loadinfo",{shopid:_shopid});
		},
		//搜索
		goto_search:function(){
			app.show_webview_fade("search");
		}
	},
	computed:{
		nearbyurl:function(){
			return '/near?cid='+this.current_cid;
		}
	}
});

mui.ready(function(){
	
    var backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) { 
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
    window.addEventListener('active',function(e){
		
	});
});
//(function($){
//  $(".mui-scroll-wrapper").scroll({
//      //bounce: false,//滚动条是否有弹力默认是true
//      //indicators: false, //是否显示滚动条,默认是true
//  }); 
//})(mui);
//从配置文件中加载相应配置和数据
//function load_conf()
//{
//	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function( fs ) {
//		fs.root.getFile("config.json",{}, function(entry){
//			var reader = null;
//			entry.file( function ( file ) {
//				reader = new plus.io.FileReader();
//				reader.onloadend = function (e) 
//				{
//					var conf = JSON.parse(e.target.result);
//					//解析配置
//					
//				};
//				reader.readAsText( file );
//			}, function (e){});
//		},function(e){});
//	}, function (e) {});
//}

mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});

	app.load_conf(function(conf){
		container.baseinfo = conf.data.near.baseinfo; 
		console.log(JSON.stringify(conf.data.near.tab)); 
		for(var t in conf.data.near.tab)
		{
			container.tab_items.push(conf.data.near.tab[t]);
			//mui.extend(container.tab_items[t],conf.data.near.tab[t]);	
		}
		console.log(JSON.stringify(container.tab_items)); 
		if(container.tab_items.length > 0)
			container.load_shoplist(container.tab_items[0]);
	});
});
		