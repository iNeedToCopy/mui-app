(function(global, Vue, undefined){
    if(!global.__FORGE_ES6_VUE_COMPONENTS__) {
        global.__FORGE_ES6_VUE_COMPONENTS__ = {};
    }

    (function(){
        function getCurrentScriptBase() {
            var src,
                lidx,
                scripts;
            
            if (document.currentScript) {
                src = document.currentScript.src;
            } else {
                scripts = document.getElementsByTagName('script');
                src = scripts[scripts.length - 1].src;
            }
            
            lidx = src.lastIndexOf("/");
            
            return src.substring(0, lidx);
        }
        
        var styleLink = document.createElement('link');
        styleLink.rel = "stylesheet";
        styleLink.href = getCurrentScriptBase() + "/" + "SmsCodeSender.css";
        document.head.appendChild(styleLink);
    }());
var SmsCodeSender = Vue.extend({
    data:function(){
        return {
            title:"获取验证码",
			timer:0,
			num :60,	
			can_send:true
        };
    },
    methods:{
        reset:function(){
            this.num=0;
            this.title="获取验证码";
        },
        send_code:function(){
        	var _self = this;
            if(_self.can_send){
				_self.can_send = false;
        		_self.num = 60; 
                _self.timer = setInterval(function(){
					_self.title = "等待"+_self.num+"秒";
					_self.num--;
					if(_self.num<1){
						clearInterval(_self.timer);
						_self.title="获取验证码";
						_self.can_send = true;
					}
				},1000);
            	this.$emit("send_code","");
            }else{
            	return;
            }  
        }
    }
}
);
SmsCodeSender.options.template = '\
  <span class="smscodesender" @tap="send_code">{{title}}</span>\
'

global.SmsCodeSender = SmsCodeSender;

global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/SmsCodeSender.vue']=SmsCodeSender;
Vue.component('vue-sms-code-sender', SmsCodeSender);


}(window, Vue));