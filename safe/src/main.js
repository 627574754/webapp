//@require common

;(function(win, lib) {
	var $ = win['Zepto'];

	//分类列表收起
	$.fn.process = function (opts) {
		var self = this;
		var op = {
			callback: function () { }, //动画结束时的回调函数
			ease: 'linear', //滑动公式
			anitime: 10 //运动时间
		}
		$.extend(op, opts);

		var _maxWidth = $(this).parent().width() - 30;

		$(this).anim({ width: _maxWidth }, op.anitime, op.ease, function () {
			op.callback();
		});
		return this;
	};



	var home = {
		wrapList : $('.wrap'),
		bankData: {
			'ICBC':{
				'id':'icbc',
				'title':'中国工商银行',
				'method':0,
				'phone':'95588'
			},
			'CCB':{
				'id':'ccb',
				'title':'中国建设银行',
				'method':1,
				'phone':'95533'
			},
			'ABC':{
				'id':'abcchina',
				'title':'中国农业银行',
				'method':0,
				'phone':'95599'
			},
			'CMB':{
				'id':'cmbchina',
				'title':'招商银行',
				'method':0,
				'phone':'95555'
			},
			'BOC':{
				'id':'boc',
				'title':'中国银行',
				'method':0,
				'phone':'95566'
			},
			'CEB':{
				'id':'cebbank',
				'title':'中国光大银行',
				'method':0,
				'phone':'95595'
			},
			'PSBC':{
				'id':'psbc',
				'title':'中国邮政储蓄银行',
				'method':1,
				'phone':'95580'
			},
			'COMM':{
				'id':'bankcomm',
				'title':'交通银行',
				'method':0,
				'phone':'95559'
			},
			'CMBC':{
				'id':'cmbc',
				'title':'中国民生银行',
				'method':0,
				'phone':'95568'
			},
			'CITIC':{
				'id':'ecitic',
				'title':'中信银行',
				'method':0,
				'phone':'95558'
			},
			'JSBANK':{
				'id':'jsbchina',
				'title':'江苏银行',
				'method':0,
				'phone':'400-869-6098'
			},
			'HXBANK':{
				'id':'hxb',
				'title':'华夏银行',
				'method':1,
				'phone':'95577'
			},
			'NBBANK':{
				'id':'nbcb',
				'title':'宁波银行',
				'method':0,
				'phone':'95574'
			},
			'SHBANK':{
				'id':'bankofshanghai',
				'title':'上海银行',
				'method':0,
				'phone':'95594'
			},
			'SPDB':{
				'id':'spdb',
				'title':'浦发银行',
				'method':1,
				'phone':'95528'
			},
			'HZCB':{
				'id':'hzbank',
				'title':'杭州银行',
				'method':0,
				'phone':'95398'
			},
			'BJBANK':{
				'id':'bankofbeijing',
				'title':'北京银行',
				'method':0,
				'phone':'95526'
			},
			'WZCB':{
				'id':'wzcb',
				'title':'温州银行',
				'method':0,
				'phone':'96699'
			},
			'NJCB':{
				'id':'njcb',
				'title':'南京银行',
				'method':0,
				'phone':'400-889-6400'
			},
			'SPABANK':{
				'id':'pingan',
				'title':'平安银行',
				'method':1,
				'phone':'95511转3'
			},
			'GDB':{
				'id':'cgbchina',
				'title':'广发银行',
				'method':0,
				'phone':'400-830-8003'
			},
			'CSCB':{
				'id':'cscb',
				'title':'长沙银行',
				'method':1,
				'phone':'96511'
			},
			'CIB':{
				'id':'cib',
				'title':'兴业银行',
				'method':0,
				'phone':'95561'
			},
			'CQBANK':{
				'id':'cqcbank',
				'title':'重庆银行',
				'method':1,
				'phone':'400-709-6899'
			},
			'CRCBANK':{
				'id':'cqrcb',
				'title':'重庆农村商业银行',
				'method':1,
				'phone':'966866'
			}
		},
		init :  function() {
			var that = this;
			$('#agreeBtn').on('click', function() {
				that.toPage(1);
			});
			//选择银行
			this.choseBank();
			//查询银行流水tab切换
			this.bindTab();
			//绑定手机
			this.bindPhone();
			//返回
			this.bindBack();
			//获取短信验证码
			this.getVerCode();
			//更换验证码图片
			this.getCodeImg();
			//查询银行流水
			this.queryList();
		},
		toPage: function(pn) {
			this.wrapList.addClass('none').eq(pn).removeClass('none');
		},
		//选择银行
		choseBank: function() {
			var that = this;
			$('#bankList').on('click', '.slt-item', function() {
				that.initBank($(this).data('name'));
				that.curBank = $(this).data('bid');
				var par = {
					"bank": that.curBank
				};
				lib.ajax(lib.intf.getBankCode,par,function(repose){
					if(!repose.success){
	    				notification.simple(repose.message);
	    				return;
	    			}
	    			// $('.identify_code_row').show();
					$('.srhCodeImg').eq(0).attr('src',repose.data.img);
					that.sid=repose.data.sid;
				}, "GET");
				that.toPage(2);
			});
		},
		//获取查询信息验证码图片
		getCodeImg: function() {
			var that = this;
			$('.srhCodeImg').on('click', function() {
				var item = $(this);
				var par = {
					"bank": that.curBank
				};
				lib.ajax(lib.intf.getBankCode,par,function(repose){
					if(!repose.success){
	    				notification.simple(repose.msg);
	    				return;
	    			}
	    			// $('.identify_code_row').show();
					item.attr('src',repose.data.img);
					that.sid = repose.data.sid;
				}, "GET");
			});
		},
		//查询流水
		queryList: function() {
			var that = this;
			//提交
			$('#searchBtn').on('click', function() {
				var form = $('.tabCnt:not(.none)');
				var ipts = form.find('input');
				var par = {
					domain:window.location.href.split('/dola/mpers/')[1].split('?')[0],
					// domain: 12345,  //mock
					bank: that.curBank,
					sid:that.sid
				};
				for(var i = 0, len = ipts.length; i < len; i++) {
					var item = ipts.eq(i);
					if(item.val() === "") {
						notification.simple('请输入'+item.data('msg'));
						return;
					}
					par[item.attr('name')] = item.val();
				};
				that.toPage(4);
				var process = $('#process');
				process.removeClass('sus').removeClass('error').attr('style','');
				$('.stsMsg .tips').html('正在获取报告');
				$('.stsTip').html('可能需要2分钟');
				$('.red').remove();
				setTimeout(function() {
					process.process();
				},0);
				lib.ajax(lib.intf.customerQuery,par,function(repose){
					process.css('transition', '');
					if(!repose.success){
	    				process.addClass('error');
	    				$('<p class="red">查询失败</p>').insertBefore('.stsMsg .tips');
	    				$('.stsMsg .tips').html('请返回查询输入后查询');
	    				return;
	    			}
	    			var data = repose.data;
	    			if(data && (data.s == '2' || data.s == '3')) {
	    				that.toPage(3);
	    				that.initBindPhone(data);
	    				return;
	    			}			
	    			process.addClass('sus');
	    			$('.stsMsg .tips').html('');
	    			$('.stsTip').html('报告已发送“宜人贷”请等待审核');
				});
			});
		},
		//初始化绑定手机
		initBindPhone: function(data) {
			$('#phone').val(data.phone);
			var codeWrap = $('#codeWrap');
			$('#process').removeClass('sus').attr('style','');
			if(data.code) {
				codeWrap.removeClass('none');
				codeWrap.find('img').attr('src', data.code);
				$('.stsMsg .tips').html('正在获取报告');
				$('.stsTip').html('可能需要2分钟');
			}
			else {
				codeWrap.addClass('none');
			}
		},
		//绑定手机
		bindPhone: function() {
			var that = this;
			var form = $('#validForm');
			$('#validBtn').on('click', function() {
				var ipts = form.find('input').not('input[disabled="disabled"]');
				var par = {
					bank: that.curBank,
					domain:window.location.href.split('/dola/mpers/')[1].split('?')[0],
					// domain: 12345,  //mock
					sid: that.sid
				};
				for(var i = 0, len = ipts.length; i < len; i++) {
					var item = ipts.eq(i);
					var val = item.val();
					var name = item.attr('name');
					if(!item.val()) {
						if(!(name === 'code' && item.parents('.codeWrap').hasClass('none'))){
							notification.simple('请输入'+item.data('msg'));
							return;
						}
					} 
					par[name] = item.val();
				}
				that.toPage(4);
				var process = $('#process');
				process.process();
				lib.ajax(lib.intf.customerQueryByPhone,par,function(repose){
					process.css('transition', '');
					if(!repose.success){
	    				process.addClass('error');
	    				$('<p class="red">查询失败</p>').insertBefore('.stsMsg .tips');
	    				$('.stsMsg .tips').html('请返回查询输入后查询');
	    				return;
	    			}		
	    			process.addClass('sus');
	    			$('.stsMsg .tips').html('');
	    			$('.stsTip').html('报告已发送“宜人贷”请等待审核');
				});
			});
		},
		//获取短信验证码
		getVerCode: function() {
			var btn = $('#getCodeBtn');
			//60s倒计时
			function countDown(){
				var sec = 60;
				var second = $('#second');
				second.text('60');
				var interval = setInterval(function(){
					second.text(--sec);
					if(sec == 0){
						clearInterval(interval);
						sec = null;
						interval = null;
						btn.html('获取验证码');
					}
				}, 1000);
			}
			btn.on('click', function() {
				$(this).html('<span id="second">60</span>s后重新发送');
				countDown();
			});
		},
		//初始化银行
		initBank:  function(name) {
			$('#bankName').html(name);
		},
		//查询银行流水tab切换
		bindTab: function() {
			var tabCnt = $('.tabCnt');
			var tabs = $('.tabItem');
			tabs.on('click',function() {
				var tar = $(this);
				var n = tar.index();
				tabs.toggleClass('cur');
				tabCnt.toggleClass('none');
				$('.srhCodeImg').eq(n).trigger('click');
			});
		},
		//返回
		bindBack: function() {
			var that = this;
			$('.backWrap').on('click', function() {
				that.toPage($(this).data('pn'));
			})
		}
	};

	home.init();
})(window, window['lib'] || (window['lib'] = {}));
