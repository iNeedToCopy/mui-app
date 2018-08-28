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
        styleLink.href = getCurrentScriptBase() + "/" + "FiveStar.css";
        document.head.appendChild(styleLink);
    }());

    /*这是一个五星评价控件*/
var FiveStar = Vue.extend({
        props:{
            star:{
                type:Number,
                default:5
            },
            readonly:{
                type:Boolean,
                default:false,
            }
        },
        data:function(){
            return {
                star:5,
            };
        },
        methods:{
            set_star:function(star){
                if(!this.readonly)
                    this.star = star;
            }
        },
        computed:{
            active:function(){
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAYAAACGVs+MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QTE0M0I5RUY2NTExRTdBMjZERjM4MUJGQjc1MTY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY4QTE0M0JBRUY2NTExRTdBMjZERjM4MUJGQjc1MTY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjhBMTQzQjdFRjY1MTFFN0EyNkRGMzgxQkZCNzUxNjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjhBMTQzQjhFRjY1MTFFN0EyNkRGMzgxQkZCNzUxNjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7SepQyAAABfklEQVR42tRX0W2DMBAlKP9hBHeCeIPQCdpOEDJByARJJ2i7AZmg7QQNG5BOkEwQM0FrSw/JjbCNrTNRT3oSYHP3fD6/g8nP91MSaFziC9f3Ek2IkzQJt3eJDHgJdRJKoJBg2n0OjEZg2fOsHIuAabUPV1mJRmBrGdvFJuDa6yWKMhqBkmhOEAGOfXbZ2icLU8e4cjRH2oeuLINAVRCno4QwTZ5oSrhAFXMNWUJjJ+CgXdddBgooGVWwPmOAXsAqKxuVgUvk4DY7qiL8TG5nhxRbsL9BcBWzTLXmspJoRwq+Qcw/OlChSM4RA7dY6KtJiBocvzpS8BwLtSqhwMQ3ymrHwhofKS7xIoU9Qny8e8GMiIAIaUZZyAeGpZF5E+CENRBEICckwP5lBuYDHJ8HCtfClwBzFGCnaN281QAizIcAtwR+hrPqSsY5xtpYBPZ4vjOca4ExZlDR3IdApaW0xs9nYVKzHiJKRe+0Nq+y8uH6JjRloiE4gsKkhr8CDADL7FGLy22yGgAAAABJRU5ErkJggg==';
            },
            deactive:function(){
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAYAAACGVs+MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZGOEI0ODg5RUY2NTExRTc5RUYwQkM5MEYwQkFENTA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZGOEI0ODhBRUY2NTExRTc5RUYwQkM5MEYwQkFENTA3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkY4QjQ4ODdFRjY1MTFFNzlFRjBCQzkwRjBCQUQ1MDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkY4QjQ4ODhFRjY1MTFFNzlFRjBCQzkwRjBCQUQ1MDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz40WpboAAABgUlEQVR42tRX7W2DMBClqP/LCO4E8QahE7QbhExQMkHTCZr+5B9M0HSChg3IBmQD2KC29Cy5ETb2ySbqSU8C/HHvzudnc1dVVUI0LvCD5yeBjjJJmtDtSyADPqiTUAkUAkx7z4HFCGwmvpVLETBF+3yVlWgE3ixt+9gE5tZ6g6KMRqAM1IdEgGOd5+zVJwv3M+1yohXS7hpZBoGqIU5ngcGFwBpVzDVkxG0qxx609x44ac+tIlBAyajOXIwBegHLrOzSBZzblqqUBL6T29kpxRI0N3DeqAyow2UrMC7kfAeff3SgRpFcIjoeEejBJEQdtlAbyXmOQK1KOKDjZ0DnZwTW+UhxiYEh7AXi430WPAQiMFAOo4xywbBIszcBHrAGSATygATYv8zAymHii6NwrX0JsJkCVIqm+m0diDAfAtzi+B2T1VcyztE2xiLQ4PvesK8HtDGDiuY+BGotpS1+PguTmk0QkSr6qB3zMitHn0tpr90PO2Ll9yCtMjaphr8CDAB2hE2Eo4zqFwAAAABJRU5ErkJggg==';
            }
        },
        mounted:function(){

        }
    }
);
FiveStar.options.template = '\
    <span>\
          <img :src="(idx+1)>star?deactive:active" :key="idx" v-for="(str,idx) in [1,2,3,4,5]" class="star" @tap="set_star(idx+1)">\
          <!-- <br>\
          <span class="five-star-text">{{star}}星好评</span> -->\
    </span>\
'

global.FiveStar = FiveStar;

global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/FiveStar.vue']=FiveStar;
Vue.component('vue-five-star', FiveStar);


}(window, Vue));