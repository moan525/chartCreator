var chartCreator = (function($,Mchart) {
	'use strict';
    var Chart = (function() {
    	'use strict';
    	function Chart(type,element,main_title,sub_title,json,x_label,y_label) {
    		// enforces new
    		if (!(this instanceof Chart)) {
    			return new Chart(element);
    		}
    		this.$element = $(element);
    		this.$title = this.$element.find('.title');
    		this.$title.$main = this.$title.find('.main');
    		this.$title.$sub = this.$title.find('.sub');
    		this.$content = this.$element.find('.content');
    		this.chart = new Mchart(type,this.$content.find('canvas')[0]);

            if(main_title && this.$title.$main.length > 0){
            	this.setMainTitle(main_title);
            }
            if(sub_title && this.$title.$sub.length > 0){
            	this.setSubTitle(sub_title);
            }
            if(json && x_label && y_label){
                var data = initData(json,x_label,y_label);
                this.setData(data['x_data'],data['y_data'],data['min'],data['max']);
            }
    	}
    	Chart.prototype.setMainTitle = function(text) {
    	   this.$title.$main.text(text);
    	};
        Chart.prototype.setSubTitle = function(text) {
           this.$title.$sub.text(text);
        };
        Chart.prototype.setData = function(x_data,y_data,min,max) {
        	this.chart.draw(x_data,y_data,min,max);
        };
        function initData (json,x_label,y_label) {
        	var data = jQuery.parseJSON(json);
        	var result = {
        		'x_data' : [],
        		'y_data' : [],
        		'min' : 0,
        		'max' : 0
        	};
        	if(data && data.length && data.length>0 && x_label && y_label){
               result['min'] = Number.MAX_SAFE_INTEGER;
               result['max'] = Number.MIN_SAFE_INTEGER;
               for (var i = 0; i < data.length; i++) {
               	 var item = data[i];
               	 result['x_data'].push(item[x_label]);
		       	 result['y_data'].push(item[y_label]-0);
		       	 result['min'] = Math.min(result['min'],item[y_label]);
		       	 result['max'] = Math.max(result['max'],item[y_label]);
               };
        	}
        	return result;
        }
    	return Chart;
    }());
    var chartCreator = {
    	Line : function(element,main_title,sub_title,json,x_label,y_label){
    		var chart = new Chart('line',element,main_title,sub_title,json,x_label,y_label);
    		return chart;
    	},
    	Bar : function(element,main_title,sub_title,json,x_label,y_label){
    		var chart = new Chart('bar',element,main_title,sub_title,json,x_label,y_label);
    		return chart;
    	},
    	autoInit : function(main_title,sub_title,json,x_label,y_label){
            var that = this;
    		$('.chart.line').each(function(index, el) {
    			that.Line(el,main_title,sub_title,json,x_label,y_label);
    		});
    		$('.chart.bar').each(function(index, el) {
    			that.Bar(el,main_title,sub_title,json,x_label,y_label);
    		});
    	}
    };
	return chartCreator;
}(jQuery,Mchart));
