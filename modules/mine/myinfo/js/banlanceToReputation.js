mui.init();

var container = new Vue({
	el:'#container',
	data:{
		money:''
	},
	methods:{
		check:function(){
			// /remain/to/money
			this.money = this.money *1;
			return this.money >0;
		},
		do_transform:function(){
			if(!this.check())
			{
				mui.toast("请输入正确的余额");return;
			}
			var btnArray = ['取消', '确定'];
			mui.confirm('是否确定转换?', '余额转信值', btnArray, function(e) {
				if (e.index == 1) 
				{
					var w = plus.nativeUI.showWaiting();
					app.http_post("/remain/to/money",{money:container.money},
						function(ret){
							mui.toast(ret.desc);
							
							w.close();
							if(ret.code == 200)
							{
								app.update_opener();
								mui.back();
								//console.log(plus.webview.getTopWebview());
							}
								
						},function(x,t,e){
							w.close();
					});
				}
			});
		}
	}
});

mui.ready(function(){
	mui.back = function(event)
	{
	   plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	};
	
	/*//隐藏弹出框
	mui("#popover .page1 .title").on('tap','img',function(){
		mui('#popover').popover('hide')
	});
 	//获取手机屏幕宽度
    var screenW = screen.width;
    var width = -screenW+"px";
    var Width = 2*screenW+"px";
    mui("#popover")[0].style.width=Width;
	//点击付款的动画
	mui("#popover .page1").on('tap','button',function(){
		mui("#popover")[0].style.transform="translate3d("+width+",0,0)";
	});
	//点击箭头返回
	mui("#popover .page2 .title").on('tap','img',function(){
		mui("#popover")[0].style.transform="translate3d(0,0,0)";
	});
	//支付密码
        var activeLength = 0;
        var resultValue = "";
        var inputList = mui(".input_item");
        var numberList = mui(".keyboard_number");
        mui("#keyboard").on("tap", ".keyboard_number", function() { 
            if(activeLength == 6) {
                return;
            }
            var num = this.innerText;
            addNumber(num);
        });
        mui("#keyboard").on("tap", ".keyboard_action", function() {
            if(activeLength == 0) {
                return;
            }
            cancelNumber();
        });
        // 添加数字
        function addNumber(num) {
        	inputList[activeLength].value=num;
            resultValue += num;
            activeLength++;
            // 检测密码长度
            if(activeLength == 6) {
                if(resultValue != "123456") {
                    wrongPassword();
                } else {
                    mui.toast("密码正确，跳转到下一个页面");
                }
            }
        }
        // 撤销数字
        function cancelNumber() {
            activeLength--;
            inputList[activeLength].value = "";
            resultValue = resultValue.substring(0, resultValue.length - 1);
        }
     	// 密码框置空
        function resetInput() {
            activeLength = 0;
            resultValue = "";
            mui(".input_item").each(function(index, element) {
                element.value = "";
            });
        }
        // 密码错误
        function wrongPassword() {
            mui.confirm("密码错误", "验证结果", ["重新输入", "忘记密码"], function(event) {
                var index = event.index;
                if(index == 0) {
                    mui.toast("请再次输入");
                } else {
                    mui.toast("下一步跳转到忘记密码的页面");
                }
                resetInput();
            });
        }*/
});


mui.plusReady(function(){
	
});