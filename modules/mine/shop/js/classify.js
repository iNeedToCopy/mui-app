mui.init();

var container = new Vue({
	el:'#container',
	data:{
		classify:[],
		first_level:{index:-1,text:'',cid:''},
		second_level:{index:0,text:'',cid:''},
		third_level:{index:0,text:'',cid:''},
	},methods:{
		select_first_level:function(idx,text,cid){
			console.log(cid);
			this.first_level.index = idx;
			this.first_level.text = text;
			this.first_level.cid = cid;
			
			this.second_level.index = 0;this.second_level.cid='';
			this.third_level.index = 0;this.third_level.cid='';
			for(var i in this.classify)
				this.classify[i].checked = this.classify[i].cid == cid;
			if(!('children' in this.classify[idx]))
			{
				this.back();
			}
		},
		select_second_level:function(idx,text,cid){
			this.second_level.index = idx;
			this.second_level.text = text;
			this.second_level.cid = cid;
			
			this.third_level.index = 0;
			for(var i in this.classify[this.first_level.index].children)
				this.classify[this.first_level.index].children[i].checked = this.classify[this.first_level.index].children[i].cid == cid;
			if(!('children' in this.classify[this.first_level.index].children[idx]))
			{
				this.back();
			}
		},
		select_third_level:function(idx,text,cid){
			this.third_level.index = idx;
			this.third_level.text = text;
			this.third_level.cid = cid;
			
			for(var i in this.classify[this.first_level.index].children[this.second_level.index].children)
				this.classify[this.first_level.index].children[this.second_level.index].children[i].checked = this.classify[this.first_level.index].children[this.second_level.index].children[i].cid == cid;
			//alert(text);
			var temp = this.classify[this.first_level.index].children[this.second_level.index].children;
			this.classify[this.first_level.index].children[this.second_level.index].children = [];
			this.classify[this.first_level.index].children[this.second_level.index].children = temp;
			this.back();
		},
		back:function(){
			//var v = plus.webview.currentWebview().opener();
			var v = plus.webview.getWebviewById("shopApp");
			mui.fire(v,'set_class',{
				first:this.first_level.cid,
				second:this.second_level.cid,
				third:this.third_level.cid,
				class_text:this.first_level.text+ "/" +this.second_level.text+"/"+this.third_level.text
			});
			mui.back();
		}
	},
//	updated:function(){
//		alert(document.querySelector("div .navMenu").length);
//	}
});

mui.plusReady(function(){
	app.load_conf(function(conf){
		for(var i in conf.data.class.data)
		{
			mui.extend(conf.data.class.data[i],{checked:false});
			if('children' in conf.data.class.data[i])
			{
				for(var j in conf.data.class.data[i].children)
				{
					mui.extend(conf.data.class.data[i].children[j],{checked:false});
					if('children' in conf.data.class.data[i].children[j])
					{
						for(var k in conf.data.class.data[i].children[j].children)
							mui.extend(conf.data.class.data[i].children[j].children[k],{checked:false});
					}
				}
			}
		}
//		if(conf.data.class.data.length >0){
//			conf.data.class.data[0].checked =true;
//			if('children' in conf.data.class.data[0])
//			{
//				conf.data.class.data[0].children[0].checked =true;
//			}
//		}
		container.classify = conf.data.class.data;
		console.log(JSON.stringify(container.classify));
	});
	
});

mui.ready(function(){
 
	
//	mui(".mui-row div").each(function(idx,item){ 
//		
//		item.style.height =  (window.innerHeight - document.getElementById("list").offsetTop)+"px";
//		//alert(item.style.height); 
//		return false;
//	});
});
