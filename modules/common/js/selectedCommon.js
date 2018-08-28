mui.init();
var cid = '';
var distance = '';
var sort = '';
var paramname = '';
//隐藏其他箭头
function hideArrow(s){
	var lis = mui(".nodata>li");
	for(var i=0;i<lis.length;i++){
		if(s!=lis[i]){
			lis[i].children[2].classList.add("display");
			lis[i].children[1].classList.remove("display");
			//this
			s.children[2].classList.remove("display");
			s.children[1].classList.add("display");
		}
	}
}
//点击全部分类传值
function clickSelectAll(s){
	lis = s.parentNode.children;
	for(var i=0;i<lis.length;i++){
		lis[i].classList.remove('color');
		//删除图片
		if(lis[i].children[0]!=null){
			lis[i].removeChild(lis[i].children[0])
		}
	}
	s.classList.add('color');
	//添加图片
	var oImgBox = document.createElement("img");
    oImgBox.setAttribute("id", "imgBox");
  	oImgBox.setAttribute("src", "../../../images/allRight.png");
  	oImgBox.style.cssText="position: absolute;top: 13px;left: 80%;width: 19px;height: 14px;"
  	s.appendChild(oImgBox);
  	//点击后传接口值
	cid = s.value;
	setTimeout(function(){
		mui("#content")[0].style.height = '';
		content.load_info('',cid,distance,sort);
		mui(".allSon")[0].classList.add('display');
		mask.close();
		
		mui(".all span")[0].innerText = s.innerText;
	},200)
}

//点击附近传值
function clickSelectNearby(s){
	lis = s.parentNode.children;
	for(var i=0;i<lis.length;i++){
		lis[i].classList.remove('color');
		//删除图片
		if(lis[i].children[0]!=null){
			lis[i].removeChild(lis[i].children[0])
		}
	}
	s.classList.add('color');
	//添加图片
	var oImgBox = document.createElement("img");
    oImgBox.setAttribute("id", "imgBox");
  	oImgBox.setAttribute("src", "../../../images/allRight.png");
  	oImgBox.style.cssText="position: absolute;top: 13px;left: 93%;width: 19px;height: 14px;"
  	s.appendChild(oImgBox);
  	//点击后传接口值
	distance = s.value;
	setTimeout(function(){
		content.load_info('',cid,distance,sort);
		mui(".nearbySon")[0].classList.add('display');
		mask.close();
		
		mui(".nearby span")[0].innerText = s.innerText;
	},200)
}

//点击智能排序传值
function clickSelectAi(s){
	lis = s.parentNode.children;
	for(var i=0;i<lis.length;i++){
		lis[i].classList.remove('color');
		//删除图片
		if(lis[i].children[0]!=null){
			lis[i].removeChild(lis[i].children[0])
		}
	}
	s.classList.add('color');
	//添加图片
	var oImgBox = document.createElement("img");
    oImgBox.setAttribute("id", "imgBox");
  	oImgBox.setAttribute("src", "../../../images/allRight.png");
  	oImgBox.style.cssText="position: absolute;top: 13px;left: 93%;width: 19px;height: 14px;"
  	s.appendChild(oImgBox);
  	//点击后传接口值
	sort = s.type;
	setTimeout(function(){
		content.load_info('',cid,distance,sort); 
		mui(".aiSon")[0].classList.add('display');
		mask.close(); 
		
		mui(".ai span")[0].innerText = s.innerText;
	},200)
}
//点击全部分类
var mask = mui.createMask();
function doAct1(s){
	//隐藏其他分类
	mui(".nearbySon")[0].classList.add('display');
	mui(".aiSon")[0].classList.add('display');
	mui(".selected")[0].classList.add('display');
	c = mui(".allSon")[0].className;
	if(c != null && c.indexOf(' display') > -1){
		mui(".allSon")[0].className = c.replace(' display', '');
		mask.show();
		hideArrow(s);
		mui("#content")[0].style.height = (window.innerHeight - 120)+"px";
	}else{
		mui(".nodata>li .noactive1")[0].classList.remove("display");
		mui(".nodata>li .active1")[0].classList.add("display");
		mui(".allSon")[0].className = c + ' display';
		mask.close();
		mui("#content")[0].style.height = '';
	}
}
//点击附近
function doAct2(s){
	//隐藏其他分类
	mui(".allSon")[0].classList.add('display');
	mui(".aiSon")[0].classList.add('display');
	mui(".selected")[0].classList.add('display');
	c = mui(".nearbySon")[0].className;
	if(c != null && c.indexOf(' display') > -1){
		mui(".nearbySon")[0].className = c.replace(' display', '');
		mask.show();
		hideArrow(s);
	}else{
		mui(".nodata>li .noactive1")[0].classList.remove("display");
		mui(".nodata>li .active1")[0].classList.add("display");
		mui(".nearbySon")[0].className = c + ' display';
		mask.close();
	}
}	
//点击智能排序
function doAct3(s){
	mui(".allSon")[0].classList.add('display');
	mui(".nearbySon")[0].classList.add('display');
	mui(".selected")[0].classList.add('display');
	c = mui(".aiSon")[0].className;
	if(c != null && c.indexOf(' display') > -1){
		mui(".aiSon")[0].className = c.replace(' display', '');
		mask.show();
		hideArrow(s);
	}else{
		mui(".nodata>li .noactive3")[0].classList.remove("display");
		mui(".nodata>li .active3")[0].classList.add("display");
		mui(".aiSon")[0].className = c + ' display';
		mask.close();
	}
}
//筛选点击
function doAct4(s){
	mui(".allSon")[0].classList.add('display');
	mui(".nearbySon")[0].classList.add('display');
	mui(".aiSon")[0].classList.add('display');
	c = mui(".selected")[0].className;
	if(c != null && c.indexOf(' display') > -1){
		mui(".selected")[0].className = c.replace(' display', '');
		mask.show();
		hideArrow(s);
	}else{
		mui(".nodata>li .noactive4")[0].classList.remove("display");
		mui(".nodata>li .active4")[0].classList.add("display");
		mui(".selected")[0].className = c + ' display';
		mask.close();
	}
}

