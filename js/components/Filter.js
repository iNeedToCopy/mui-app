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
        styleLink.href = getCurrentScriptBase() + "/" + "Filter.css";
        document.head.appendChild(styleLink);
    }());
var Filter = Vue.extend({
        props:{

        },
        data:function(){
            return {
                toolbar:[{text:'全部分类',active:false},{text:'附近',active:false},{text:'智能排序',active:false},{text:'筛选',active:false}],/*顶部工具栏*/
                panels:[],/*弹出面板*/
                mask:null,/*遮罩层*/
                current_filter:{}/*设置的筛选条件*/,
                category:[],
                filter:[],
				nearby:[],
				sort:[],
				first_level:{index:-1,text:'',cid:''},
	            second_level:{index:0,text:'',cid:''},
				third_level:{index:0,text:'',cid:''},
                selected_img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAcCAMAAAA6Aj1XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU2NkY1ODlBMDMzQjExRThBN0ExRkMxRDU0QkNCRTRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU2NkY1ODlCMDMzQjExRThBN0ExRkMxRDU0QkNCRTRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTY2RjU4OTgwMzNCMTFFOEE3QTFGQzFENTRCQ0JFNEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTY2RjU4OTkwMzNCMTFFOEE3QTFGQzFENTRCQ0JFNEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5GCXBDAAABF1BMVEX6eCD5eSL7eCD5eSD/+fX///77eh/7eSP6eiH6eiP3eiD+4s/8eR/8kUv6gC3/+PT6eCL/+fT7k0z8eCP7eyL6gTD7gS76eR7////5gC35eCT8q3T6eSX8eSH6eh/7eyT6eCT9qnb5eR7948/4ex//49H7eSX8lE38kUn+59f8q3P7q3b848//5NH7rHT8eCX6gTL++vX++fb5gjD3eSL4eB/4eCH8rXn7dyL5gC/7rHP8eiL4fin8iD3//fz7gDD6gS75dx/+rXb6kkn5dyH9dyD7eh74gS/8rXX8fy/7eyD8q3b8j0r+6Nv/+vb9zKr++fX+q3X7eB39rHX6eR36kkv3eyH4eiP7rHr959j9sH77eSH///9prQP9AAAAXXRSTlP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wDhr52QAAABTElEQVR42oTS1XLDQAwFUK3X3rVjxxBmThsoMzMzk/T/39F2MmnSxLH38c6Z0ehqgUJftUoEoWod091w9hhJz/PnEKZ9gLGhuHMhLIanCLITPFSLRgTnpW7wCtq0YjGEDgWzqJJgTOYpkGmxiMWm8JoCmXZceH8ylDwFssyrBS721SSmRcsVNNwtGjD1zqcvARGAexow73x5abwv3UjUzEECTlKXtjPWV0Uqs0MR7NaKgCl1tC/YNocjUA8MBfmQ6/UlZv4NAFKzjXjubKHvMi0GgqFJI4wcW7zlILXYUzeIyKFJY4y8TRHXr/Z/99hrIeMg6+TDyLMbuJqzPXq4ZMgt3SRfRk5Wj7sy+5ksAYKP6h9LtRW2JsqHruDSR/3dVE0WXk4MZAzqFMBI3Snq8LNlkwIZ3cq0gXBBIYzaHNkRhTJqr3xN+svfAgwA/IE7MBMPEXoAAAAASUVORK5CYII=',
				active_img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3QjNCOEY3RkY0MzExRTdBN0VGQjI1QkEwQTY5ODkxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg3QjNCOEY4RkY0MzExRTdBN0VGQjI1QkEwQTY5ODkxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODdCM0I4RjVGRjQzMTFFN0E3RUZCMjVCQTBBNjk4OTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODdCM0I4RjZGRjQzMTFFN0E3RUZCMjVCQTBBNjk4OTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz57hTLfAAAAQ0lEQVR42mKcOXMmAw7QCKXrsUmy4NFUh8TH0MxEhKY6JNtxakTXhFMzExGasGqG+bEJiGsZCAOYwfUsJGhC0QwQYACSHw3Qilwy2wAAAABJRU5ErkJggg==',
                deactive_img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc2NzQ3REYxRkY0MzExRTdBOTYyQjE5ODlBMkE2RTM5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc2NzQ3REYyRkY0MzExRTdBOTYyQjE5ODlBMkE2RTM5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzY3NDdERUZGRjQzMTFFN0E5NjJCMTk4OUEyQTZFMzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzY3NDdERjBGRjQzMTFFN0E5NjJCMTk4OUEyQTZFMzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7J8OYAAAAAS0lEQVR42mKcOXNmMwMDQw0DaaCZCUjUAnELKZqAuI4JyqmFChClCcRgQhKsI6AZrgldIz7NKJqwacSmGUMTCLDgcFYdDjYcAAQYAOmuDmK6qULUAAAAAElFTkSuQmCC',
                show_mask:false,
            };
        },
        methods:{
            reset:function(){
                for(var i in this.toolbar)
                    this.toolbar[i].active = false;
                this.show_mask = false;
            },
            init:function(conf){
                this.category = conf.data.class.data;
                this.sort = conf.data.sort.child;
                this.filter = conf.data.filter.child;
                this.nearby = conf.data.distance.child;

                for(var i in this.category)
                {
                    this.category[i].checked = false;
                    if('children' in this.category[i])
                    {
                        for(var j in this.category[i].children)
                        {
                            this.category[i].children[j].checked = false;
                            if('children' in this.category[i].children[j])
                            {
                                for(var k in this.category[i].children[j].children)
                                    this.category[i].children[j].children[k].checked= false;
                            }
                        }
                    }
                }
                for(var i in this.filter)
                    for(var j in this.filter[i].child)
                        this.filter[i].child[j].checked  = false;
                for(var i in this.nearby)
                    this.nearby[i].checked = false;
                for(var i in this.sort)
                    this.sort[i].checked = false;
            },
			toolitem_clicked:function(idx){
				if(this.toolbar[idx].active){
                    this.toolbar[idx].active = false;
                    this.show_mask = false;
                }
				else{
					for(var i in this.toolbar){
						this.toolbar[i].active = i == idx;
                    }
                    this.show_mask = true;
				}
			},
            internal_select_first_level:function(idx,text,cid){
				console.log(cid);
				this.first_level.index = idx;
				this.first_level.text = text;
				this.first_level.cid = cid;
				
				this.second_level.index = 0;this.second_level.cid='';
				this.third_level.index = 0;this.third_level.cid='';
				for(var i in this.category)
					this.category[i].checked = this.category[i].cid == cid;
				if(!('children' in this.category[idx]))
				{
					this.internal_category_selected(text,cid);
				}
			},
			internal_select_second_level:function(idx,text,cid){
				this.second_level.index = idx;
				this.second_level.text = text;
				this.second_level.cid = cid;
				
				this.third_level.index = 0;
				for(var i in this.category[this.first_level.index].children)
					this.category[this.first_level.index].children[i].checked = this.category[this.first_level.index].children[i].cid == cid;
				if(!('children' in this.category[this.first_level.index].children[idx]))
				{
					this.internal_category_selected(text,cid);
				}
			},
			internal_select_third_level:function(idx,text,cid){
				this.third_level.index = idx;
				this.third_level.text = text;
				this.third_level.cid = cid;
				
				for(var i in this.category[this.first_level.index].children[this.second_level.index].children)
					this.category[this.first_level.index].children[this.second_level.index].children[i].checked = this.category[this.first_level.index].children[this.second_level.index].children[i].cid == cid;
				//alert(text);
				var temp = this.category[this.first_level.index].children[this.second_level.index].children;
				this.category[this.first_level.index].children[this.second_level.index].children = [];
				this.category[this.first_level.index].children[this.second_level.index].children = temp;
				this.internal_category_selected(text,cid);
			},
			internal_category_selected:function(text,cid){
                this.toolbar[0].text = text;
                this.toolbar[0].active = false;
                this.show_mask = false;
				this.$emit("category_changed",cid);
			},
			internal_filter_item_check:function(item,button){
               
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
			internal_distance_tap:function(item){/*点击距离*/
				for(var i in this.nearby){
					this.nearby[i].checked = item.name == this.nearby[i].name;
                }
                this.toolbar[1].text = item.name;
                this.toolbar[1].active = false;
                this.show_mask = false;
                this.$emit("distance_changed",item.value);
			},
			internal_sort_tap:function(item){/*点击排序规则*/
				for(var i in this.sort){
					this.sort[i].checked = item.name == this.sort[i].name;
                }
                this.toolbar[2].text = item.name;
                this.toolbar[2].active = false;
                this.show_mask = false;
                this.$emit("sort_changed",item.value);
            },
            internal_reset_filter:function(){
                for(var i in this.filter)
				for(var j in this.filter[i].child)
					if(this.filter[i].child[j].checked)
						this.filter[i].child[j].checked = !this.filter[i].child[j].checked;
                var temp = this.filter;
                this.filter = [];
                this.filter = temp;
            },
            internal_set_filter:function(){
                var str = '';
                for(var i in this.filter)
                    for(var j in this.filter[i].child)
                        if(this.filter[i].child[j].checked)
                            str += "&"+this.filter[i].paramname+"="+this.filter[i].child[j].value;
                this.toolbar[3].active = false;
                this.show_mask = false;
                this.$emit("filter_changed",str);
            },
            internal_mask_tap:function(){/*点击遮罩层*/
                this.show_mask = false;
                for(var i in this.toolbar)
                    this.toolbar[i].active = false;
            }
        },
        mounted:function(){
           
			
        }
    }
);
Filter.options.template = '\
    <div class="vue-hi-filter-wrapper">\
        <!-- 工具栏 -->\
        <ul class="toolbar">\
            <li class="toolitem" :key="idx" v-for="(itm,idx) in toolbar" @tap="toolitem_clicked(idx)">\
                <span>{{itm.text}}</span>\
				<img v-if="itm.active" :src="active_img">\
				<img v-else="" :src="deactive_img">\
            </li>\
        </ul>\
		<div class="panel">\
            <!-- 分类 -->\
            <div class="mui-row category" v-show="toolbar[0].active == true">\
                <div class="scrollable mui-col-sm-4 mui-col-xs-4">  \
                    <ul class="d">  \
                        <li :class="{class_checked:first.checked}" :key="idx" v-for="(first,idx) in category" v-if="first.ifcommerce==false" @tap="internal_select_first_level(idx,first.text,first.cid)">{{first.text}}</li>\
                    </ul>  \
                </div>\
                <div v-if="category.length>0 && first_level.index>=0" class="scrollable mui-col-sm-4 mui-col-xs-4">   \
                    <ul class="d">  \
                        <li :class="{class_checked:second.checked}" :key="idx" v-for="(second,idx) in category[first_level.index].children" @tap="internal_select_second_level(idx,second.text,second.cid)">{{second.text}}</li>\
                    </ul>  \
                </div> \
                <div v-if="category.length>0 && (first_level.index>=0 && second_level.index>=0)&&  (\'children\' in category[first_level.index]) && category[first_level.index].children.length>0 && (\'children\' in category[first_level.index].children[second_level.index])" class="scrollable mui-col-sm-4 mui-col-xs-4">  \
                    <ul class="d">  \
                        <li :class="{class_checked:third.checked}" :key="idx" v-for="(third,idx) in category[first_level.index].children[second_level.index].children" @tap="internal_select_third_level(idx,third.text,third.cid)">{{third.text}}</li>\
                    </ul>  \
                </div>\
            </div>\
            <!-- 距离 -->\
            <ul class="distance" v-show="toolbar[1].active == true">\
                <li :class="{list_checked:item.checked}" :key="idx" v-for="(item,idx) in nearby" @tap="internal_distance_tap(item)" :value="item.value">\
                    {{item.name}}\
                    <img v-show="item.checked" :src="selected_img" alt="">\
                    </li>\
            </ul>\
            <!-- 排序 -->\
            <ul class="sort" v-show="toolbar[2].active == true">\
                <li :class="{list_checked:item.checked}" :key="idx" v-for="(item,idx) in sort" :type="item.value" @tap="internal_sort_tap(item)">\
                    {{item.name}}\
                    <img v-show="item.checked" :src="selected_img" alt="">\
                </li>\
            </ul>\
            <!-- 筛选 -->\
            <div class="filter" v-show="toolbar[3].active == true"> \
                <div class="type" :key="index" v-for="(item,index) in filter">\
                    <div class="title">{{item.zhname}}</div>\
                    <div class="content">\
                        <span class="item" :class="{checked:button.checked}" :key="idx" v-for="(button,idx) in item.child" @tap="internal_filter_item_check(item,button)">{{button.name}}</span>\
                    </div>\
                </div>\
                <div style="height:30px;"></div>\
                <div class="btnBox">    \
                    <button type="button" @tap="internal_reset_filter()">重置</button> \
                    <button type="button" class="confirm" @tap="internal_set_filter()">确定</button>\
                </div>\
                <div style="height:20px;"></div>\
            </div>\
        </div>\
        \
        <div id="mask" v-show="show_mask" @tap="internal_mask_tap()"></div>\
        <slot></slot>\
    </div>\
'

global.Filter = Filter;

global.__FORGE_ES6_VUE_COMPONENTS__['D:/work/zhonglai/dev/frontend/components/src/Filter.vue']=Filter;
Vue.component('vue-filter', Filter);


}(window, Vue));