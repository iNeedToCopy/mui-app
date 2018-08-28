mui.init();

var serviceDetails = new Vue({
	el:'#container',
	data:{
		name:"",
		avatar:'',
		score:0,
		phone:'',
		background:'',
		job:"",
		year:"",
		intro:"",
		comment:[]
	},
	methods:{
		call:function(_phone){
			if(_phone.length <8){mui.toast("暂时未支持预约");return;}
			plus.device.dial(_phone);
		}
	}
});



mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		app.http_get("/shop/service/detail?serviceid="+event.detail.id,function(ret){
			if(ret.code == 200){
				serviceDetails.avatar = ret.data.logo;
				serviceDetails.background = ret.data.background;
				serviceDetails.score = ret.data.score;
				serviceDetails.name = ret.data.name;
				serviceDetails.job = ret.data.position;
				serviceDetails.year = ret.data.experience;
				serviceDetails.intro = ret.data.intro;
				serviceDetails.phone = ret.data.phone;
			}
		},function(e,x,h){
			console.log(x);
		});
		
		app.http_get("/shop/service/comment?serviceid="+event.detail.id,function(ret){
			if(ret.code == 200){
				for(var i in ret.data.data){
					serviceDetails.comment.push(ret.data.data[i]);
				}
			}
		},function(e,x,h){
			console.log(x);
		});
	});

});

mui.plusReady(function(){
	
});