//默认选中
function select_info(){
	var controls = document.getElementById("segmentedControls");
	var contents1 = document.getElementById("segmentedControlContents1");
	var contents2 = document.getElementById("segmentedControlContents2");

	controls.querySelector('.mui-control-item').classList.add('mui-active');
	contents1.querySelector('.mui-control-content').classList.add('mui-active');
	contents2.querySelector('.mui-control-content').classList.add('mui-active');
}

//点击蒙版
mui("body").on('tap','.mui-backdrop',function(){
	mui(".allSon")[0].classList.add('display');
	mui(".nearbySon")[0].classList.add('display');
	mui(".aiSon")[0].classList.add('display');
	mask.close();
	mui("#content")[0].style.height = '';
});

var container = new Vue({
	el:"#container",
	data:{
		level1:0,
		level2:0,
		classify:[],
		nearby:{},
		sort:{},
		filter:[]
	},
	methods:{
		switch_level1:function(idx,event){
			this.level1 = idx;
			this.level2 = 0;
		},
		switch_level2:function(idx,event,cid){
			this.level2 = idx;
			var _that = event.currentTarget;
			for(var i in this.classify[this.level1].children){
				this.classify[this.level1].children[i].checked = this.classify[this.level1].children[i].cid == cid;
			}
			if(this.classify[this.level1].children[this.level2].children == undefined){
				setTimeout(function(){
					mui("#content")[0].style.height = '';
					content.load_info('',cid,distance,sort); 
					mui(".allSon")[0].classList.add('display');
					mask.close(); 
					
					_that.innerText = _that.innerText.replace(/\s/g, "");
					mui(".all span")[0].innerText = _that.innerText;
				},200)
			}
		}, 
		item_check:function(item,button){
			for(var i in this.filter)
			{
				if(this.filter[i].paramname == item.paramname)
				{
					if(item.ifmultisel) 
					{
						for(var j in this.filter[i].child)
						{
							if(this.filter[i].child[j].value == button.value)
							{
								this.filter[i].child[j].checked = !this.filter[i].child[j].checked;
								break;
							}
						}
					}
					else
					{
						for(var j in this.filter[i].child)
							this.filter[i].child[j].checked = (this.filter[i].child[j].value == button.value);	
					}
					break;
				}
			}
			var temp = this.filter;
			this.filter = [];
			this.filter = temp;
		},
		on_ok:function()
		{
			var str = '';
			for(var i in this.filter)
				for(var j in this.filter[i].child)
					if(this.filter[i].child[j].checked)
						str += "&"+this.filter[i].paramname+"="+this.filter[i].child[j].value;
			content.load_info(str,cid,distance,sort);
			mui(".selected")[0].classList.add('display');
			mask.close();
		},
		on_reset:function(){
			for(var i in this.filter)
				for(var j in this.filter[i].child)
					if(this.filter[i].child[j].checked)
						this.filter[i].child[j].checked = !this.filter[i].child[j].checked;
			var temp = this.filter;
			this.filter = [];
			this.filter = temp;
		}
	} 
});
mui.plusReady(function(){
	app.load_conf(function(conf){
		container.classify = conf.data.class.data;
		container.nearby = conf.data.distance.child;
		container.sort = conf.data.sort.child;
		container.filter = conf.data.filter.child;
		//筛选合并对象
		for(var i in container.filter)
		{
			for(var j in container.filter[i].child)
			{
				mui.extend(container.filter[i].child[j],{checked:false});
			}
		}
		//首页cid
		var cid = '';
		window.addEventListener('loadinfo',function(event){
			cid = event.detail.cid;
			text = event.detail.text;
			setTimeout(function(){
				select_info();
				//给定高度
				mui(".classify .selected")[0].style.height = (document.documentElement.clientHeight - 88)+'px';
				mui(".all span")[0].innerText = text;
				distance = mui(".nearbySon .hide")[0].innerText; 
				sort = mui(".aiSon .hide")[0].innerText;
				
				content.load_info('',cid,distance,sort);
			},100); 
		})
	})
	mui.back = function(){
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
		
		mask.close();
	}
});
 