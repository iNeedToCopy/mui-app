mui.init();
	
	var container = new Vue({
		el:'#container',
		data:{
			invite_id:0,
			shopname:'',
			provid:-1,
			cityid:-1,
			areaid:-1,
			addr:'',
			lng:0,
			lat:0,
			onelevelid:-1,
			twolevelid:-1,
			threelevelid:-1,
			class_text:'',
			phone:'',
			logourl:'',
			innerpicurl:'',
			permit:'',
			licence:'',
			startday:'',
			endday:'',
			starttime:'',
			endtime:'',
			perprice:0,
			servicelist:[],
			otherservice:''
		},
		methods:{
			reset_photos:function(){
				var args = ["shopLocation","doorPhoto","classify","innerPhoto","licence","other"];
				for (var i=0;i<args.length;i++) {
					var v = plus.webview.getWebviewById(args[i]);
					if(v){
						mui.fire(v, "reset", {});
					}
				}
			},
			goto_shopLoadtion:function(){app.show_webview_fire('shopLocation');},
			goto_doorPhoto:function(){app.show_webview_fire('doorPhoto');},
			goto_innerPhoto:function(){app.show_webview_fire('innerPhoto');},
			goto_licence:function(){app.show_webview_fire('licence');},
			goto_other:function(){app.show_webview_fire('other');},
			goto_classify:function(){app.show_webview_fire('classify');},
			submit:function(){
				if(this.shopname.length==0){mui.toast("请填写店铺名称");return;}
				if(this.provid==-1){mui.toast("请填写设置门店地址");return;}
				if(this.onelevelid==-1){mui.toast("请填写设置经营分类");return;}
				if(this.phone.length==0){mui.toast("请填写门店电话");return;}
				if(this.logourl.length==0){mui.toast("请上传门头照");return;}
				if(this.innerpicurl.length==0){mui.toast("请上传内景照");return;}
				if(this.licence.length==0){mui.toast("请上传营业执照");return;}
				//if(this.licence.length==0){mui.toast("请上传营业执照");return;}
				if(this.startday.length==0){mui.toast("请完善其他服务信息 ");return;}
				var service_list=[];
				for(var i in this.servicelist){
					if(this.servicelist[i].checked)
					{
						service_list.push(this.servicelist[i].value);
					}
				}
				//console.log(JSON.stringify(this.servicelist));
				//console.log(JSON.stringify(service_list));
				app.http_post("/apply/seller",{
					invitecode:this.invite_id,
					shopname:this.shopname,
					provid:this.provid,
					cityid:this.cityid,
					areaid:this.areaid,
					addr:this.addr,
//					lng:this.lng,
//					lat:this.lat,
					onelevelid:this.onelevelid,
					twolevelid:this.twolevelid,
					threelevelid:this.threelevelid,
					phone:this.phone,
					logourl:this.logourl,
					innerpicurl:this.innerpicurl,
					permit:this.permit,
					licence:this.licence,
					startday:this.startday,
					endday:this.endday,
					starttime:this.starttime,
					endtime:this.endtime,
					perprice:this.perprice,
					'servicelist':service_list.join(),
					otherservice:this.otherservice
				},function(ret){
					plus.nativeUI.alert(ret.desc);
					if(ret.code == 200){
						container.reset_photos();
						plus.webview.close(plus.webview.currentWebview(),"slide-out-right");
					}
				},function(x,t,e){
					mui.toast("提交出错");
				});
			}
			
		}
	});
	
	mui.plusReady(function(){
		//mui.preload({url:'shopLocation.html',id:'shopLocation'});
		//mui.preload({url:'doorPhoto.html',id:'doorPhoto'});
		//mui.preload({url:'innerPhoto.html',id:'innerPhoto'});
		//mui.preload({url:'licence.html',id:'licence'});
		//mui.preload({url:'other.html',id:'other'});
		//mui.preload({url:'classify.html',id:'classify'});
		
	});
	//弹出键盘底部位置调整
//	var height = document.documentElement.clientHeight || document.body.clientHeight;
//	window.onresize = function() {
//	    var heightView = document.documentElement.clientHeight || document.body.clientHeight;
//	    if(heightView < height) {
//	        plus.webview.currentWebview().setStyle({
//	            height: height
//	        });
//	        plus.webview.getWebviewById('HTML/a.html').setStyle({height: (height*1-51)});
//	    }
//	}
	mui.ready(function(){
		window.addEventListener('set_logo_url',function(event){
			container.logourl = event.detail.url;
			console.log(container.logourl)
		});
		window.addEventListener('set_inner_url',function(event){container.innerpicurl = event.detail.url;});
		window.addEventListener('set_addr',function(event){
			container.provid = event.detail.provid;
			container.cityid = event.detail.cityid;
			container.areaid = event.detail.areaid;
			container.addr = event.detail.addr;
			container.lng = event.detail.lng;
			container.lat = event.detail.lat;
		});
		window.addEventListener('loadinfo',function(event){
			container.invite_id = event.detail.id;//从邀请消息传递过来的id
		});
		
		window.addEventListener('set_class',function(event){
			container.onelevelid = event.detail.first;
			container.twolevelid = event.detail.second;
			container.threelevelid = event.detail.third;
			container.class_text = event.detail.class_text;
		});
		window.addEventListener('set_other_info',function(event){
			container.startday = event.detail.startday;
			container.endday = event.detail.endday;
			container.starttime = event.detail.starttime;
			container.endtime = event.detail.endtime;
			container.perprice = event.detail.perprice;
			container.servicelist = event.detail.servicelist;
			container.otherservice = event.detail.otherservice;
			console.log(JSON.stringify(container.servicelist))
		});
		window.addEventListener('set_permit_url',function(event){container.permit = event.detail.url});
		window.addEventListener('set_licence_url',function(event){container.licence = event.detail.url});
		window.addEventListener('set_level',function(event){
			alert(JSON.stringify(event.detail));
		});
		//window.addEventListener('set_logo_url',function(event){container.logourl = event.detail.url});
	});	
	
	mui.back = function(event)
	{
		mui.confirm("正在填写商家信息，返回将清空信息",'',["取消","确认返回"],function(e){
			if(e.index === 1){
				container.reset_photos();
				plus.webview.close(plus.webview.currentWebview(),"slide-out-right");
			}
		})
	};
