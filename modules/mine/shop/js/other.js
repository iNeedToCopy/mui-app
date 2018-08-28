mui.init();
var container = new Vue({
	el:"#container",
	data:{
		startday:"0",
		endday:'4',
		starttime:'08:00',
		endtime:'22:00',
		perprice:0,
		servicelist:[],
		otherservice:''
	},
	methods:{
		check:function(index){
			this.servicelist[index].checked = !this.servicelist[index].checked;
			var temp = this.servicelist;
			this.servicelist = [];
			this.servicelist = temp;
		},save:function(){
			//var v = plus.webview.currentWebview().opener();
			var v = plus.webview.getWebviewById("shopApp");
			mui.fire(v,'set_other_info',{
				startday:this.startday,
				endday:this.endday,
				starttime:this.starttime,
				endtime:this.endtime,
				perprice:this.perprice,
				servicelist:this.servicelist,
				otherservice:this.otherservice,
			});
			mui.back();
		}
	}
});

mui.ready(function(){
	window.addEventListener('reset',function(event){
		container.startday = "0";
		container.endday = '4';
		container.starttime = '08:00';
		container.endtime = '22:00';
		container.perprice = 0;
		container.otherservice = '';
	});
})

mui.plusReady(function(){
	app.load_conf(function(conf){
		container.servicelist = conf.data.servicetag;
		for(var i in container.servicelist){
			container.servicelist[i] = mui.extend(container.servicelist[i],{checked:false});
		}
	});
});
