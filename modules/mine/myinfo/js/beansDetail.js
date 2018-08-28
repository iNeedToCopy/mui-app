
var detail = new Vue({
	el:"#container",
	data:{
		items:[],
		url: '/hongdou/detail',
	},
	methods:{
		loaddata:function(){
			this.items = [];
			this.$refs.loadmore.newrequest();
		},
		append:function(ret){
			this.items = this.items.concat(ret.data);
		}
	}
});

mui.ready(function(){
	
	window.addEventListener('loadinfo',function(e){
		if(e.detail.url){
			document.getElementsByClassName('mui-title')[0].innerText = '银豆明细';
			detail.$refs.loadmore.object = e.detail.url
		}else{
			document.getElementsByClassName('mui-title')[0].innerText = '红豆明细';
		}
		detail.items = [];
		detail.loaddata();
	}); 
});
