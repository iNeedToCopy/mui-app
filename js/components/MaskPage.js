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
        styleLink.href = getCurrentScriptBase() + "/" + "MaskPage.css";
        document.head.appendChild(styleLink);
    }());
var MaskPage = Vue.extend({
		props:{
			id:{
				required:false,
				default:"_mask_page_"
			},
			title:{
				required:true,
				default:""
			}
		},
		data:function(){
			return {
				
			};
		},
		methods:{
			show:function(){
				mui("#"+this.id).popover("show");
			},
			hide:function(){
				mui("#"+this.id).popover("hide");
			}
		}
    }
);
MaskPage.options.template = '\
	<div :id="id" class="wrapper mui-popover mui-popover-action mui-popover-bottom">\
		<div class="title">\
			<p style="color:#fff">{{title}}</p>\
		</div>\
		<div class="body">\
			<slot></slot>\
		</div>\
		<div class="footer">\
\
		</div>\
	</div>\
'

global.MaskPage = MaskPage;

global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/MaskPage.vue']=MaskPage;
Vue.component('vue-mask-page', MaskPage);


}(window, Vue));