/**
 *  对话框的HTML,很简单的布局!
  	<div class="layer_root">
		<div class="layer_main">
			<div class="layer_title">标题</div>
			<div class="layer_content">内容</div>
			<table class="layer_btns">
				<tr>
					<td class="layer_btn_left">左按钮</td>
					<td class="layer_btn_middle">中按钮</td>
					<td class="layer_btn_right">右按钮</td>
				</tr>
			</table>
		</div>
	</div>
 */

/**
 * 创建对话框
 *
 * 必填项:
 * content:"内容" (字符串; 可为html)
 *
 * 选填项:
 * title:"标题" (字符串; 不传值默认 "温馨提示:";传空串"",则不显示标题;)
 * btn:["按钮1","按钮2",...] (数组; 空则不显示按钮)
 * event:[回调1,回调2,...] (数组; 和按钮数组对应;如果回调return true,则点击按钮后不关闭对话框)
 * shadeClose:false (布尔值; 点击对话框外面是否关闭; 默认false不关闭)
 * backClose:true (布尔值; Android点击back键关闭; 默认true关闭)
 * closeEvent:function (对话框关闭的回调)
 * style:{"title":"样式","content":"样式","btn":"样式"}//自定义样式(标题,内容,按钮)
 */
function layerOpen(options) {
	if (!options || !options.content) return;
	//根布局
	var layer_root = document.createElement("div");
	layer_root.setAttribute("id", "layer_root");
	layer_root.setAttribute("class", "layer_root opacityIn");
	//标题
	var layer_title;
	var layer_title_style='class="layer_title"';
	if (options.style&&options.style.title) {
		layer_title_style+=" style='"+options.style.title+"'";
	}
	if (options.title==null){
		//1.如果不传,则默认标题:温馨提示
		layer_title='<div '+layer_title_style+'>温馨提示:</div>';
	}else if(options.title==""){
		//2.如果传空串"",则不显示标题
		layer_title="";
	}else{
		//3.如果有值,则显示对应的值
		layer_title='<div '+layer_title_style+'>' + options.title + '</div>' 
	}
	//按钮
	var layer_btns = "";
	var layer_btns_style='id="layer_btns" class="layer_btns"';
	if (options.style&&options.style.btn!=null) {
		layer_btns_style+=" style='"+options.style.btn+"'";
	}
	if (options.btn) {
		var btn_count = options.btn.length;
		if (btn_count == 1) {
			//1.只有一个按钮
			layer_btns = '<table '+layer_btns_style+'><tr><td id="0" class="layer_btn_single">' + options.btn[0] + '</td></tr></table>';
		} else if (btn_count == 2) {
			//2.只有两个按钮
			layer_btns = '<table '+layer_btns_style+'><tr><td id="0" class="layer_btn_left">' + options.btn[0] + '</td><td id="1" class="layer_btn_right">' + options.btn[1] + '</td></tr></table>';
		} else if (btn_count > 2) {
			//3.有多个按钮
			for (var i = 0; i < btn_count; i++) {
				if (i == 0) {
					layer_btns += '<td id="0" class="layer_btn_left">' + options.btn[i] + '</td>'; //最左边的按钮
				} else if (i < btn_count - 1) {
					layer_btns += '<td id="'+i+'" class="layer_btn_middle">' + options.btn[i] + '</td>'; //中间的按钮
				} else {
					layer_btns += '<td id="'+i+'" class="layer_btn_right">' + options.btn[i] + '</td>'; //最右边的按钮
				}
			}
			layer_btns = '<table '+layer_btns_style+'><tr>' + layer_btns + '</tr></table>';
		}
	}
	//拼接主体:标题,内容,按钮
	var layer_content_style='class="layer_content"';
	if (options.style&&options.style.content!=null) {
		layer_content_style=" style='"+options.style.content+"'";
	}
	var layerHTML = '<div class="layer_main scaleIn opacityIn" id="layer_main">' 
				  + layer_title
				  + '<div '+layer_content_style+'>' + options.content + '</div>' 
				  + layer_btns 
				  + '</div>';
	layer_root.innerHTML = layerHTML;
	//加入到body中显示
	document.body.appendChild(layer_root);
	//按钮点击事件
	if (layer_btns) {
		var layer_btns_dom = document.getElementById("layer_btns");
		if (layer_btns_dom) {
			layer_btns_dom.addEventListener("tap", function(e) {
				var tagId = e.target.getAttribute("id");
				if (tagId) {
					var index=Number(tagId);
					if (options.event&&options.event.length>index) {
						var event=options.event[index];
						if (event && event()) return; //执行回调返回true,则继续显示对话框
					}
					layerClose(options.closeEvent);
				}
			});
		}
	}
	//对话框主体,阻止事件冒泡
	var layer_main = document.getElementById("layer_main");
	layer_main.addEventListener("tap",function (e) {
		e.stopPropagation();
	});
	//点击对话框外是否关闭
	if (options.shadeClose) {
		layer_root.addEventListener("tap",function () {
			layerClose(options.closeEvent);
		});
	}
	//Android点击back键是否关闭,默认不传,则为true关闭
	if (options.backClose!=false&&mui.os.android) {
		var old_back = mui.back;
		//重写back方法
		mui.back = function() {
			layerClose(options.closeEvent);
		}
		//关闭后需还原
		androidBackEvent=function () {
			mui.back=old_back;
		}
	}
}
/*
 * 关闭对话框
 */
var androidBackEvent;//Android点击后退键关闭对话框的回调
function layerClose(closeEvent) {
	var layer_root = document.getElementById("layer_root");
	if (layer_root){
		//关闭动画320毫秒,比300毫秒长一点,防止闪烁
		var layer_main = document.getElementById("layer_main");
		layer_main.classList.add("scaleOut");
		layer_main.classList.add("opacityOut");
		layer_root.classList.add("opacityOut");
		//延时关闭,防止事件穿透
		setTimeout(function () {
		 	document.body.removeChild(layer_root);
		},300);
	}
	//对话框关闭的回调
	closeEvent&&closeEvent();
	//Android点击后退键关闭对话框的回调
	androidBackEvent&&androidBackEvent();
}