mui.init();

var container = new Vue({
    el:'#container',
    data:{
        items:[]
    },
    methods:{
    	reload:function(){
			this.items = [];
			this.$refs.pullup.newrequest();
		},
		append:function(data){
			console.log(1)
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