//选项卡
;(function($){
	$.fn.extend({  
		tabs:function(options){
			var defaults = {
				'clickTarget':'li',
				'addClassName':'selected',
				'checkTarget':'div'
			};
			var _this = this;
			
			var settings = $.extend({},defaults,options);		

			this.find(settings.clickTarget).click(function(){
				
				$(this).addClass(settings.addClassName).siblings().removeClass(settings.addClassName);

				$index = $(this).index();
				
				_this.find(settings.checkTarget).hide().eq($index).show();

			});			
			
			return this;
		},
		add:function(){

		}
    });	
})(jQuery);




