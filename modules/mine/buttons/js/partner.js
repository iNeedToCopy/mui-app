mui.init();

var container = new Vue({
	el:"#container",
	data:{
		"baseinfo": {
	      "username": "",
	       grade:'',
	       sellercount:0,
	       curmonth:0,
	       "phone": "",
	       "addr": "",
	       "credit": ''
	   },
	   sell:''
	},
	methods:{
		chart_init:function(title,_name,_x,_data){
			var chartOption = {
				legend: {
					data: [title]
				},
				grid: {
					x: 50,
					x2: 10,
					y: 30,
					y2: 25
				},
				
				calculable: false,
				xAxis: [{
					type: 'category',
					data: _x
				}],
				yAxis: [{
					type: 'value',
					splitArea: {
						show: true
					}
				}],
				series: [{
					name: '业绩量',
					type: "bar",
					data: _data
				}]
			};
			var chart = echarts.init(document.getElementById(_name));
			chart.setOption(chartOption);
		}
	}
});

mui.ready(function(){
	window.addEventListener("loadinfo",function(e){
	   	app.http_get('/my/partner/home?user='+e.detail.partner_id,function(ret){
			if(ret.code == 200){
				
				container.baseinfo = ret.data.baseinfo;
			
				var _x = [];
				var _data = [];
				for(var i in ret.data.monthstatic){
					_x.push(ret.data.monthstatic[i].month);
					_data.push(ret.data.monthstatic[i].money);
				}
				container.chart_init("","barChart",_x,_data);
			}
		},function(x,t,e){});
	});
	
});
