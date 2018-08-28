mui.init();
var container = new Vue({
	el:"#container",
	data:{
		items:[]
	},
	methods:{
		reload:function(){
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
		
			this.items = this.items.concat(data.data); 
			
		}
	}
})
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.reload();
	});
});
