/**
 * Mchart 
 * 对Chart.js图表进行二次封装，仅针对折线图，条形图和雷达图
 * @author jade
 */
var Mchart = (function($) {
	'use strict';
  
	var bar_data = {
       labels : [],
       datasets : [{
       fillColor : 'rgba(255,158,71,0.5)',
       strokeColor :'rgba(255,158,71,0.8)',
       highlightFill : 'rgba(255,158,71,0.75)',//hover color
       highlightStroke : 'rgba(255,158,71,1)',//hover color
       data : []
       }]
	};
  var bar_option = {
       // responsive: true,//auto resize when window resizes
       // maintainAspectRatio: false,
       //scale set
       scaleBeginAtZero : false,
       scaleIntegersOnly: false    
  };

	var line_data = {
		labels : [],
    datasets : [{
      fillColor : 'rgba(255,158,71,0.5)',
      strokeColor : 'rgba(255,158,71,1)',
      pointColor : 'rgba(255,158,71,1)',
      pointStrokeColor : '#fff',
      pointHighlightFill : "#fff",// hover color
      pointHighlightStroke : "rgba(255,158,71,1)",//hover color
      data : []
    }]
	};
  var COLOR_LIST = ['64,120,192',
  '65,12,64',
  '71,64,192',
  '177,64,192',
  '161,16,16',
  '133,16,161'];
  function lineColorInit (color){
    var obj = {};
    var pre = 'rgba(';
    var end = ')';
    obj['fillColor'] = pre+ color+',0.5'+end;
    obj['strokeColor'] = pre + color +',1' +end;
    obj['pointColor'] = pre + color +',1' +end;
    obj['pointStrokeColor'] = '#fff';
    obj['pointHighlightFill'] = '#fff';
    obj['pointHighlightStroke'] = pre + color +',1' +end;
    return obj;
  };

  var line_option = {
    //responsive: true,//auto resize when window resizes
    // maintainAspectRatio: false,

    bezierCurve: false,
    //scale
    scaleBeginAtZero : false,
    scaleIntegersOnly: false
  };
     
  var radar_data = {
    labels : [],
    datasets : [{
      fillColor : 'rgba(255,158,71,0.2)',
      strokeColor : 'rgba(255,158,71,1)',
      pointColor : 'rgba(255,158,71,1)',
      pointStrokeColor : '#fff',
      pointHighlightStroke : 'rgba(255,158,71,1)',
      pointHighlightFill : '#fff',
      data : []
    }]

  };
  var radar_option = {
    // responsive: true,//auto resize when window resizes
    // maintainAspectRatio: false,
    //scale
    scaleBeginAtZero : false,
    scaleIntegersOnly: false
  };
	function Mchart(type,elemnt) {
		// enforces new
		if (!(this instanceof Mchart)) {
			return new Mchart(type);
		}
		// constructor body
		this.type = type;
    this.elemnt = elemnt;
		//init
		this.init();
	};
	//init chart
	Mchart.prototype.init = function() {
    this.ctx = this.elemnt.getContext('2d');
    this.mchart = initChart(this.ctx,this.type);
  };
  function initChart (ctx,type,option,data) {
    var constructor;
    if(type == 'bar'){
      constructor = 'Bar';
    }else if (type == 'line') {
      constructor = 'Line';
    }else if (type == 'radar') {
      constructor = 'Radar';
    }
    if(!option){
      option = initOption(type);
    }
    if(!data){
      data = initData(type);
    }
    return new Chart(ctx)[constructor](data,option);
  }
	Mchart.prototype.draw = function(x_data,y_data,min,max) {
		this.clear();
    this.setData(x_data,y_data);
    this.setScope(min,max);
    this.mchart = initChart(this.ctx,this.type,this.chart_option,this.chart_data)
	  //this.render(colorlist);
  };
  function initOption(type,min,max,steps){
    var option = {};
    if (type == 'bar') {
      $.extend(option, bar_option);       
    }else if (type == 'line') {
      $.extend(option, line_option);       
    }else if (type == 'radar') {
      $.extend(option, radar_option);     
    }
    if(!isNaN(min)&&!isNaN(max)){
      option = setScope(option,min,max,steps);
    } 
    return option;  
  }
  function setScope (option,min,max,steps) {
	  if(min === max){
		  min = 0;
		  max = max*2;
	  }
	  if(!steps || isNaN(steps)){
	      steps = 5;//default value
	  }
	  var width = (max-min)/(steps-1);
	  //width = width.toFixed(2);
	  width = Math.ceil(width*100)/100;
	  option['scaleOverride'] = true;
	  option['scaleSteps'] = steps;
	  option['scaleStepWidth'] = width;
	  option['scaleStartValue'] = Math.max(0,min-width);
      return option;
  }
  function initData (type,labels,values) {
    var data = {};
    if (type == 'bar') {
      $.extend(data, bar_data);       
    }else if (type == 'line') {
      $.extend(data, line_data);       
    }else if (type == 'radar') {
      $.extend(data, radar_data);     
    }
    if(labels && values){
      data['labels'] = labels;
      if(values.length ==0 || values[0][0] === undefined || values[0][0] === null){
        //单一数组 single array
        data['datasets'][0]['data'] = values;
      }else{
        //多数组 
        for(var i=0;i<values.length;i++){
           if (data['datasets'][i]) {
             data['datasets'][i]['data'] = values[i];
             continue;
           }
           //when data['datasets'][i] == undefined or null
           var idata = $.extend({}, data['datasets'][0],lineColorInit(COLOR_LIST[i-1]));
           idata['data'] = values[i];
           data['datasets'].push(idata);     
        }
      } 
    } 
    return data; 
  }
  Mchart.prototype.clear = function() {
    this.mchart.destroy();
  };
	Mchart.prototype.setData = function(x_data,y_data) {
		this.chart_data = initData(this.type,x_data,y_data);
	};	
	//set min and max after set x and y
  Mchart.prototype.setScope = function(min,max) {
    this.chart_option = initOption(this.type,min,max);
  };
  //set bar's color and min,max color
  Mchart.prototype.render = function(colorlist) {
    // body...
  };
  Mchart.prototype.resize = function() {
    this.mchart.resize();
    this.mchart.update();
  };
	return Mchart;
}(jQuery));
