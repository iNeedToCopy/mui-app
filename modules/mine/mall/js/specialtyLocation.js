mui.init();

const allCitys = []

var container = new Vue({
	el:'#container',
	data:{
		provinceSelected:'',
		cityCode:'',
		province:[],
		citys:[],
		locations:[]
	},
	watch:{
		provinceSelected:function(newProvin,oldProvin){
			this.citys = newProvin.children;
			this.cityCode = newProvin.children[0].cid;
		},
		cityCode:function(newCityCode,oldCityCode){
			this.loadinfo()
		}
	},
	methods:{
		goBack:function(){
			mui.back();
		},
		getConfig:function(){
			const THIS = this;
			app.http_get('/get/local/config',function(res){
				if(res.code == 200 && res.data.arealist.length >0){
					THIS.provinceSelected = res.data.arealist[0];
					THIS.province = res.data.arealist;
					THIS.cityCode = res.data.arealist[0].children[0].cid;
					THIS.citys = res.data.arealist[0].children;
					THIS.loadinfo();
				}
				
			})
		},
		loadinfo:function(e){
			var THIS = this;
			this.locations = [];
			setTimeout(function(){
				THIS.$refs.load.newrequest();
			},100);
		},
		gotoDetail:function(e,f){
			app.show_webview_fire('specialtyMall',"loadinfo",{id:e,city:f});
		},
		append:function(res){
			this.locations = res.data;
		}
	}
})

mui.plusReady(function(){
	container.getConfig();
	
	mui.back = function(){
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

mui.ready(function(){
});
