mui.init();
var container =  new Vue({
	el:"#container",
	data:{
		isloading: false,
		order_status:[
			{status:"已取消",active:true,ordertype:'cancel'},
			{status:"已退款",active:false,ordertype:'drawbacked'},
			{status:"已退货",active:false,ordertype:'drawbackchangeed'},
		],// 订单状态
		orderlist:[{
			glist:[{
				allprice:{
					intpart:'',
					floatpart:''
				}
			}]
		}],
		ordertype: '',
		next_url:''
	},
	methods:{
		reset:function(){
			this.isloading = false;
			this.order_status = [
				{status:"已取消",active:true,ordertype:'cancel'},
				{status:"已退款",active:false,ordertype:'drawbacked'},
				{status:"已退货",active:false,ordertype:'drawbackchangeed'},
			];
			this.orderlist = [];
			this.next_url = '';
		},
		toggle:function(e){//切换优惠显示
			if(e.benefitlist.length<=0){
				return;
			} 
			e.benefitlistifenable = !e.benefitlistifenable; 
		},
		goto_detail:function(id){//订单详情
			app.show_webview_fire("market_order_detail",'loadinfo',{is_more:true,id:id}) 
		},
		delete_order:function(id){
			var THIS = this;
			mui.confirm('确认删除订单？','',function(e){
				if(e.index == 1){
					var w = plus.nativeUI.showWaiting();
					app.http_get('/mall/order/delete?id='+id,function(res){
						w.close();
						if(res.code == 200){
							mui.toast('删除成功');
							THIS.change_status(THIS.ordertype);
						}else{
							mui.toast('服务器异常')
						}
					},function(){
						w.close();
						mui.toast('服务器异常')
					})
				}
			})
		},
		change_status:function(ordertype){//切换订单状态
			this.ordertype = ordertype;
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
	}
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
    
	window.addEventListener('scroll',function(){
		var wScrollY = window.scrollY;
	    var wInnerH = window.innerHeight;
	    var bScrollH = document.body.scrollHeight;
	    if (wScrollY + wInnerH >= bScrollH) { 
	        container.get_orderlist();
	    }   
	})
	
	window.addEventListener('loadinfo',function(e){
		container.isloading = true;
		if(e.detail.action_type){
			setTimeout(function(){
				container.change_status(e.detail.action_type);
			},200);
		}else{
			setTimeout(function(){
				container.change_status('cancel');
			},200);
		}
		
	})
	mui.back = function(){
		container.reset();
		plus.webview.hide(plus.webview.currentWebview(),'slide-out-right',300);
	}
})