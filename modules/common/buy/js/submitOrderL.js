mui.init();
mui.ready(function(){
	//加
	mui(".price").on('tap','.add',function(){
		var value = parseInt(mui("input")[0].value)
		if(value<10){
			mui("input")[0].value = ++value
		}
	})
	//减
	mui(".price").on('tap','.reduce',function(){
		var value = parseInt(mui("input")[0].value)
		if(value>1){
			mui("input")[0].value = --value
		}
	})
	
})