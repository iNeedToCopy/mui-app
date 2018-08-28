mui.init();
var container = new Vue({
	el:"#container",
	data:{
		submit_index: 0,//控制再次购买提交顺序
		freepass: '',
		paytoken:'',
		isloading: false,//正在加载
		order_status:[
			{status:"未付款",active:true,ordertype:'nopay'},
			{status:"待发货",active:false,ordertype:'nosend'},
			{status:"待收货",active:false,ordertype:'noreceive'},
			{status:"未评价",active:false,ordertype:'nocomment'},
			{status:"已完成",active:false,ordertype:'complete'},
		],// 订单状态
		orderlist:[],//订单列表
		next_url:'',//下一页请求地址
	},
	methods:{
		reset:function(){
			this.submit_index = 0;
			this.freepass = '';
			this.paytoken = '';
			this.isloading = false;//正在加载
			this.order_status = [
				{status:"未付款",active:true,ordertype:'nopay'},
				{status:"待发货",active:false,ordertype:'nosend'},
				{status:"待收货",active:false,ordertype:'noreceive'},
				{status:"未评价",active:false,ordertype:'nocomment'},
				{status:"已完成",active:false,ordertype:'complete'},
			];
			this.orderlist = [];//订单列表
			this.next_url = ''; 
		},
		order_action:function(type,id,e){//点击订单操作
			switch (type){
				case 'cancel': 
					mui.confirm('确认取消订单？','',function(e){
						if(e.index == 1){
							var w = plus.nativeUI.showWaiting();
							app.http_get('/mall/order/cancel?id='+id,function(res){
								w.close();
								if(res.code == 200){
									mui.toast('取消成功');
									container.isloading = true;
									container.get_orderlist('nopay');
								}else{
									mui.toast('服务器异常')
								}
							},function(){
								w.close();
								mui.toast('服务器异常')
							})
						}
					})
					break;
				case 'pay': 
					this.pay(e.orderid);
					break;
				case 'drawback': 
					app.show_webview_fire('goods_exchange','loadinfo',{type:'退款',order_detail:e,should_hide:true}) 
					break;
				case 'remind': 
					var w = plus.nativeUI.showWaiting();
					app.http_get('/mall/order/remind?id='+id,function(res){
						w.close();
						if(res.code == 200 || res.code == 215){
							mui.toast(res.desc);
						}else{
							mui.toast('服务器异常')
						}
					},function(){
						w.close();
						mui.toast('服务器异常')
					})
					break;
				case 'drawbackchange': 
					app.show_webview_fire('goods_exchange','loadinfo',{type:'退换',order_detail:e,should_hide:true})
					break;
				case 'receive': 
					mui.confirm('您确认收货后，系统自动为厂家结算','',function(e){
						if(e.index == 1){
							var w = plus.nativeUI.showWaiting();
							app.http_get('/mall/order/confirm/receive?id='+id,function(res){
								w.close();
								if(res.code == 200 || res.code == 215){
									mui.toast(res.desc);
									container.isloading = true;
									container.get_orderlist('noreceive');
								}else{
									mui.toast('服务器异常')
								}
							},function(){
								w.close();
								mui.toast('服务器异常')
							})
						}
					})
					break;
				case 'viewpos': //查看物流进度
					app.show_webview_fire("logistics_detail","loadinfo",{id:e.orderid})
					break;
				case 'callphone': 
					plus.device.dial(e.customphone);
					break;
				case 'gocomment':
					app.show_webview_fire('order_comments','loadinfo',{order_detail:e}) 
					break;
				case 'delete':
					mui.confirm('确认删除订单？','',function(e){
						if(e.index == 1){
							var w = plus.nativeUI.showWaiting();
							app.http_get('/mall/order/delete?id='+id,function(res){
								w.close();
								if(res.code == 200){
									mui.toast('删除成功');
									container.isloading = true;
									container.get_orderlist('complete');
								}else{
									mui.toast('服务器异常')
								}
							},function(){
								w.close();
								mui.toast('服务器异常')
							})
						}
					})
					break;
				case 'again': 
					this.buy_again(e)
					break;
				case 'sendback': 
					this.goto_detail(e.orderid)
					break;
				default:
					break;
			}
		},
		get_btnlist:function(m,e){//计算btn的显示内容
			switch (m){
				case 'cancel': return '取消订单'
					break;
				case 'pay': return '付款'
					break;
				case 'drawback': return '申请退款'
					break;
				case 'remind': return '提醒发货'
					break;
				case 'drawbackchange': return '退换'
					break;
				case 'receive': return '确认收货'
					break;
				case 'viewpos': return e.sendprogress ? '查看物流' : ""
					break;
				case 'callphone': return '售后'
					break;
				case 'gocomment': return '去评价'
					break;
				case 'delete': return '删除订单'
					break;
				case 'again': return '再次购买'
					break;
				case 'sendback': return '寄回商品'
					break;
				default:
					break;
			}
		},
		buy_again:function(orderinfo){
			var request_data = [];
			orderinfo.glist.forEach(function(e,i){
				request_data.push({
					sizeid: e.specid,
					buycount: e.buycount
				})
			})
			plus.nativeUI.showWaiting('正在跳转购物车');
			this.submit_car(request_data,request_data.length);
		},
		//提交购物车信息
		submit_car:function(request_data,length){
			var index = this.submit_index;
			var THIS = this;
			app.http_get('/mall/shopping/cart/add?id='+request_data[index].sizeid+'&buycount='+request_data[index].buycount,function(res){
				if(res.code == 200){
					if(THIS.submit_index == length - 1){
						THIS.submit_index = 0;
						app.show_webview_fire('shopping_car','loadinfo',{});
						return;
					}
					if(THIS.submit_index < length){
						THIS.submit_index ++;
						THIS.submit_car(request_data,length);
						return;
					}
				}else{
					mui.toast('服务器错误')
				}
			},function(){
				mui.toast('服务器错误')
			}); 
		},
		toggle:function(e){//切换优惠显示
			if(e.benefitlist.length<=0){
				return;
			} 
			e.benefitlistifenable = !e.benefitlistifenable; 
		},
		goto_detail:function(id){//订单详情
			app.show_webview_fire("market_order_detail",'loadinfo',{id:id}) 
		},
		goto_more:function(){//跳转更多
			app.show_webview_fire('more_orders', 'loadinfo', {}) 
		},
		cancel_order:function(){//取消订单
			
		},
		pay_order:function(){//付款
			app.show_webview_fire('goods_exchange','loadinfo',{})
		},
		change_status:function(ordertype){//切换订单状态
			this.isloading = true;
			for (var i=0;i<this.order_status.length;i++) {
				if(this.order_status[i].ordertype == ordertype){
					this.order_status[i].active = true;
				}else{
					this.order_status[i].active = false;
				}
			}
			this.get_orderlist(ordertype);
		},
		get_orderlist:function(ordertype){
			var THIS = this;
			if(ordertype){
				app.http_get('/mall/order/list?ordertype='+ordertype,function(res){
					THIS.isloading = false;
					if(res.code == 200){
						THIS.orderlist = res.data.data; 
						THIS.next_url = res.data.next_page_url;
						app.json(THIS.orderlist);
					}else{
						THIS.orderlist = [];
						mui.toast('服务器异常')
					}
				},function(){
					THIS.orderlist = [];
					THIS.isloading = false;
					mui.toast('服务器异常')
				})
			}else{
				if(this.next_url != 'no'){
					app.http_get(this.next_url,function(res){
						THIS.isloading = false;
						if(res.code == 200){
							THIS.orderlist = THIS.orderlist.concat(res.data.data); 
							THIS.next_url = res.data.next_page_url;
							app.json(THIS.orderlist);
						}else{
							THIS.orderlist = [];
							mui.toast('服务器异常')
						}
					},function(){
						THIS.orderlist = [];
						THIS.isloading = false;
						mui.toast('服务器异常')
					})
				}
			}
		},
		pay:function(id){//付款
			var w = plus.nativeUI.showWaiting("正在获取收款信息...");
			var _self = this;
			app.http_get('/mall/from/order/pay?id='+id,function(ret){
				w.close();
				if(ret.code == 200){
					_self.freepass = ret.data.freepass;
					_self.paytoken = ret.data.paytoken;
					_self.$refs.paypad.set_info(ret.data);
					_self.$refs.paypad.show();
				}else if(ret.code == 210){
					if(JSON.stringify(hipay.wxpay) == "{}"){
						mui.toast("检测到您没有安装微信,请先安装");return;
					}
					plus.payment.request(hipay.wxpay, ret.data, function(res) {
						if(res){
							app.http_get('/mall/order/pay/complete?id='+id,function(res){
								if(res.code == 200){
									mui.toast('支付成功');
//									app.show_webview_fire('pay_success','loadinfo',{});
									container.change_status('nosend');
								}
							},function(err){
								mui.toast('微信支付已成功，订单更新异常')
							})
							
						}
					}, function(e) {
						if(e.code == -100){
							mui.toast('请登录微信尽快付款，超过24小时将自动取消')
						}else{
							mui.toast('微信支付异常，请联系客服')
						}
					});
				}
				else
				{
					mui.toast(ret.desc);
				}
			},function(){
				w.close();
				mui.toast('服务器异常')
			})
		},
		do_action:function(_passwd){
			var _self = this;
			var w = plus.nativeUI.showWaiting("正在收款...",{back:'none'});
			app.http_post('/mall/order/pay',
				{paytoken:this.paytoken,paypass:_passwd},function(ret){
				w.close();
				mui.toast(ret.desc);
				if(ret.code == 200){
					_self.$refs.paypad.hide();
					app.show_webview_fire('pay_success','loadinfo',{})
				}
			},function(x,t,e){
				w.close();
			});
		}
	},
	computed:{
		height:function(){
			if(this.orderlist.length<2){
				return (document.documentElement.clientHeight - 66 - 45) + 'px';
			}
		}
	}
});
mui.plusReady(function(){
	console.log('初始化支付设置');
	hipay.updateservice();
})
mui.ready(function(){
	//加载中动画
	var animationData = {"v":"5.1.16","fr":24,"ip":0,"op":36,"w":400,"h":400,"nm":"合成 1","ddd":0,"assets":[{"id":"comp_0","layers":[{"ddd":0,"ind":1,"ty":4,"nm":"“海掌柜填充图标”轮廓","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2},"a":{"a":0,"k":[256,256,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[7.281,-2.602],[0.661,-1.27],[34.569,-7.173],[24.83,37.097],[1.297,0.415],[0,8.398],[-12.156,-2.51],[-1.632,-6.924],[0.782,-2.914],[-1.055,-1.452],[-35.411,7.347],[-12.041,22.545],[0.488,1.495],[-0.754,3.492],[-7.947,0.831],[0,-11.07]],"o":[[-1.348,0.481],[-15.128,29.046],[-46.4,9.628],[-0.757,-1.132],[-7.592,-2.427],[0,-11.712],[6.967,1.439],[0.777,3.298],[-0.465,1.734],[19.995,27.517],[26.926,-5.587],[0.742,-1.388],[-0.987,-3.018],[1.685,-7.81],[11.311,-1.183],[0,8.175]],"v":[[100.909,-73.319],[97.841,-70.523],[20.6,-12.034],[-96.251,-59.846],[-99.356,-62.339],[-112.447,-80.271],[-89.599,-98.689],[-75.316,-84.805],[-75.422,-75.4],[-74.576,-70.348],[15.767,-35.326],[76.288,-80.717],[76.667,-85.242],[76.18,-95.099],[92.544,-109.763],[113.406,-91.036]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[109.145,0],[0,-109.146],[-82.113,-23.994],[-19.279,0],[0,109.145]],"o":[[-109.146,0],[0,89.866],[17.616,5.148],[109.145,0],[0,-109.146]],"v":[[0,-214.095],[-197.626,-16.47],[-55.529,173.247],[-42.465,214.095],[197.626,-16.47]],"c":true},"ix":2},"nm":"路径 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"合并路径 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.749019607843,0.749019607843,0.749019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"填充 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[248.253,249.904],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":4,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":96,"st":0,"bm":0}]}],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"形状图层 1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[200,200,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[15.5,0.5],[0,0],[-12.5,5.5]],"o":[[-15.5,-0.5],[0,0],[4.95,-2.178]],"v":[[77.5,122],[37.5,147.5],[83,134]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.749019607843,0.749019607843,0.749019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"填充 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-9.5,166.5],"ix":2},"a":{"a":0,"k":[-12.5,173.5],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":0,"s":[0,0],"e":[0,0]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":2,"s":[0,0],"e":[50,50]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":3,"s":[50,50],"e":[50,50]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":5,"s":[50,50],"e":[100,100]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":6,"s":[100,100],"e":[100,100]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":8,"s":[100,100],"e":[150,150]},{"t":9}],"ix":3},"r":{"a":0,"k":5,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":9,"s":[100],"e":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":11,"s":[100],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":12,"s":[50],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":14,"s":[50],"e":[0]},{"t":15}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"形状 3","np":3,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[19,-14.5],[0,0]],"o":[[-19,14.5],[0,0]],"v":[[-149,108.5],[-96,139.5]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.749019607843,0.749019607843,0.749019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"填充 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-28,164],"ix":2},"a":{"a":0,"k":[-34.47,168.414],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":18,"s":[0,0],"e":[0,0]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":20,"s":[0,0],"e":[33,33]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":21,"s":[33,33],"e":[33,33]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":23,"s":[33,33],"e":[67,67]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":24,"s":[67,67],"e":[67,67]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":26,"s":[67,67],"e":[100,100]},{"t":27}],"ix":3},"r":{"a":0,"k":1.182,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":27,"s":[100],"e":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":29,"s":[100],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":30,"s":[50],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":32,"s":[50],"e":[0]},{"t":33}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"形状 1","np":3,"cix":2,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[19,-14.5],[0,0]],"o":[[-19,14.5],[0,0]],"v":[[-149,108.5],[-96,139.5]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.749019607843,0.749019607843,0.749019607843,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"填充 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-19,176],"ix":2},"a":{"a":0,"k":[75.114,236.626],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":18,"s":[0,0],"e":[0,0]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":20,"s":[0,0],"e":[20,20]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":21,"s":[20,20],"e":[20,20]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":23,"s":[20,20],"e":[40,40]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":24,"s":[40,40],"e":[40,40]},{"i":{"x":[0.833,0.833],"y":[0.833,0.833]},"o":{"x":[0.167,0.167],"y":[0.167,0.167]},"n":["0p833_0p833_0p167_0p167","0p833_0p833_0p167_0p167"],"t":26,"s":[40,40],"e":[60,60]},{"t":27}],"ix":3},"r":{"a":0,"k":-11,"ix":6},"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":27,"s":[100],"e":[100]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":29,"s":[100],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":30,"s":[50],"e":[50]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":32,"s":[50],"e":[0]},{"t":33}],"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"形状 2","np":3,"cix":2,"ix":3,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":96,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":0,"nm":"海掌柜填充图标","refId":"comp_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":0,"s":[0],"e":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":2,"s":[0],"e":[3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":3,"s":[3],"e":[3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":5,"s":[3],"e":[6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":6,"s":[6],"e":[6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":8,"s":[6],"e":[9]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":9,"s":[9],"e":[9]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":11,"s":[9],"e":[6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":12,"s":[6],"e":[6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":14,"s":[6],"e":[3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":15,"s":[3],"e":[3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":17,"s":[3],"e":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":18,"s":[0],"e":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":20,"s":[0],"e":[-3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":21,"s":[-3],"e":[-3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":23,"s":[-3],"e":[-6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":24,"s":[-6],"e":[-6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":26,"s":[-6],"e":[-9]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":27,"s":[-9],"e":[-9]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":29,"s":[-9],"e":[-6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":30,"s":[-6],"e":[-6]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":32,"s":[-6],"e":[-3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":33,"s":[-3],"e":[-3]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"n":["0p833_0p833_0p167_0p167"],"t":35,"s":[-3],"e":[0]},{"t":36}],"ix":10},"p":{"a":0,"k":[198,368,0],"ix":2},"a":{"a":0,"k":[256,510.545,0],"ix":1},"s":{"a":0,"k":[66,66,100],"ix":6}},"ao":0,"w":512,"h":512,"ip":0,"op":96,"st":0,"bm":0}],"markers":[]};
    var params = {
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
    };
    var anim;
    anim = lottie.loadAnimation(params);
	window.addEventListener('loadinfo',function(e){
		container.isloading = true;
		if(e.detail.action_type){
			setTimeout(function(){
				container.change_status(e.detail.action_type);
			},200)
		}
	})
	window.addEventListener('scroll',function(){
		var wScrollY = window.scrollY;
	    var wInnerH = window.innerHeight;
	    var bScrollH = document.body.scrollHeight;
	    if (wScrollY + wInnerH >= bScrollH) { 
	        container.get_orderlist();
	    }   
	})
	mui.back = function(){
		//从支付成功页面跳转进来需要关闭之前的页面
		var opener = plus.webview.getWebviewById('submit_order');
		plus.webview.hide(opener);
		var opener_ = plus.webview.getWebviewById('pay_success');
		plus.webview.hide(opener_);
		var opener__ = plus.webview.getWebviewById('shopping_car');
		plus.webview.hide(opener__);
		var opener___ = plus.webview.getWebviewById('market_order_detail');
		plus.webview.hide(opener___);
		container.reset();
		plus.webview.hide(plus.webview.currentWebview(),'slide-out-right',300);
	}
});