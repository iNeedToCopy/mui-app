mui.init({
	gestureConfig:{   
		tap: true, //默认为true  
		doubletap: true, //默认为false   
		longtap: true, //默认为false   
		swipe: true, //默认为true   
		drag: true, //默认为true   
		hold:false,//默认为false，不监听   
		release:false//默认为false，不监听   
	}
});
var titleNView = {
    backgroundColor: '#f7f7f7',
    titleText: '商品详情',
    titleColor: '#000000',
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#e5e5e5'
    }
};

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minites = date.getMinutes();
    if (month >= 1 && month <= 9) {month = "0" + month;}
    if (strDate >= 0 && strDate <= 9) {strDate = "0" + strDate;}
    if (hours >= 0 && hours <= 9) {hours = "0" + hours;}
    if (minites >= 0 && minites <= 9) {minites = "0" + minites;}
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minites;
            //+ seperator2 + date.getSeconds();
    return currentdate;
}

var container = new Vue({
	el:'#container',
	data:{
		showPicker:false,
		showDetail:true,
		order_id:0,
		is_seller:false,
		order:{drawbackdesc:''},
		freepass:false,
		paytoken:'',
		drawback_money:0,//商家退款金额
		cancel_order:{//取消订单相关
			causeid:0,
			cause_cancel:[],
			show:function(){container.$refs.cancel_order.show();},
			hide:function(){container.$refs.cancel_order.hide();},
			ensure:function(){
				
			},
			set_cause:function(causeid){
				this.causeid = causeid;
				
				var _self = this;
				var w = plus.nativeUI.showWaiting("正在取消订单...");
				app.http_post('/user/online/order/cancel',{orderid:container.order.trade.orderid,causeid:this.causeid},function(ret){
					w.close();
					mui.toast(ret.desc);
					_self.hide();
					if(ret.code == 200){
						app.update_opener();
						mui.back();
					}
				},function(x,t,e){
					w.close();
				});
			
			},
		},
		drawback:{//退款相关
			causeid:0,
			cause_drawback:[],
			drawback_uri:'',
			preshow:function(){
				if(container.order.drawbackdesc.length>0){
					mui('#ensure_drawback').popover("show");
				}
				else
					this.show();
				//console.log(JSON.stringify(container.drawback.cause_drawback));
//				var w = plus.nativeUI.showWaiting("正在申请退款...");
//				app.http_get('/order/check/drawback?orderid='+container.order.trade.orderid,function(ret){
//					w.close();
//					mui.toast(ret.desc);
//					_self.hide();
//					if(ret.code == 200){
//						container.$refs.drawback.show();
//					}
//					else
//						;
//				},function(x,t,e){
//					w.close();
//				});
				
				
			},
			show:function(){
				container.$refs.drawback.show();
			},
			hide:function(){container.$refs.drawback.hide();},
			cancel:function(){
				mui('#ensure_drawback').popover("hide");
			},
			ensure:function(){
				container.$refs.drawback.show();
			},
			set_cause:function(causeid){
				this.causeid = causeid;
				var _self = this;
//				plus.nativeUI.confirm("退款将于七个工作日内退到您的账户.\n您是否确定退款?",function(e){
//					if(e.index == 1)
//					{
//						
//					}
//				},{title:"申请退款",buttons:["取消","确认退款"]});
				var w = plus.nativeUI.showWaiting("正在申请退款...");
				app.http_post(_self.drawback_uri,{orderid:container.order.trade.orderid,causeid:_self.causeid},function(ret){
					w.close();
					
					_self.hide();
					if(ret.code == 200){
						app.update_opener();
						mui.toast(ret.desc);
						mui.back();
					}
					else if(ret.code == 212)
					{
						if(container.order.progress.viewtype == 2)
						{
							mui('#popover').popover("show");
						}
						else if(container.order.progress.viewtype == 3){
							
						}
						else
							mui.toast(ret.desc);
					}
					else
						plus.nativeUI.alert(ret.desc);
				},function(x,t,e){
					w.close();
				});
			},
			
			wait:function(){
				mui('#popover').popover("hide");
			}
		},
		finish:{
			finish:function(){
				var _self = this;
				var w = plus.nativeUI.showWaiting("正在确认收货...");
				app.http_post('/user/online/order/finish',{orderid:container.order.trade.orderid,causeid:0},function(ret){
					w.close();
					mui.toast(ret.desc);
					
					if(ret.code == 200){
						app.show_webview_fire("comment","loadinfo",{orderid:container.order.trade.orderid});
						//mui.back();
					}
				},function(x,t,e){
					w.close();
				});
			}
		},
		//商家接单
		receive:{
			arrivetime:'0000-00-00 00:00',
			choose_time:function(){
				var myDate = new Date();
				var _self = container;
				var picker = new mui.DtPicker({
					value:getNowFormatDate(),
					beginDate:myDate, 
//					endDate:new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(),23,59,59)
				});
				container.showPicker = true;
				picker.show(function (rs) {
//					container.receive.arrivetime = rs.text;
					plus.nativeUI.confirm("预计送达时间:[ "+ rs.text +" ]\n确定接单吗?",function(e){
						if(e.index == 1)
						{
							app.http_post('/seller/online/order/receiveorder',{
								orderid:container.order.trade.orderid,
								arrivetime:rs.text+":00"
							},function(ret){
								mui.toast(ret.desc);
								if(ret.code == 200){
//									container.$refs.receive.hide();
									app.update_opener();
									mui.back();
								}
							},function(r,t,e){
							});
						}
					},{title:"接单信息确认",buttons:["取消","确定"]});
					picker.dispose();
				});
				//点击遮罩层
				var backDrop = document.getElementsByClassName('mui-backdrop');
				backDrop[backDrop.length - 1].addEventListener('tap',function(){
					container.showPicker = false;
				})
			},
			cancel:function(){
				container.receive.hideBack();
			},
			receive:function(){
				container.receive.hideBack();
				var temp = document.getElementsByClassName('mui-btn mui-btn-blue');
				mui.trigger(temp[temp.length-1],'tap');
			},
			hideBack:function(){
				var backDrop = document.getElementsByClassName('mui-backdrop');
				mui.trigger(backDrop[backDrop.length - 1],'tap');
			},
			confirmarrive:function(){
				var _self = this;
				plus.nativeUI.confirm("确定到达吗?",function(e){
					if(e.index == 1)
					{
						app.http_post('/seller/online/order/confirmarrive',{
							orderid:container.order.trade.orderid
						},function(ret){
							mui.toast(ret.desc);
							if(ret.code == 200){
								container.$refs.receive.hide();
								app.update_opener();
								mui.back();
							}
						},function(r,t,e){});
					}
				},{title:"确认到达",buttons:["取消","确定"]});
			},
			show_drawback:function(){
				mui('#seller_drawback').popover("show");
			},
			hide_drawback:function(){
				mui('#seller_drawback').popover("hide");
			},
			do_drawback:function(){
				var w = plus.nativeUI.showWaiting("正在退款...");
				app.http_post('/seller/online/order/drawback',{
					orderid:container.order.trade.orderid,
					money:container.drawback_money,
				},function(ret){
					w.close();
					mui.toast(ret.desc);
					if(ret.code == 200){
						container.$refs.receive.hide();
						mui('#seller_drawback').popover("hide");
						app.update_opener();
						mui.back();
					}
				},function(r,t,e){w.close();});
						
				
			}
		}
	},
	methods:{
		load_info:function(){
			var _self = this;
			if(this.is_seller){
				app.http_get('/seller/online/order/detail?orderid='+this.order_id,function(ret){
					console.log(JSON.stringify((ret)));
					_self.order = ret.data;
					_self.drawback_money = _self.order.price.value;
				},function(x,t,e){}	);
				
			}
			else{
				app.http_get('/user/online/order/detail?orderid='+this.order_id,function(ret){
					_self.order = ret.data;
					
				},function(x,t,e){}	);
			}
			
		},
		goto_quanma:function(_orderid){
			app.show_webview_fire("quanma",'loadinfo',{
				juancode:this.order.juancode.value,
				shop:this.order.shop.name,
				goods:this.order.goods.name,
				orderid:_orderid
			});
		},
		goto_goodsdetail:function(goods_id){
			var v = app.open_webview("../../common/goodsDetail.html","goodsDetail",{titleNView:titleNView});
			mui.fire(v,"loadinfo",{goodsid:goods_id});
		},
		dial:function(phone){
			this.drawback.hide();
			mui('#popover').popover("hide");
			plus.device.dial(phone,true);
			
		},
		btn_taped:function(btn){
			console.log(btn);
			switch(btn.otype)
			{
				case "pay":
					this.prepay();	
					break;
				case "cancel":
					this.cancel_order.show();
					break;
				case "canceldrawback":
					this.drawback.drawback_uri = '/user/online/order/cancel',
					this.drawback.preshow();
					break;
				case "drawback":
					this.drawback.drawback_uri = '/user/online/order/drawback',
					this.drawback.preshow();
					break;
				case "homedrawback":
					app.http_post('/user/online/order/home/drawback',{orderid:this.order_id,causeid:0},function(ret){
						if(ret.code == 212){
							document.getElementById("homedrawback_desc").innerText = ret.desc;
							mui('#popover').popover("show");
						}
						
					},function(x,t,e){});
					break;
				case "drawbacklocal":
					document.getElementById("homedrawback_desc").innerText = "你的商品正在配送中，如果需要退款请联系卖家";
					mui('#popover').popover("show");
					break;
				case "finish":
					this.finish.finish();
					break;
				case "comment":
					app.show_webview_fire("comment","loadinfo",{orderid:container.order.trade.orderid});
					break;
				//商家功能
				case 'receiveorder':
					//mui('#receive_order').popover("show");
					this.receive.arrivetime = getNowFormatDate();
					this.receive.choose_time();
 					//this.$refs.receive.show();
					///seller/online/order/receiveorder 参数:orderid和arrivetime
					break;
				case 'confirmarrive':
					this.receive.confirmarrive();
					break;
				case 'sellerdrawback':
					this.receive.show_drawback();
					break;
				default:
			}
			
		},
		prepay:function(){//立即付款前获取支付信息
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在获取支付信息...");
			app.http_post('/order/pay/preview',{orderid:_self.order.trade.orderid,causeid:0},function(ret){
				w.close();
				if(ret.code == 200){
					_self.paytoken = ret.data.paytoken;
					_self.$refs.paypad.set_info(ret.data);
					_self.$refs.paypad.show(ret.data.wxpay,hipay.wxpay,'/user/online/order/wx/complete?id='+ret.data.orderid);
				}else if(ret.code == 210){
					if(JSON.stringify(hipay.wxpay) == "{}"){
						mui.toast("检测到您没有安装微信,请先安装");return;
					}
					plus.payment.request(hipay.wxpay, ret.data, function(res) {
						app.http_get('/user/online/order/wx/complete?id='+_self.order_id,function(res){
							if(res.code == 200){
								mui.toast('支付成功');
								app.update_opener();
								mui.back();
							}
						},function(err){
							mui.toast('微信支付已成功，订单更新异常，请联系客服')
						})
					}, function(e) {
						if(e.code == -100){
							mui.toast('您取消了微信支付')
						}else{
							mui.toast('微信支付异常，请联系客服')
						}
					});
				}
				else
				{
					mui.toast(ret.desc);
				}
			},function(x,t,e){
				w.close();
			});
		},
		do_action:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在支付...",{back:'none'});
			app.http_post('/user/online/pay',
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					app.update_opener();
					mui.back();
				}
			},function(x,t,e){
				w.close();
			});
			
		},
	},
	computed:{
		
	},
	created:function(){
		mui(".mui-dtpicker-active-for-page").on('tap','.mui-backdrop',function(){
			console.log(546486)
		});
	}
});

var interval = 0;
mui.ready(function(){
	window.addEventListener('loadinfo',function(event){
		container.is_seller = event.detail.is_seller;
		container.order_id = event.detail.orderid;
		container.load_info();
		//interval=setInterval(function(){
		//	container.load_info();		
		//},5000);
	});
	window.addEventListener('refresh',function(event){
		container.load_info();
	});
	
	mui.back = function(event)
	{
	  	// clearInterval(interval);
	  	container.showDetail = true;
	  	container.showPicker = false;
	   	plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});
mui.plusReady(function(){
	hipay.updateservice();
	app.load_conf(function(conf){
		container.cancel_order.cause_cancel = conf.data.cause.cancel;//调试取消原因
		container.drawback.cause_drawback = conf.data.cause.drawback;
	});
});
