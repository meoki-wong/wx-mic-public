base_url = "http://www.yixin.com/index.php";
islogin = false;
rgsuccess = false;	//默认未登陆
var data = {
    'reg_lock'      : false,
    'reg_email'     : false,
    'reg_nickName'  : false,
    'email'         : null,
    'nickName'      : null
}
$(function(){
    // 离开邮箱焦点时
    $('#inputEmail').blur(function(){
        var username = $.trim($(this).val()); 
		if(username == '')
            return;
        if(!user.verify_email(username)){
            $(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return;
        }
        if(data.email != username){
            data.email = username;
      user.is_email(username);
        }
    });

    // 离开登陆密码框焦点时
    $('#password').blur(function(){
        var password = $.trim($(this).val()); 
		if(password == ''){
			$(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return;
		}
    });
		//verify	
    // 离开登陆验证码输入框焦点时
    $('#verify').blur(function(){
        var verify = $.trim($(this).val()); 
		if(verify == ''){
			$(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return;
		}
    });		
	//修改密码验证：
	$('#curr_pwd').blur(function(){    
		user.change_pwd_verify($(this));
    });
	$('#new_pwd').blur(function(){    
		user.change_pwd_verify($(this));
    });
	$('#confirm_pwd').blur(function(){    
		user.change_pwd_verify($(this));
    });
    // 离开昵称焦点时
    $('#Nickname').blur(function(){
        var nickName = $.trim($(this).val());
        if(nickName == '')
            return;
        if(nickName.length < 2 || nickName.length > 20){
            $(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return ;
        }
		var pattern   =   /^[0-9a-zA-Z\u4e00-\u9fa5-_]+$/i;
        if(!pattern.test(nickName)){
            $(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return ;
        }
        if(data.nickName != nickName){
            data.nickName = nickName;
            user.is_nickname(nickName);
        }
    });


    // 刷新验证码
    $('#refresh_verify').click(function(){
        user.refresh_verify();
    });

    // 换一张验证码
    $('#change_verify').click(function(){
        user.refresh_verify();
        return false;
    });

    // 记住密码
    $('.remember').click(function(){
        var appendparam = $.trim($('input[name=appendParams]').val());
        if(appendparam == ''){
            $('input[name=appendParams]').val('remember=1');
        }else{
            $('input[name=appendParams]').val('');
        }
    });

    /** 找回密码 **/
    $('#forgetEmail').click(function(){
        var emailObj = $('#userEmail');
        var email    = $.trim($('#userEmail').val());
        if(email == ''){
            user.forget_error(emailObj, emailObj.attr('Err-empty'), false);
            return;
        }
        if(!user.verify_email(email)){
            user.forget_error(emailObj, emailObj.attr('Err-format'), false);
            return;
        }
        var status = false;
        $.ajax({
            url      : base_url + '/forgetPwd',
            type     : 'post',
            dataType : 'json',
            data     : {'email' : email},
            async    : false,
            success  : function(result)
            {
                if(result.status == '00'){
                    status = true;
                }else if(result.status == '01'){
                    user.forget_error(emailObj, emailObj.attr('Err-format'), false);
                    status = false;
                }else if(result.status == '02'){
                    user.forget_error(emailObj, emailObj.attr('Err-empty'), false);
                    status = false;
                }else if(result.status == '03'){
                    user.forget_error(emailObj, emailObj.attr('Err-exist'), false);
                    status = false;
                }
            }
        });
        if(status){
            emailObj.parent().find('.wrong').remove();
            emailObj.parent().append('<span class="right">' + emailObj.attr("success") + '</span>');
            emailObj.val('');
        }
    });

    /** 设置新密码 **/
    // <span class="wrong">新密码不能为空</span>
    $('#save_newpwd').click(function(){
        var passwordObj   = $('#password'), passwordAgainObj = $('#passwordAgain');
        var password      = passwordObj.val(), passwordAgain = passwordAgainObj.val();
        $('.resetPwdBox').find('.wrong').remove();
        if(password == ''){
            user.forget_error(passwordObj, passwordObj.attr('Err-empty'), true);
            return;
        }
        if(passwordAgain == ''){
            user.forget_error(passwordAgainObj, passwordAgainObj.attr('Err-empty'), false);
            return;
        }
        if(password.length < 6 || password.length > 16){
            user.forget_error(passwordObj, passwordObj.attr('Err-format'), true);
            return;
        }
        if(password != passwordAgain){
            user.forget_error(passwordAgainObj, passwordAgainObj.attr('Err-same'), false);
            return;
        }
        var str = '<span class="right">' + passwordObj.attr('Err-ing') + '</span>';
//        passwordObj.parent().find('.wrong').remove();
        passwordObj.next().before(str);
        user.update_password(password);
    });

    /** 点击保存修改的密码 **/
    $('#change_btn').click(function(){
		
        var hidefocus = $(this).attr('hidefocus');
        if(hidefocus == 'false')
            return
        user.change_pwd($(this));
    });

})

var user = {
    /**
     * 修改密码处理
     * @param btn
     */
    /**
     * 修改密码处理
     * @param btn
     */
    change_pwd : function(btn)
    {
        $('.mnRForm').find('.wrong').remove();
        $('.mnRForm').find('.right').remove();
        btn.attr('hidefocus', 'false');
        var curr_pwdObj = $('#curr_pwd'), new_pwdObj = $('#new_pwd'), confirm_pwdObj = $('#confirm_pwd');
        var curr_pwd    = curr_pwdObj.val(), new_pwd = new_pwdObj.val(), confirm_pwd = confirm_pwdObj.val();
        if(curr_pwd == ''){
            user.reset_password_error(curr_pwdObj, curr_pwdObj.attr('Err-empty'), false);
            btn.attr('hidefocus', 'true');
            return ;
        }
        if(new_pwd == ''){
            user.reset_password_error(new_pwdObj, new_pwdObj.attr('Err-empty'), false);
            btn.attr('hidefocus', 'true');
            return;
        }
        if(new_pwd.length < 6 || new_pwd.length > 16){
            user.reset_password_error(new_pwdObj, new_pwdObj.attr('Err-format'), false);
            btn.attr('hidefocus', 'true');
            return;
        }
        if(confirm_pwd == ''){
            user.reset_password_error(confirm_pwdObj, confirm_pwdObj.attr('Err-empty'), false);
            btn.attr('hidefocus', 'true');
            return;
        }
        if(new_pwd != confirm_pwd){
            user.reset_password_error(confirm_pwdObj, confirm_pwdObj.attr('Err-same'), false);
            btn.attr('hidefocus', 'true');
            return;
        }
        var str = '<span class="right"></span>';
        new_pwdObj.parent().find('.wrong').remove();
        new_pwdObj.parent().append(str);
        user._change_password(curr_pwd, new_pwd, btn);
    },

	//修改密码输入验证
	
	    /**
     * 修改密码处理
     * @param btn
     */
    change_pwd_verify : function(obj)
    {
        var curr_pwdObj = $('#curr_pwd'), new_pwdObj = $('#new_pwd'), confirm_pwdObj = $('#confirm_pwd');
        var obj_val    = $.trim(obj.val());
        if(obj_val == ''){
            user.reset_password_error(obj, obj.attr('Err-empty'), false);
            return ;
        }

        if(obj_val.length < 6 || obj_val.length > 16){
            user.reset_password_error(obj, obj.attr('Err-format'), false);
            return;
        }
    },
    /**
     * 更新用户名密码
     * @param curr_pwd
     * @param new_pwd
     * @param btn
     * @private
     */
    _change_password : function(curr_pwd, new_pwd, btn)
    {
        var curr_pwdObj = $('#curr_pwd'), new_pwdObj = $('#new_pwd');
        $.ajax({
            url      : base_url + "/user/changePassword",
            type     : 'post',
            dataType : 'json',
            data     : {'curr_pwd' : curr_pwd, 'new_pwd' : new_pwd},
            success  : function(result)
            {
                if(result.status == '00'){
                    $(".mainRCSlideC").attr('display', 'none');
					btn.attr('hidefocus', 'true');
                    alert("密码修改成功");
                }else if(result.status == '01'){
                    user.reset_password_error(curr_pwdObj, curr_pwdObj.attr('Err-empty'), false);
                    btn.attr('hidefocus', 'true');
                }else if(result.status == '02'){
                    user.reset_password_error(new_pwdObj, new_pwdObj.attr('Err-empty'), false);
                    btn.attr('hidefocus', 'true');
                }else if(result.status == '03'){
                    user.reset_password_error(new_pwdObj, new_pwdObj.attr('Err-format'), false);
                    btn.attr('hidefocus', 'true');
                }else if(result.status == '04'){
                    user.reset_password_error(curr_pwdObj, curr_pwdObj.attr('Err-error'), false);
                    btn.attr('hidefocus', 'true');
                }else{
                    user.reset_password_error(curr_pwdObj, "更新失败请重试", false);
                    btn.attr('hidefocus', 'true');
                }
                
            }
        })
    },

    /**
     * 更新成功提示窗口
     */
    change_success : function()
    {
        $('#change_box').remove();
        $('#change_success').show('fast');
    },

    /**
     * 更新密码
     * @param password
     */
    update_password : function (password)
    {
        $.post(base_url + '/user/resetpassword', {'password' : password, 'code' : $('#code').val()}, function(result){
            $('input').val('');
            $('.resetPwdBox').find('.wrong').remove();
            $('.resetPwdBox').find('.right').remove();
            var str = '<span class="right">' + $('#password').attr('Err-succ') + '</span>';
            $('#password').next().before(str);
            setTimeout(function(){
                window.location.reload();
            }, 1000);
        });
    },

    /**
     * 邮箱错误信息
     * @param obj
     * @param msg
     * @param pa
     */
    forget_error : function(obj, msg, pa)
    {
        var str = '<span class="wrong">' + msg + '</span>';
        obj.parent().find('.wrong').remove();
        if(pa == true){
            obj.next().before(str);
        }else{
            obj.parent().append(str);
        }

    },
	
	//修改密码错误提示
	reset_password_error : function(obj, msg, pa)
    {
        var str = '<span class="wrong">' + msg + '</span>';
        obj.parent().next('.mc_error').text(msg);
        if(pa == true){
            obj.next().before(str);
        }else{
            obj.parent().append(str);
        }

    },
	
	reset_password_error : function(obj, msg, pa)
    {
        //var str = '<span class="wrong">' + msg + '</span>';
        obj.parent().next('.mc_error').text(msg);

    },

    /**
     * 发送
     * @param email
     */
    send_forgetEmail : function(email)
    {
        $.post(base_url + '/forgetPwd', {'email' : email}, function(result){
            if(result.status == '00'){
                alert("发送成功！");
                window.location.reload();
            }
        });
    },

    /**
     * 更新用户密码
     * @param obj
     */
    user_resetpassword : function(obj)
    {
        var inputPasswordObj = $('#inputPassword'), rePasswordObj = $('#rePassword');
        var passowrd = inputPasswordObj.val();
        var repasswd = rePasswordObj.val();
        if(passowrd == ''){
            user.tip_alert(inputPasswordObj, "Err-empty");
            return false;
        }
        if(repasswd == ''){
            user.tip_alert(rePasswordObj, "Err-empty");
            return false;
        }
        var code = $('#code').val();
        if(code == '')
            return false;
        user._resetpassword(passowrd, code, obj.action);
        return false;
    },

    /**
     * 更新密码
     * @param password
     * @param code
     * @param action
     * @private
     */
    _resetpassword : function(password, code, action)
    {
        $.ajax({
            url      : action,
            type     : 'post',
            dataType : 'json',
            data     : {'password' : password, 'code' : code},
            success  : function(result)
            {

            }
        })
    },

    /**
     * 发送EMAIL
     * @param email
     */
    send_email : function(email)
    {
        $.post(base_url + '/activeEmail', {'email' : email}, function(result){

        });

    },

    /**
     * 提交登录
     * @param obj
     * @returns {boolean}
     */
    user_login : function(obj){
        var email  = $.trim($('#loginEmail').val());
        var passwd = $('#password').val();
        var verify = $.trim($('#verify').val());
		//解决loginError被删除的情况
		if($('#loginError').length == 0)
		{
			var str = '<div class="loginError" id="loginError" style="display: none; width:387px;text-align:center; color:red;padding: 10px 0;" > </div>';
			$('.dialogC').before(str);
		}
		var Error  = $('#loginError');

		//line 416~420 是注释掉的
        /*var highlight =$('#login_user').attr('highlight');
        if(highlight == 'false')
           return false;
        alert("email"+email)
		alert("Error.text"+Error.text());*/
/*         if(email == ''){
			user.login_alert_my(Error, $('#loginEmail').attr('Err-empty'));
			return false;
        }
        if(passwd == ''){
            user.login_alert(Error, $('#password').attr('Err-empty'));
            return false;
        }
        if(verify == ''){
            user.login_alert(Error, $('#verify').attr('Err-empty'));
            return false;
        }
        if(!user.verify_email(email)){
            
            user.login_alert(Error, $('#loginEmail').attr('Err-format'));
            return false;
        } */
		// modified by zoujing display error beside current input
	    if(email == ''){
			user.login_alert_my($('#loginEmail'), $('#loginEmail').attr('Err-empty'));
			return false;
        }
        if(passwd == ''){
            user.login_alert_my($('#password'), $('#password').attr('Err-empty'));
            return false;
        }
        if(verify == ''){
            user.login_alert_my($('#verify'), $('#verify').attr('Err-empty'));
            return false;
        }
        if(!user.verify_email(email)){
            
            user.login_alert_my($('#loginEmail'), $('#loginEmail').attr('Err-format'));
            return false;
        } 
        //var myresult =user.check_email_password(email,passwd);
       // alert(myresult);
        /*if(!user.check_email_password(email,passwd)){
            
            user.login_alert(Error, $('#loginEmail').attr('Err-format'));
            return false;
        }*/
        Error.hide().html('');
//        $('#highlight').attr('highlight', 'true');
        return true;
    },

    /**
     * 刷新验证码
     */
    refresh_verify : function()
    {
        var imgsObj = $('#refresh_verify');
        var src     = imgsObj.attr('src');
        var _src    = src.substr(0, src.lastIndexOf('?')) + '?t=' + Math.random();
        imgsObj.attr("src", _src);
        $('#verify').val('');
    },

    /**
     * 验证昵称是否存在
     * @param nickName
     */
    is_nickname : function(nickName)
    {
        $('#Nickname').next('.wrong').hide().html('');
        $.post(base_url + '/user/isNickname', {'nickName' : nickName}, function(result){
            if(result.status == '00'){
                data.reg_email = true;
                $('#from_submit').find('.tip').hide().html('');
				$('#Nickname').parent().next('.registerLCError').html('');
            }else if(result.status == '01'){
                user.tip_alert($('#Nickname'), 'Err-format');
            }else if(result.status == '02'){
                $('#Nickname').next('.tip').html($('#inputEmail').attr('Err-empty'));
            }else if(result.status == '03'){
				user.tip_alert($('#Nickname'), 'Err-exist');
            }
        }, 'json');
    },

    /**
     * 验证邮箱是否存在
     * @param email
     */
    is_email : function(email)
    {
        $.post(base_url + '/user/isEmail', {'email' : email}, function(result){
            if(result.status == '00'){
                $('#inputEmail').next().hide().html('');
				$('#inputEmail').parent().next('.registerLCError').html('');
                data.reg_email = true;
            }else if(result.status == '01'){
                user.tip_alert($('#inputEmail'), 'Err-format');
            }else if(result.status == '02'){
                user.tip_alert($('#inputEmail'), 'Err-empty');
            }else if(result.status == '03'){
			user.tip_alert($('#inputEmail'), 'Err-exist');
			//$("#showRigisteredError").css("display","block").show();
            }
        }, 'json');
    },

    /**
     * 注册提交
     * @param obj
     * @return bool
     */
    user_sub_register : function(obj)
    {
        var emailObj = $('#inputEmail'), nickNameObj = $('#Nickname'), passwordObj = $('#password'), rePasswordObj = $('#passwordAgain'), verifyObj = $('#verify');
        var email    = $.trim(emailObj.val()), nickName = $.trim(nickNameObj.val()), password = passwordObj.val(), rePassword = rePasswordObj.val(), verify = $.trim(verifyObj.val());
        //console.log("email=" + email + ",nickName=" + nickName + ",password=" + password + ",rePasword=" + rePassword + ",verify=" + verify);
        
        if(email == ''){
            user.tip_alert(emailObj, 'Err-empty');
            return false;
        }
        if(!user.verify_email(email)){
            user.tip_alert(emailObj, 'Err-format');
            return false;
        }
        if(nickName == ''){
            user.tip_alert(nickNameObj, 'Err-empty');
            return false;
        }
        if(nickName.length < 2 || nickName.length > 20){
            user.tip_alert(nickNameObj, 'Err-format');
            return false;
        }
        if(password == ''){
            user.tip_alert(passwordObj, 'Err-empty');
            return false;
        }
        if(rePassword == ''){
            user.tip_alert(rePasswordObj, 'Err-empty');
            return false;
        }
        if(password.length < 6 || password.length > 20){
            user.tip_alert(passwordObj, 'Err-format');
            return false;
        }
        if(password != rePassword){
            user.tip_alert(rePasswordObj, 'Err-same');
            return false;
        }
        if(verify == ''){
            user.tip_alert(verifyObj, 'Err-empty');
            return false;
        }
        if(!user.match_verify(verify)){
            user.tip_alert(verifyObj, 'Err-error');
            user.refresh_verify();
            return false;
        }else{
			verifyObj.parent().next('.registerLCError').html('');
		}
        if(!data.reg_lock && !data.reg_email && !data.reg_nickName)
            return false;
		
        user.user_resister(email, password, nickName, verify, obj.action);
        return false;
    },

    /**
     * 登录时错误提示信息
     * @param obj
     * @param error
     */
    login_alert : function(obj, error)
    {
		obj.show().html(error);
    },
    /**
     * 登录时错误提示信息
     * @param obj
     * @param error
     */
	    login_alert_my : function(obj, error)
    {
		//$("#showRepeatedEmail").html(error);
		//obj.next('.dialogError').find('span').text(error);
		//alert(test_obj.parent().next('.dialogError').children('span').html());
		obj.parent().next('.dialogError').children('span').html(error);
		//alert(test_obj.parent.next('.dialogError').find('span').text());
		//obj.show().html(error);
    },
	
    /**
     * 显示错误提示框
     * @param obj
     * @param Err
     */
    /*tip_alert : function(obj, Err)
    {
        $('#from_submit').find('.wrong').hide();
        obj.parent().find('.wrong').show().html(obj.attr(Err));
    },*/

	    tip_alert : function(obj, Err)
    {
        $('#from_submit').find('.registerLCError').html();
        obj.parent().next('.registerLCError').show().html(obj.attr(Err));
    },
	    /**
     * 显示错误提示框
     * @param obj
     * @param Err
     */
    tip_alert_msg : function(obj, msg)
    {
        $('#from_submit').find('.wrong').hide();
        obj.parent().find('.registerLCError').show().html(msg);
    },
    /**
     * 提交注册信息
     * @param email
     * @param password
     * @param nickName
     * @param verify
     * @param action
     */
    user_resister : function(email, password, nickName, verify, action)
    {
        // console.log(2223);
        var emailObj = $('#inputEmail'), nickNameObj = $('#Nickname'), passwordObj = $('#password'), rePasswordObj = $('#passwordAgain'), verifyObj = $('#verify');
        $.ajax({
            url      : action,
            type     : 'post',
            dataType : 'json',
            data     : {'email' : email, 'password' : password, 'nickName' : nickName, 'verify' : verify },
            success  : function(result)
            {
                switch(result.status){
                    case '00' :
                        window.location.href = base_url + "/user/regSuccess";
                        break;
                    case '01' :
                        user.tip_alert(emailObj, "Err-empty");
                        user.refresh_verify();
                        break;
                    case '02' :
                        user.refresh_verify();
                        user.tip_alert(passwordObj, "Err-empty");
                        break;
                    case '03' :
                        user.refresh_verify();
                        user.tip_alert(rePasswordObj, "Err-empty");
                        break;
                    case '04' :
                        user.refresh_verify();
                        user.tip_alert(verifyObj, "Err-empty");
                        break;
                    case '05' :
                        user.refresh_verify();
                        user.tip_alert(verifyObj, "Err-error");
                        break;
                    case '06' :
                        user.tip_alert(emailObj, "Err-format");
                        user.refresh_verify();
                        break;
                    case '07' :
                    case '11' :
                        user.refresh_verify();
                        user.tip_alert(nickNameObj, "Err-exist");
                        break;
                    default :
                        user.refresh_verify();
                        user.tip_alert(emailObj, "Err-exist");
                }
            }
        })
    },

    /**
     * 验证码是否正确
     * 同步请求
     * @param verify
     * @returns {boolean}
     */
    match_verify : function(verify)
    {
        $('#verify').parent().next('.registerLCError').html('');
        var $res = false;
        $.ajax({
            url      : base_url + '/user/judge_verify?code=' + verify,
            type     : 'get',
            dataType : 'text',
            async    : false,
            success  : function(result)
            {
                if(result == 'true')
                    $res = true;
            }
        });
        return $res;
    },
    /*
        验证用户名、密码是否正确
    */
    
    check_username_password : function(email,passwd)
    {
        var $res = false;
        $.ajax({
            url      : base_url + '/user/check_username_password',
            type     : 'post',
            dataType : 'text',
            data     : {'email' : email, 'passwd' : passwd },
            async    : false,
            success  : function(result)
            {
                    $res = result;
            }
        });
        return $res; 
    },
      /*
        获取资产评估数据
    */

    getEvaluationResult : function(kind,value,userType)
    {
        var $res = '';
        $.ajax({
            url      : base_url + '/evaluation/assets_appraise?i='+Math.random(),
            type     : 'post',
            dataType : 'text',
            data     : {'kind' : kind, 'value' : value,'userType' : userType },
            async    : false,
            cache    :false,
            success  : function(result)
            {
                    $res = result;
            }
        });
        return $res;
    },

    /*
     通过userid获取资产评估数据
     */
    getEvaluationResultByUserid : function(userid)
    {
        var $res = '';
        $.ajax({
            url      : base_url + '/evaluation/getEvaluationData',
            type     : 'post',
            dataType : 'text',
            data     : {'userid' : userid},
            async    : false,
            success  : function(result)
            {
                $res = result;
            }
        });
        return $res;
    },
    /*
      用户登录显示
  */
	
    checkLoginStatus : function()
    {
        var $res = '';
        $.ajax({
            url      : base_url + '/user/isLogin',
            type     : 'post',
            dataType : 'json',
            async    : false,
            success  : function(result)
            {
                //状态status为success时，1表示登录成功，2表示未登录
				if (result.status == 'success'){
					//登录成功时
					rgsuccess = true;
					$html = '<span>您好,'+result.content.username+'</span>&nbsp;&nbsp;<a class="topL_reg" id="topL_logout" href="http://www.yixin.com/index.php/user/logout" target="_self">退出</a>';
					$('#userInfo').html($html);
					$('.curstatus a').show();
				} else {
					//登录失败时
					$html = '<a class="topL_login" id="topL_login" href="javascript:void(0);">请登录</a><span class="topL_line">|</span><a class="topL_reg" id="topL_reg" href="http://www.yixin.com/reg.html" target="_self">免费注册</a>';
					$('#userInfo').html($html);
					islogin = true;
					if (result.content.opendialog == 1) {
						//$(".topL_login").trigger("click");
							$(".dialog").after('<div class="dialogBg png"></div>'); //add bg
							$(".dialogBg").fadeIn();
							$("#dialogLogin").fadeIn();
							var dialogW = $("#dialogLogin").width();
							var dialogH = $("#dialogLogin").height();
						  //var dialogL = $(document.body).outerWidth(true)/2-(dialogW/2);
                            var dialogL = $(document.getElementsByTagName("body")[0]).outerWidth(true)/2-(dialogW/2);
							var dialogT = $(window).height()/2-(dialogH/2);
							$("#dialogLogin").css({
							  'left': dialogL,
							  'top': dialogT
							});
					}
					//alert(document.referrer);
					//$('.curstatus a').hide();
				}
            }
        });
     },

    isLogined : function()
    {
        var $res = '';
        $.ajax({
            url      : base_url + '/user/isLogin',
            type     : 'post',
            dataType : 'json',
            async    : false,
            success  : function(result)
            {
                return result;
            }
        });
    },


    write_user_type : function(total)
{
    var $res = '';
    $.ajax({
        url      : base_url + '/evaluation/writeUserType',
        type     : 'post',
        dataType : 'text',
        data     : {'total' : total },
        async    : false,
        success  : function(result)
        {
            return result;
        }
    });
},
    /**
     * 验证邮箱
     * @param email
     * @returns {boolean}
     */
    verify_email : function(email)
    {
        $('#inputEmail').find('.wrong').hide().html('');
        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!pattern.test(email)){

            return false;
        }else{
            return true;
        }
    }

}
