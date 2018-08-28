mui.init({
  gestureConfig:{ 
   swipe: false, //默认为true
  }
});
var container = new Vue({
	el:"#container",
	data:{
		memberCount:0,
		sellerCount:0,
		partnerCount:0,
		tab_idx:0,
		usertype:0,
		word:'',
		members:{
		    allcount: 0,
		    my:{
		      	gradedesc: "",
		      	gradeicotype: "star",
		      	username: "",
		      	credit: 0
		    },
		    members:[]
		},
		sellers:{
			thismonth:0,
			lastmonth:0,
			all:0,
			seller_list:[],
			my:{username:'',grade:''}
		},
		partners:{
			thismonth:0,
			lastmonth:0,
			all:0,
			partner_list:[
				{
					userid	:	890875206,
					username	:	'hzg1',
					shopname	:	'测试店铺',
					sellmoney	:	0
				},
			],
			my:{username:'',grade:''}
		},
		lower_members:[],//下一级会员
	},
	computed:{
		my_credit:function(){
			var v = this.members.my.credit;
			if(v > 10000)
			{
				v = (v/10000).toFixed(1) +"万";
			}
			return v;
		}
	},
	methods:{
		show_lower:function(member,j){
			var THIS = this;
			app.http_get('/my/member/more?sword='+member.uid,function(res){
				if(res.code == 200){
					THIS.lower_members = res.data.data;
					THIS.members.members.forEach(function(e,i){
						if(i == j){
							e.show = !e.show
						}else{
							e.show = false;
						}
					})
				}else{
					mui.toast('服务器异常')
				}
			},function(){mui.toast('服务器异常')})
		},
		getStatis:function(){//获取会员数量
			app.http_get('/my/member/statis',function(res){
				container.memberCount = res.data.member;
				container.sellerCount = res.data.seller;
				container.partnerCount = res.data.partner;
			},function(){e})
		},
		call_phone:function(phone){
			plus.device.dial(phone);
		},
		//我的商家报表
		goto_myseller:function(_id){
			app.show_webview_fire("mySeller","loadinfo",{seller_id:_id});
		},
		//商家邀请
		seller_sendInvite:function(){
			app.show_webview_fire("sendInvitation","loadinfo",{type: 'seller'});
		},
		//合伙人邀请
		partner_sendInvite:function(){
			app.show_webview_fire("sendInvitation","loadinfo",{type: 'partner'});
		},
		//我的合伙人报表
		goto_partner:function(_id){
			if(_id == app.get_item("uid")) return;
			
			app.show_webview_fire("partner","loadinfo",{partner_id:_id});
		},
		load_members:function(_cb){
			var _self = this;
			app.http_get('/my/member',function(ret){
				if(ret.code == 200)
				{
					_self.members.allcount = ret.data.allcount;
					_self.members.my = ret.data.my;
					_self.members.members = [];
					_self.$refs.pullup_member.newrequest();
					if(_cb)_cb();	
				}
			},function(x,t,e){
				if(_cb)_cb();	
				console.log("e");
				
			});
		},
		tab_taped:function(idx){
			this.tab_idx = idx;
			if(idx == 2)
				this.load_partners_data();
			else if(idx == 1)
				this.load_sellers_data();
			else 
				this.load_members();
		},
		load_sellers_data:function(){
			var _self = this;
			app.http_get('/my/seller',function(ret){
				if(ret.code == 200)
				{
					_self.sellers.thismonth = ret.data.static.cur;
					_self.sellers.lastmonth = ret.data.static.before;
					_self.sellers.all = ret.data.static.all;
					
					_self.sellers.seller_list = [];
					_self.sellers.my = ret.data.my;
	
					_self.$refs.pullup_sellers.newrequest();
					
				}
			},function(x,t,e){
				console.log("e");
				
			});
		},
		load_partners_data:function(){
			var _self = this;
			app.http_get('/my/partner',function(ret){
				if(ret.code == 200)
				{
					_self.partners.thismonth = ret.data.static.cur;
					_self.partners.lastmonth = ret.data.static.before;
					_self.partners.all = ret.data.static.all;
					
					_self.partners.partner_list = [];
					_self.partners.my = ret.data.my;
	
					_self.$refs.pullup_partners.newrequest();
				}
			},function(x,t,e){
				console.log("e");
			});
		},
		append_members:function(data){
			data.data.forEach(function(e,i){
				e.show = false;
			})
			this.members.members = this.members.members.concat(data.data);
		},
		append_sellers:function(data){
//			var test = new Array(20);
//			test.fill(data.data[0]);
//			app.json(test)
			this.sellers.seller_list = this.sellers.seller_list.concat(data.data);
		},
		append_partners:function(data){
			this.partners.partner_list = this.partners.partner_list.concat(data.data);
		},
		//查看更多
		show_more:function(_title,_obj){
			app.show_webview_fire("statistics","loadinfo",{
				title:_title,
				obj:_obj
			});
		}
	}
})
mui.ready(function(){
	//搜索会员
//	mui("#member_search")[0].onsubmit = function(){
//		app.http_get('/my/member?sword='+container.word,
//			function(ret){
//				if(ret.code == 200){
//					container.members.members = ret.data;
//				}
//			},function(x,t,e){
//				mui.toast('没有此会员');
//				console.log(e);
//			}
//		)
//	}
	//弹出键盘底部位置调整
//	var height = document.documentElement.clientHeight || document.body.clientHeight;
//	window.onresize = function() {
//	    var heightView = document.documentElement.clientHeight || document.body.clientHeight;
//	    if(heightView < height) {
//	        plus.webview.currentWebview().setStyle({
//	            height: height
//	        });
//	    }
//	}
	window.addEventListener('loadinfo',function(){
		container.getStatis();
		container.load_members(function(){
			container.usertype = app.get_item("usertype");
		});
	});
	mui.back=function(event){
		container.tab_idx = 0;
      	plus.webview.hide(plus.webview.currentWebview(),'slide-out-right');;
	};

	
});
