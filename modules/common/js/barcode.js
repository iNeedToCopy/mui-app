mui.init();
var ws=null,wo=null; 
var scan=null;

mui.ready(function(){
	window.addEventListener("scan",function(event){
		if(ws||!window.plus){ 
	        return; 
	    } 
	    // 获取窗口对象 
	    ws=plus.webview.currentWebview(); 
	    wo=ws.opener(); 
	    // 开始扫描 
	    ws.addEventListener('show', function(){ 
	    	var filter=[plus.barcode.QR,plus.barcode.CODE128,plus.barcode.EAN13,plus.barcode.EAN8];
	    	var styles = {frameColor: "#fa7921",scanbarColor: "#fa7921",frameWidth:"400px",frameHeight:"200px"}
	        scan=new plus.barcode.Barcode('bcid',filter,styles); 
	        scan.onmarked=onmarked; 
	        scan.start();
			console.log(1)
	    }); 
	    // 显示页面并关闭等待框 
	    ws.show('pop-in'); 
	});
});

// 二维码扫描成功 
function onmarked(type, result){ 
console.log(2)
    switch(type){ 
        case plus.barcode.CODE128: 
    	type = 'CODE128'; 
   		break; 
   		case plus.barcode.EAN13:
   		type = 'EAN13';
   		break;
   		case plus.barcode.QR:
   		type = 'QR';
   		break;
   		case plus.barcode.EAN8:
   		type = 'EAN8';
   		break;
    } 
    console.log(result);
    result = result.replace(/\n/g, '').replace(/\"/g, ""); 
    console.log(result);
    //分析扫描结果：是URL就跳转 ，不是就提示 
    if(result.indexOf('http://')==0  || result.indexOf('https://')==0){ 
        plus.nativeUI.confirm(result, function(i){ 
        	console.log(i)
            if(i.index == 0){ 
                plus.runtime.openURL(result); 
            }else{ 
            	plus.nativeUI.alert("无法识别此图片");
            } 
        }, '', ['打开', '取消']); 
    } else{ 
        plus.nativeUI.alert("code:"+result); 
    } 
} 
// 从相册中选择二维码图片  
function scanPicture(){ 
    plus.gallery.pick(function(path){ 
        plus.barcode.scan(path,onmarked,function(error){ 
            plus.nativeUI.alert('无法识别此图片'); 
        }); 
    }, function(err){ 
        plus.nativeUI.alert('Failed: '+err.message); 
    }); 
} 

mui.plusReady(function(){
	window.addEventListener('loadinfo',function(){
		
	})
	mui.back = function(){
		ws=null;
		wo=null;
		scan=null;
		plus.webview.hide(plus.webview.currentWebview(),"slide-out-right");
	}
})
 
