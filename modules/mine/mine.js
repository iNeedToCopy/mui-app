mui.init();

function remove_directory(path,_done){
	plus.io.resolveLocalFileSystemURL(path, function ( entry ) {
		entry.removeRecursively(function(s){_done();},function(e){console.log(e.message);_done();});
	}, function(e){_done();});
}
var container = new Vue({
	el:"#container",
	data:{
		usertype:0,//用户类型，根据类型来显示或隐藏特定入口
		ifViewApplySeller:false,
		username:'',
		header:'../../images/defaultHeader.png',
		remain: 0,
    	letter: 0,
	    hongdou: 0,
	    silver:0,
	    integral: 0,
	    credit: 0,
	    juanhongbaocount: 0,
	    ordermessagecount: 0,
	    messagecount: 0,
	    grade: 0,
	    gradeicotype: "star",
	    viewmyzone:false,
	},
	methods:{
		reset_data:function(){
			this.username ='未登录';
			this.usertype = 0;
			this.header = '../../images/defaultHeader.png';
			this.remain = 0;
	    	this.letter = 0;
		    this.hongdou = 0;
		    this.silver = 0;
		    this.integral = 0;
		    this.credit = 0;
		    this.juanhongbaocount = 0;
		    this.ordermessagecount = 0;
		    this.messagecount = 10;
		    this.grade = 0;
		    this.gradeicotype = "star";
		},
		dummy:function(){
			app.show_webview_fire("specialtyLocation","specialtyLocation",{});
		},
		share_with_weixin:function(friend){
			mui(".mui-popover").popover('hide');
			if(app.check_login()){
				var w = plus.nativeUI.showWaiting("",{back:'none',modal:true});
				remove_directory("_doc/share",function(){
					var url = "http://"+app.get_item("domain")+"/my/share/code?uid="
						+app.get_item("uid");
						console.log(url);
						
					var dtask = plus.downloader.createDownload(url
						, {filename:"_doc/share/share.png",timeout:8,retry:1,retryInterval:3}, function(d,status)
						{
							w.close();
							
							if(400 == status){mui.toast("获取分享信息超时,请检查网络");return;}
							else if(status == 200)
							{
								 console.log(d.filename);
								var image_path = d.filename;
								hishare.updateservice();
								hishare.share(friend,image_path);
							}
					});
					dtask.setRequestHeader("token",app.get_item("token"));
					dtask.start();
				});
			}
		},
		myshare:function(){
			mui(".mui-popover").popover('hide');
			if(app.get_item("uid") == null){
				mui.toast("未登录");
				return;
			}
			app.show_webview_fire('myshare','loadinfo',{});
			
		},
		//商家入驻
		goto_shopApp:function(){
			if(app.check_login()){
				app.show_webview_fire("shopAgreement","loadinfo",{id: 0,protocol:'/seller/protocol',url:'/apply/can/seller',invitetype:1});
			}
		},
		//设置
		goto_set:function(){
			app.show_webview_fire("set","loadinfo",{});
		},
		//用户安全
		goto_usersafe:function(){
			if(app.check_login()){
				app.show_webview_fire("userSafe","loadinfo",{});
			}
		},
		//零钱
		goto_balance:function(){
			if(app.check_login()){
				app.show_webview_fire("balance","loadinfo",{});
			}
		},
		//信值
		goto_reputation:function(){
			if(app.check_login()){
				app.show_webview_fire("reputation","loadinfo",{});
			}
		},
		//红豆
		goto_redBeans:function(){
			if(app.check_login()){
				app.show_webview_fire("redBeans","loadinfo",{});
			}
		},
		//银豆
		goto_silverBeans:function(){
			if(app.check_login()){
				app.show_webview_fire("silverBeans","loadinfo",{});
			}
		},
		//优惠
		goto_reduction:function(){
			if(app.check_login()){
				app.show_webview_fire("reduction","loadinfo",{});
			}
		},
		//中恋信用
		goto_zlReputation:function(){
			if(app.check_login()){
				app.show_webview_fire("zlReputation","loadinfo",{});
			}
		},
		//积分商城
		goto_scoreMall:function(){
			if(app.check_login()){
				app.show_webview_fire("scoreMall","loadinfo",{});
			}
		},
		//商品订单
		goto_goodsOrder:function(){
			if(app.check_login()){
				app.show_webview_fire("goodsOrder","loadinfo",{});
			}
		},
		//去过的店
		goto_wentShop:function(){
			if(app.check_login()){
				app.show_webview_fire("wentShop","loadinfo",{});
			}
		},
		//消息中心
		goto_msgCenter:function(){
			if(app.check_login()){
				app.show_webview_fire("msgCenter","loadinfo",{});
			}
		},
		//收藏
		goto_collection:function(){
			if(app.check_login()){
				app.show_webview_fire("collection","loadinfo",{});
			}
		},
		//会员管理
		goto_vipManager:function(){
			if(app.check_login()){
				app.show_webview_fire("members","loadinfo",{});
			}
		},
		//我的评价
		goto_evaluate:function(){
			if(app.check_login()){
				app.show_webview_fire("evaluate","loadinfo",{});
			}
		},
		//区域管理
		goto_zoneManager:function(){
			if(app.check_login()){
				app.show_webview_fire("zoneManager","loadinfo",{});
			}
		},
		goto_myzone:function(){
			if(app.check_login()){
				app.show_webview_fire("myzone","loadinfo",{});
			}
		},
		//收银员
		goto_cashier:function(){
			if(app.check_login()){
				app.show_webview_fire("cashier","loadinfo",{});
			}
		},
		//商家管理
		goto_seller:function(){
			if(app.check_login()){
				app.show_webview_fire("seller","loadinfo",{});
			}
		},
		load_profile:function()
		{
			container.usertype = parseInt(app.get_item("usertype"));
			container.username = app.get_item("username");	
			container.viewmyzone = app.get_item("ifViewMyRegion") == "true";
			container.ifViewApplySeller = app.get_item("ifViewApplySeller") == "true";
			app.http_get("/login/check",function(ret){
				if(ret.iflogin == true){
					app.http_get("/my/home",function(ret){
						if(ret.code == 200){
							container.username = ret.data.username;
							app.save_item("username",ret.data.username);
							container.header = ret.data.header;
							app.save_item("header",ret.data.header);
							container.remain = ret.data.remain;
					    	container.letter = ret.data.letter;
						    container.hongdou = ret.data.hongdou;
						    container.silver = ret.data.silver;
						    container.integral = ret.data.integral;
						    container.credit = ret.data.credit;
						    container.juanhongbaocount = ret.data.juanhongbaocount;
						    container.ordermessagecount = ret.data.ordermessagecount;
						    container.messagecount = ret.data.messagecount;
						    container.grade = ret.data.grade;
						    container.gradeicotype = ret.data.gradeicotype;
						}
						else
							mui.toast(ret.desc);
					},function(x,r,e){});
				}
				else{
					container.reset_data();
				}	
			});
		},
		share_cancel:function(){
			mui(".mui-popover").popover('hide');
		}
	},
	updated:function(){
		var pullup = document.getElementById("mui-scroll-wrapper");//.style.top = this.xtop+"px";
            pullup.style.height = (window.innerHeight - pullup.offsetTop)+"px";
	}
})
mui.ready(function(){
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005
	});

	window.addEventListener('active',function(e){
		container.load_profile();
	});
	window.addEventListener('loadinfo',function(e){
		container.load_profile();
	});
	window.addEventListener('scroll',function(e){
		//console.log(window.scrollY);
	});
	
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
});	
    
mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	hishare.updateservice();

	mui.preload({url:'buttons/members.html',id:'members'});
});