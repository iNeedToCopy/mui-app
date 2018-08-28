(function(global, Vue, undefined){
    if(!global.__FORGE_ES6_VUE_COMPONENTS__) {
        global.__FORGE_ES6_VUE_COMPONENTS__ = {};
    }
var xbutton = global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/"../controls/xbutton"']
var xtext = global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/"../controls/xtext"']
var form = Vue.extend({
  
}
);
form.options.template = '\
    <div>\
        <xtext></xtext>\
        <xbutton></xbutton>\
    </div>\
'

global.form = form;

global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/form.vue']=form;
Vue.component('vueform', form);


}(window, Vue));