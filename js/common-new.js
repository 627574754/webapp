//所有接口及baseUrl
var globalConifg={
	baseUrl:'http://localhost:8888/other/webapp/',
	//baseUrl:'http://localhost/dola/',
	api:{
		register:{
			registerUser:'register/registerUser',
			getSecurityCode:'register/getSecurityCode',
			checkEmail:'register/checkEmail'
		},
		login:{
			login:'login/login',
			islogin:'user/isLogin'
		},
		update:"user/updateUserInfo",
		getUserInfo:"user/getUserInfo",
		customerQuery:"customer/customerQuery",
		getCustomerInfoList:"customer/getCustomerInfoList",
		getUserInfoDetail:"user/getUserInfoDetail",
		countByBank:"user/countByBank",			//get
		countByPerson:"user/countByPerson",		//get 参数t
		getTotle:"user/getTotle",
		getLastLoginInfo:"user/getLastLoginInfo",
		getCustomerInfoDetail:"customer/getCustomerInfoDetail",
		loginOut:"user/loginOut",
		resendEmail:"register/resendEmail",
		forgetPassword:"user/forgetPassword",
		getBankCode:"customer/getBankCode",
		countByInfoId:"/user/countByInfoId",
		updatePassword:"/user/updatePassword"

	}
};
// //session用户是否登录接口
// function IsLogin(){
// }
// IsLogin.prototype={
// 	status:function(){
// 		var loginData={};
// 		$.ajax({
// 			url:globalConifg.baseUrl+globalConifg.api.login.islogin,
// 			type:'post',
// 			dataType:'json',
// 			async:false,
// 			cache:false,
// 			success:function(data){
// 				if(data.success){
// 					loginData.success=true;
// 					loginData.email=data.data;
// 					loginData.email='assa';  //mock
// 				}else{
// 					loginData.success=false;
// 				}
// 			}
// 		});
// 		return loginData;
// 	}()
// };
// // var isLogin=new IsLogin();
//登录框
function LoginBox(){
	this.exportEvents();
}
LoginBox.prototype={
	init:function(){
		var boxStr="<div class='popout_box'>"+
			"<div class='popout_box_cover'>"+
			"</div>"+
			"<div class='popout_box_login'>"+
			"<div class='ta_r'><span class='close'></span></div>"+
			"<div class='input_field'><span class='icon_bg'><em class='icon_username'></em></span><input type='text' class='login_username' placeholder='登录用户名'/></div>"+
			"<div class='input_field'><span class='icon_bg'><em class='icon_password'></em></span><input type='password' class='login_password' placeholder='登录密码（8-16位）'/></div>"+
			"<div class='password_extra'><label class='checkbox-inline'><input type='checkbox'>记住密码</label><a class='forget_pwd'>忘记密码</a></div>"+
			"<div><button class='btn login_btn'>登&emsp;&emsp;录</button></div>"+
			"<div class='go_regist'>还没有账号？<a href='"+globalConifg.baseUrl +"regist.html'>立即注册</a></div>"+
			"</div>"+
			"</div>"
		var box=$(boxStr);
		$('body').prepend(box);
		this.events();
	},
	hide:function(){
		$('.popout_box').remove();
	},
	exportEvents:function(){
		var that=this;
		$(".login_btn").bind('click',function(){
			that.init();
		})
		$('.logout').bind('click',function(){
			$.ajax({
				url:globalConifg.baseUrl+globalConifg.api.loginOut,
				type:'post',
				dataType:'json',
				async:false,
				success:function(data){
					if(data.success){
						window.location.href=globalConifg.baseUrl+"home.html";
					}
				}
			});
		})
	},
	events:function(){
		var that=this;
		with($('.popout_box_login')){
			find('.close').bind('click',function(){
				that.hide();
			})
			find('.checkbox-inline').bind('click',function(){
			})
			bind('click',function(event){
				event.stopPropagation();
			})
			find('.login_btn').bind('click',function(){
				var emailReg=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
				var pwdReg=/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_\-\|\?]{8,16}$/;
				if($('.login_username').val()==''||$('.login_password').val()==''||!$('.login_username').val().match(emailReg)||!$('.login_password').val().match(pwdReg)){
					alert('用户名或密码错误');
					return false;
				}
				$.ajax({
					url: globalConifg.baseUrl + globalConifg.api.login.login,
					type: 'post',
					contentType: "application/json",
					data:JSON.stringify({
						email:$('.login_username').val(),
						password:$('.login_password').val()
					}),
					dataType: 'json',
					success: function (data) {
						if(data.success){
							window.location.href=globalConifg.baseUrl+"companyUserOverview.html";
						}else{
							alert('用户名或密码错误')
						}
					}
				})
			});
			find('.forget_pwd').click(function(){
				if($('.login_username').val()==''){
					alert('您正在进行找回密码的操作，请在登录输入框中填写注册邮箱。')
				}else{
					if(window.confirm('您正在进行找回密码的操作，我们将重置您的密码并发送至您的注册邮箱，确认找回密码吗？')){
						$.ajax({
							url: globalConifg.baseUrl + globalConifg.api.forgetPassword,
							type: 'get',
							data:{
								email:$('.login_username').val()
							},
							dataType: 'json',
							success: function (data) {
								if(data.success){
									alert('我们已将重置后的密码发送至您的注册邮箱，请查收，谢谢！')
								}else{
									if(data.message) {
										alert(data.message)
									}else{
										alert('重置密码失败')
									}
								}
							}
						})
					}else{
						return false;
					}
				}
			})
		}
		setTimeout(function(){
			$('body').one('click',function(){
				that.hide();
			})
		})
	}
};
//头部menu 状态
function Menu(){
	this.eventsObjs=$('.menu').find('li');
	this.init();
}
Menu.prototype={
	init:function(){
		if(window.location.href.match('home.html')){
			this.eventsObjs.eq(0).addClass('current')
		}else if(window.location.href.match('serviceIntroduction.html')){
			this.eventsObjs.eq(1).addClass('current')
		}else if(window.location.href.match('FAQ.html')){
			this.eventsObjs.eq(2).addClass('current')
		}else if(window.location.href.match('aboutUs.html')){
			this.eventsObjs.eq(3).addClass('current')
		}else if(window.location.href.match('companyUser')){
			this.eventsObjs.eq(4).addClass('current')
		}
	}

};
//用户中心页面左边menu
function LeftMenu(status){
	this.init(status);
	this.events();
}
LeftMenu.prototype={
	init:function(status){
		$('.left_menu').children('li').eq(status[0]).addClass('active').each(function(){
			$(this).find('li').eq(status[1]).addClass('level2_active');
		})
	},
	events:function(){
		$('.left_menu').children('li').bind('click',function(event){
			$(this).find('ul').slideToggle('fast');
			$(this).find('.arr_icon').toggleClass('arr_change');
		})
		$('.left_menu').children('li').find('li').bind('click',function(event){
			event.stopPropagation();
		})
	}
}
//MVC部分，主要是区分登录后用户和未登录用户界面上一些不同，通过后台session接口判断
function PageMVC(){
	this.data=this.getData();
	this.dataExtendPage={};
	this.dataExtendCommon={};
}
PageMVC.prototype={
	getData:function(){
		var dataObj={
			banner:{},
			footer:{}
		};
		console.log(globalConifg.baseUrl+'commonBanner.html')
		$.ajax({
			url:globalConifg.baseUrl+'commonBanner.html',
			dataType:'html',
			cache:'true',
			async:false,
			success:function(data){
				dataObj.banner.template=data;
			}
		});
		$.ajax({
			url:globalConifg.baseUrl+'commonFooter.html',
			dataType:'html',
			cache:'true',
			async:false,
			success:function(data){
				dataObj.footer.template=data;
			}
		});
		return dataObj;
	},
	temp:function(){
		// this.data=$.extend(true,this.data,{banner:{data:isLogin.status}});
		this.data=$.extend(true,this.data,this.dataExtendCommon);
		this.data.page={
			template:$('#pagetemplate').html(),
			data:{
				// banner:_.template(this.data.banner.template)(this.data.banner.data),
				footer:_.template(this.data.footer.template)(this.data.footer.data)
			}
		};
		this.data=$.extend(true,this.data,this.dataExtendPage);
		$('body').html(_.template(this.data.page.template)(this.data.page.data));
	},
	/*common 为true时，增加头部和底部数据,不传默认增加页面数据*/
	extendsData:function(data,common){
		if(common&&common===true){
			this.dataExtendCommon=$.extend(true,this.dataExtendCommon,data);
		}else{
			this.dataExtendPage=$.extend(true,this.dataExtendPage,data);
		}
	}
};
$(function(){
	var menu=new Menu();
	var loginBox=new LoginBox();
});