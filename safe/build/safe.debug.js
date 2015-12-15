;(function(win, app){
	var $ = win['Zepto'];

	$(function() {
		app.safe();
	});
})(window, window['app'] || (window['app'] = {}));