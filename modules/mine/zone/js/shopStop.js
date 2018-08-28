mui.init();
var items = mui(".checked .item")
mui(".checked").on('tap','.item',function(){
	this.classList.add("current");
	for(var i=0;i<items.length;i++){
		if(this!=items[i]){
			items[i].classList.remove('current');
		}
	}
})

