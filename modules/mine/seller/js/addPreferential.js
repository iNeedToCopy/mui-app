mui.init();

var container = new Vue({
	el:'#container',
	data:{
		addtype:'cash',
		minmoney:'',
		money:'',
		starttime:'0000-00-00',
		endtime:'0000-00-00',
		maxamount:'',
		//logourl:'',
		
		shops:[]
	},
	methods:{
		loadinfo:function(){
			//加载所有店铺
			var _self = this;
			app.http_get('/seller/all/shop',function(ret){
				for(var i in ret.data)
					mui.extend(ret.data[i],{checked:false});
				_self.shops = ret.data;
			},function(){});
		},
		choose_time:function(_type){
			var myDate = new Date();
			var picker = new mui.DtPicker({"type":"date","beginYear":myDate.getFullYear(),"endYear":myDate.getFullYear()});
			picker.show(function (rs) {
				if(_type == 0) container.starttime = rs.text;else container.endtime = rs.text;
				picker.dispose(); 
			});
			
		},
		save:function(){
			var shop_list = "";
			for(var i in this.shops){
				if(this.shops[i].checked == true)
				{
					if(shop_list.length>0)
						shop_list = shop_list+ ",";
					shop_list = shop_list + this.shops[i].shopid;
				}
			}
			if(shop_list.length == ''){mui.toast("请选择适用的店铺");return;}
			if(this.starttime == "0000-00-00"){mui.toast("请设置开始时间");return;}
			if(this.endtime == "0000-00-00"){mui.toast("请设置结束时间");return;}
			if(this.minmoney == ''){mui.toast("请设置最少消费金额");return;}
			if(this.money == ''){mui.toast("请设置金额");return;}
			
			app.http_post('/seller/cash/hongbao/add',{
				addtype:this.addtype,
				minmoney:this.minmoney,
				money:this.money,
				starttime:this.starttime,
				endtime:this.endtime,
				shoplist:shop_list,
				maxamount:this.maxamount,
			},function(ret){
				mui.toast(ret.desc);
				if(ret.code == 200){
					app.update_opener();
					mui.back();
				}
					
			},function(x,t,e){});
			console.log(JSON.stringify(this.shops));
		}
	}
});

mui.ready(function(){
	window.addEventListener('loadinfo',function(e){
		container.addtype = e.detail.addtype;
		
		var myDate = new Date();
		container.starttime = myDate.getFullYear() +"-"+((myDate.getMonth()*1)+1) +"-"+myDate.getDate();
		container.endtime = myDate.getFullYear() +"-"+((myDate.getMonth()*1)+1) +"-"+myDate.getDate();
		container.loadinfo();
	});
	mui.back = function(event)
	{
		container.addtype = 'cash';
		container.minmoney = '';
		container.money = '';
		container.starttime = '0000-00-00';
		container.endtime = '0000-00-00';
		container.maxamount = '';
		container.shops=[];
		
	    plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
});

