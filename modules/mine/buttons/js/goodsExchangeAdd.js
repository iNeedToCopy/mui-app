mui.init();
mui.ready(function(){
	mui(".addLocation").on('tap','.location',function(){
		mui.openWindow({
			url:'../mineSon/addLocation.html',
			id:'addLocation.html',
			show:{
				aniShow:'slide-in-right'
			}
		})
	});
//	//自动跳转
//	setInterval(function(){
//		mui.openWindow({
//			url:'goodsExchange.html',
//			id:'goodsExchange.html',
//			show:{
//				aniShow:'slide-in-right'
//			}
//		})
//	},3000)
})
var show = new Vue({
	el:"#show",
	data:{
		text:[
			{goodsName:"肯德基早餐券",number1:"1张",score1:"100",score2:"100",score3:"100",number2:"2"}
		]
	}
})
