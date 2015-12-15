//global js
;(function(win, lib){
	//接口名
	//
	lib.host = 'http://172.20.10.6/dola';
	lib.intf = {
		getBankCode: lib.host + '/customer/getBankCode',
		customerQuery: lib.host + '/customer/customerQuery',
		customerQueryByPhone: lib.host + '/customer/customerQueryByPhone'
	}

	//ajax请求
	lib.ajax = function(url, params, callBack,type){
		var type = type || "POST";
		var params = (type == "GET") ? params : JSON.stringify(params);
		$.ajax({
	        type: type,
	        contentType: "application/json",
	        dataType: "json",
	        url: url,
	        data: params, 
	        success: function (repose) {
	        	callBack(repose);
	        }
    	});
	};

	lib.isMobile = function(str) {
		var myreg = /^(13|15|18|14|17)\d{9}$/;
		if($.trim(str) === '') {
			return false;
		}
		if (!myreg.test(str)) {
			return false;
		} else {
			return true;
		}
	};

})(window, window['lib'] || (window['lib'] = {}));

 