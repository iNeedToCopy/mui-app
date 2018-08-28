mui.init();
//服务人员数据
var service
var service = new Vue({
	el:"#service",
	data:{
		items:[
			{name:'超哥',job:'店长',img:''},
			{name:'超哥',job:'店长',img:''},
			{name:'超哥',job:'店长',img:''},
			{name:'超哥',job:'店长',img:''},
			{name:'超哥',job:'店长',img:''}
		]
	}
});
//评价
var evaluate = new Vue({
	el:"#evaluate",
	data:{
		Text1:[
			{evaluate:'很好吃'},
			{evaluate:'非常不错'},
			{evaluate:'服务态度好'},
			{evaluate:'很好吃'}
		],
		Text2:[
			{evaluate:'特别划算'},
			{evaluate:'味道好吃'},
			{evaluate:'很好吃'},
			{evaluate:'很好吃'}
		],
		pics:[
			{username:'张三',date:'2018-1-1',content:'xxxx非常好吃！',img1:'',img2:'',img3:''},
			{username:'张三',date:'2018-1-1',content:'xxxx非常好吃！',img1:'',img2:'',img3:''},
			{username:'张三',date:'2018-1-1',content:'xxxx非常好吃！',img1:'',img2:'',img3:''}
		]
		
	}
});
//猜你喜欢
var like = new Vue({
	el:"#like",
	data:{
		contents:[
			{img:'',shopName:'爱达乐',location:'xxxx',satisfy:'85',per:'50',classify:'蛋糕',distance:'1km',free:'买单即送11元',voucher:'3元代金券'},
			{img:'',shopName:'爱达乐',location:'xxxx',satisfy:'85',per:'50',classify:'蛋糕',distance:'1km',free:'买单即送11元',voucher:'3元代金券'},
			{img:'',shopName:'爱达乐',location:'xxxx',satisfy:'85',per:'50',classify:'蛋糕',distance:'1km',free:'买单即送11元',voucher:'3元代金券'},
			{img:'',shopName:'爱达乐',location:'xxxx',satisfy:'85',per:'50',classify:'蛋糕',distance:'1km',free:'买单即送11元',voucher:'3元代金券'}
		]
	}
})
//代金券
var voucher = new Vue({
	el:"#voucher",
	data:{
		vouchers:[
			{img:'',shopName:'面包新语',score1:'10',score2:'100',score3:'1888'},
			{img:'',shopName:'面包新语',score1:'10',score2:'100',score3:'1888'}
		]
	}
})
//本店在售
var onSale = new Vue({
	el:"#onSale",
	data:{
		onSales:[
			{goodsName:'胡萝卜面包',score1:'10',score2:'88'},
			{goodsName:'胡萝卜面包',score1:'10',score2:'88'},
			{goodsName:'胡萝卜面包',score1:'10',score2:'88'}
		]
	}
})
//本店在售tab
var tab = document.getElementById('onSale');
var li = tab.getElementsByTagName('li');
var items = tab.getElementsByClassName('items');
 for(var i=0;i<li.length;i++){
    li[i].index=i;
    li[i].onclick=function(){
      if(this.index==2){
	      var par1 = this.parentNode;
	      var Fchild1 = par1.firstChild;
	      var FCchild1 = Fchild1.firstChild;
	      //清除样式
	      FCchild1.classList.remove('current');
	      var Lchild1 = par1.lastChild;
	      var Cchild1 = Lchild1.firstChild;
	      //添加样式
	      Cchild1.className = 'current'
	      
	      //隐藏与显示
	      for(var j=0;j<items.length;j++){
	      	items[0].className='hide';
	      	items[1].classList.remove("hide");
	      }
	      
      }else{
      	  var par2 = this.parentNode;
	      var Fchild2 = par2.lastChild;
	      var LCchild2 = Fchild2.firstChild;
	      //清除样式
	      LCchild2.classList.remove('current');
	      var Fchild2 = par2.firstChild;
	      var Cchild2 = Fchild2.firstChild;
	      Cchild2.className = 'current'
	      
	      //隐藏与显示
	      for(var j=0;j<items.length;j++){
	      	items[1].className='hide';
	      	items[0].classList.remove("hide");
	      }
	      
      }
       
    }
}
