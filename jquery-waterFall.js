$.fn.waterFall=function(options,itemWidth){

 	//默认值  间距
 	 var defaults = {
 	 	gap:20
 	 };
 	 //参数扩展
 	 defaults = $.extend(defaults,options);
 	 //初始化参数
 	 var that = $(this),
 	 //要处理的子元素
 	 item = that.children(),
 	 //获取子元素的宽度
 	 width = itemWidth || item.width(),
 	 hight= "",
 	 // 向下取整 得到列数
 	 count = Math.floor(that.width()/width),

 	 //储存列高的一个数组
 	 colums = [],
 	 //间距
 	 gap = defaults.gap;

 	 //遍历循环
 	 item.each(function(key,val){

 	 	//每个元素的高度
 	 	height = $(val).height();
 	 	if(key<count){
 	 		//储存第一行没咧的高度
 	 		colums[key]=height;

 	 		//确定第一行的坐标值
 	 		$(val).css({
 	 			top:0,
 	 			left:(width+gap)*key
 	 		})
 	 	}else {
 	 			//计算列高数组中的最小值 和最小的下标
 	 			//假设是第一个
 	 			var min_val = colums[0];
 	 			var min_key = 0;
 	 			for (var i = 0;i<colums.length;i++){
 	 				if(colums[i]<min_val){
 	 					min_val=colums[i];
 	 					min_key=i;
 	 				}
 	 			}

 	 			//更新最小数列
 	 			colums[min_key]+=height+gap;
 	 			//设置其他行的坐标
 	 			$(val).css({
 	 				top:min_val+gap,
 	 				left:(width+gap)*min_key
 	 			});
 	 		}
 	 });

 	 //计算最大值
 	 var max_val = colums[0];
 	 for(var i =0;i<colums.length;i++){
 	 	if(colums[i]>max_val){
 	 		max_val=colums[i];
 	 	}
 	 }
 	 //设置高度
 	 that.height(max_val);

}
