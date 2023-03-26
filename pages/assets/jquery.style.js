
var demo = {
    request : function(url, param)
    {
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
        var paraObj = {}
        for (i=0; j=paraString[i]; i++){
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
        }
        var returnValue = paraObj[param.toLowerCase()];
        if(typeof(returnValue) == "undefined"){
            return '';
        }else{
            return returnValue;
        }
    },
    show_login : function()
    {
        $(".dialog").after('<iframe style="_display:block;_background-color:#fff;_width:100%;_height:100%;_z-index:99;" frameborder="0"></iframe><div class="dialogBg png"></div>'); //add bg
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

};

//added by zoujing to verify login data
$(function(){

    var localUrl = window.location.href;
    var pos = localUrl.search('loginErrorCode');
    var Error  = $('#loginError');
	var is_show_login = localUrl.search('user/login');
	if(is_show_login !=-1){
		demo.show_login();
	}
    if(pos!= -1){
        var errorCode = demo.request(localUrl, "loginErrorCode");
        if(errorCode != ''){
            demo.show_login();
        }
        var username = demo.request(localUrl, "username");
        if(username != ''){

        }
           switch (errorCode)
        {
            case '01' :
                user.login_alert(Error, "返回数据出错");
                break;
            case '02' :
            case '03' :
            case '04':
            case '2':
            case '1':
                user.login_alert(Error, "您输入的密码和登录名不匹配,请重新输入");
                break;
            case '05' :
                user.login_alert(Error, "账户被锁定！");
                break;
            case '06' :
                user.login_alert(Error, "用户未激活！<a href='" + base_url + "/user/regSuccess'>点击激活</a>");
                break;
            case '07' :
            case '3' :
                user.login_alert(Error, $('#verify').attr('Err-error'));
                break;
            case '08' :
            case '04' :
                user.login_alert(Error, $('#loginEmail').attr('Err-empty'));
                break;
            default :
                user.login_alert(Error, $('#loginEmail').attr('Err-loginErr'));
        }
    }

    // 登陆邮箱失去焦点时
    $('#loginEmail').blur(function(){
        var username = $.trim($(this).val());
		var isError  = false;
		var current_obj = $('#loginEmail');
		var obj_this = $(this);

        if(username == '')
            {
				current_obj.parent().next('.dialogError').children('span').html($(this).attr('Err-empty'));
				isError = true;
				return;
			}
        if(!user.verify_email(username)){
            {//$(this).next('.wrong').show().html($(this).attr('Err-format'));
				isError = true;
				current_obj.parent().next('.dialogError').children('span').html(current_obj.attr('Err-format'));
				return;
			}
        }
        /*if(data.email != username){
            console.log(data+"data");
			console.log("ccc");
			data.email = username;
			user.is_email(username);
        }*/
		current_obj.parent().next('.dialogError').children('span').html("");
		// if(isError == false){
			// console.log(isError3+":::3isError");
			// alert(current_obj.parent().length);
			// current_obj.parent().next('.dialogError').children('span').html("");
		// }
    });

	//登陆窗口密码框失去焦点时

	    $('#password').blur(function(){
		var passwordObj   = $('#password'),password = $("#password").val();
		if(password == ''){
            $(this).parent().next('.dialogError').children('span').html(passwordObj.attr('Err-empty'));
			return;
		}
        if(password.length < 6 || password.length > 20){
            $(this).parent().next('.dialogError').children('span').html(passwordObj.attr('Err-format'));
			return ;
        }
		$(this).parent().next('.dialogError').children('span').html("");
    });

	//登陆窗口验证码框失去焦点时

	    $('#verify').blur(function(){
		var verifyObj   = $('#verify'),verify = $("#verify").val();;
		if(verify == ''){
            $(this).parent().next('.dialogError').children('span').html(verifyObj.attr('Err-empty'));
			return;
		}
        if(verify.length !=4){
            $(this).parent().next('.dialogError').children('span').html(verifyObj.attr('Err-format'));
			return ;
        }
		$(this).parent().next('.dialogError').children('span').html("");
    });
    /*
        check user logining status
   */
   login_result =user.checkLoginStatus();
		/*
		console.log(login_result);
        if(login_result){
            $("#topL_login").html("您好");
            $("#topL_reg").attr("display","none");
            $("#topL_logout").attr("display","none");
            alert("log in");
        }else{
            alert("not login");
        }
		*/
    /*$('#verify').blur(function(){
        var username = $.trim($("#loginEmail").val());
        var passwd = $.trim($("#password").val());
        var data;
        console.log(333);
        if(username == ''){
           alert("用户名为空");
            return;
        }
        if(passwd == ''){
           alert("密码为空");
            return;
        }
        if(!user.verify_email(username)){
            $(this).next('.wrong').show().html($(this).attr('Err-format'));
            return;
        }
        alert(username+passwd);
        data =user.check_username_password(username,passwd);
        console.log(data);
        //if(data.email != username){
            //data.email = username;
          //  user.is_email(username);
        //}
    });
    */
        /** 点击保存修改的密码 **/
   /*$('#change_btn').click(function(){
        var hidefocus = $(this).attr('hidefocus');
        if(hidefocus == 'false')
            return;
        var change_result= user.change_pwd($(this));

        /*alert("change_result"+change_result);
        if(!change_result.status){
            alert("修改密码成功");
            $(".mainRCSlideC").attr('display', 'none');;
        }
    });*/

	// 修改密码错误提示处理
	$('#curr_pwd').blur(function(){
		$(this).parent().next('.mc_error').text('');
    });
	$('#new_pwd').blur(function(){
		$(this).parent().next('.mc_error').text('');
    });
	$('#confirm_pwd').blur(function(){
		$(this).parent().next('.mc_error').text('');
    });

	// 注册页面密码输入框失去焦点时
    $('#password').blur(function(){
		$(this).parent().next('.registerLCError').show().html("");
		var passwordObj   = $('#password'),rePassword = $.trim($(this).val()),rePasswordObj = $('#passwordAgain'),password = $("#password").val();
        if(password == '')
            return;
        if(password.length < 6 || password.length > 20){
            $(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return ;
        }
		if(password != rePassword){
            user.tip_alert(passwordObj, 'Err-same');
            return false;
        }
    });

	// 离开确认密码时
    $('#passwordAgain').blur(function(){
		$(this).parent().next('.registerLCError').show().html("");
		var rePassword = $.trim($(this).val()),rePasswordObj = $('#passwordAgain'),password = $("#password").val();
        if(rePassword == '')
            return;
        if(rePassword.length < 6 || rePassword.length > 20){
            $(this).parent().next('.registerLCError').show().html($(this).attr('Err-format'));
            return ;
        }
		if(password != rePassword){
            user.tip_alert(rePasswordObj, 'Err-same');
            return false;
        }
    });
})

$(function(){
	// TOPR_OTHERWEB
	$(".topR_otherWeb").hover(
		function(){
			$(".topR_otherWebT").after('<div class="topR_otherWebC"><a href="http://www.creditease.cn"  target="_blank">宜信官网</a><a href="http://baoxian.yixin.com/" target="_blank">宜信保险</a><a href="http://www.yixinfund.com/" target="_blank">宜信基金</a></div>');
			$(".topR_otherWebT b").addClass("topR_otherWebBtn");
		},
		function(){
			$(".topR_otherWebC").remove();
			$(".topR_otherWebT b").removeClass("topR_otherWebBtn");
		})

	// NAV
   // $(".nav a").eq(4).css("margin-left",0);
    $(".navChildBox").eq(4).css("right",0);
	$(".nav a").hover(
		function(){
			$(".navChildBox").hide();
			$(".nav a").remove("b").removeClass("curr");
			var num = $(this).index();
			if(num >= 0){
				$(this).append("<b></b>").addClass("curr");
				$(".navChildBox").eq(num).show();
			}
		},
		function(){
			$(".navChildBox").hide();
			$(".nav a").remove("b").removeClass("curr");
		}
	)
	$(".navChildBox").hover(
		function(){
			$(this).show();
			var num = $(this).index();
			$(".nav a").eq(num).append("<b></b>").addClass("curr");
		},
		function(){
			$(this).hide();
			$(".nav a").remove("b").removeClass("curr");
		}
	)

	// BANNER
	// drawing point
	$(".bannerPic").after('<div class="bannerPoint"></div>');
	var _picNum = $(".bannerPic img").length;
	$(".bannerPic").css("width",_picNum*1000+10);
	for(var i = 0;i < _picNum;i++){
		$(".bannerPoint").append('<a href="javascript:void(0);"></a>');
	}
	// point event
	var _picIndex = 0;
	$(".bannerPoint a").eq(0).addClass("on");
	$(".bannerPoint a").hover(function(){
		_picIndex = $(this).index();
		fun_scorllPic(_picIndex);
	})
	function fun_scorllPic(index){
		$(".bannerPoint a").removeClass("on");
		$(".bannerPic").stop(true,true).animate({
			left: (-1)*1000*index
		},1000)
		$(".bannerPoint a").eq(index).addClass("on");
	}
	function fun_scorllPicTime(){
		if(_picIndex < _picNum){
			fun_scorllPic(_picIndex);
			_picIndex++;
		}else{
			_picIndex = 0;
		}
	}
	var intervalProcess = setInterval(fun_scorllPicTime,3000);
	// bannerPic on event
	$(".bannerPic a").hover(
		function(){
			clearInterval(intervalProcess);
		},
		function(){
			intervalProcess = setInterval(fun_scorllPicTime,3000);
		}
	)
	// SCROLLPRODUCT
	$(".productBox").after("<div></div>"); //for ie6
	var _clickNum = 0;
	$(".bottomBoxT span").click(function(){
		if(_clickNum == 0){
			$(".productBox").show();
			$(".productBoxBus").stop(true,true).animate({left:0},500);
			$(this).addClass("iconPro");
			_clickNum = 1;
		}else if(_clickNum == 1){
			$(".productBoxBus").stop(true,true).animate({left:-738},500,function(){
				$(".productBox").hide();
			});
			$(this).removeClass("iconPro");
			_clickNum = 0;
		}
	})

	// DIALOG
	$(".topL_login").click(function(){
		//$(".dialog").after('<div class="dialogBg png" id="dialogBg"></div>'); //add bg
		//当没有dialogBg时才附加上,解决注册页面点击个人中心导致的背景没有退去
		if($('.dialogBg').length == 0){
			//$("body").append('<div class="dialogBg png" id="dialogBg"></div>'); //add bg
			$(".dialog").after('<div class="dialogBg png" id="dialogBg"></div>'); //add bg
		}
		//alert($('.dialogBg').length);
		$(".dialogBg").fadeIn();
		$("#dialogLogin").fadeIn();
		var dialogW = $("#dialogLogin").width();
		var dialogH = $("#dialogLogin").height();
		//var dialogL = $(document.body).outerWidth(true)/2-(dialogW/2);
        var dialogL = $(document.getElementsByTagName("body")[0]).outerWidth(true)/2-(dialogW/2);
		var dialogT = $(window).height()/2-(dialogH/2);
		//alert(dialogW+','+dialogH+','+dialogL+','+dialogT);
		$("#dialogLogin").css({
	      'left': dialogL,
	      'top': dialogT
	    });
	})

	$(".dialogClose").click(function(){
		$("#dialogLogin").fadeOut();
		$(".dialogBg png").remove();
		$("#dialogBg").hide();
		$("#dialogBg").remove();
		console.log("111111");
	})


	// MENU
	$(".menuT").css({'background':'url(images/menu0.png) no-repeat right'});
	for(var i=0;i<5;i++){
		var db = $(".menuC").eq(i).hasClass("db");
		if(db){
			$(".menuT").eq(i).css({'background':'url(/images/menu1.png) no-repeat right'});
		}
		if(i==4){
			$(".menuBox").eq(4).find(".menuT").html('<a href="http://i.yixin.com" target="_blank" style=" color:#7A3B0F; text-decoration:none;">客户中心</a>');
			$(".menuBox").eq(4).find(".menuC").remove();
		}
	}

	$(".menuT").click(function(){
		$(".menuC ul li a").removeClass("curr");
		$(".menuT").css({'background':'url(images/menu0.png) no-repeat right'});
		$(".menuC").hide();
		$(this).css({'background':'url(/images/menu1.png) no-repeat right'});
		$(this).next(".menuC").show();
	})
	$(".menuC ul li a").click(function(){
		$(".menuC ul li a").removeClass("curr");
		$(this).addClass("curr");
		$(this).closest(".menuC").show();
	})

	// MAINRCSLIDE
	$(".mainRCSlideT").css({'background':'url(/images/slide0.png) no-repeat 98% 15px #f8f8f8'});
	$(".mainRCSlideT").eq(0).css({'background':'url(/images/slide1.png) no-repeat 98% 15px #f8f8f8','marginTop':0});
	$(".mainRCSlideC").eq(0).show().stop().css({'paddingTop':0});
	// $(".mainRCSlideT").click(function(){
	// 	$(".mainRCSlideT").css({'background':'url(/images/slide0.png) no-repeat 98% 15px #f8f8f8'});
	// 	$(".mainRCSlideC").slideUp("slow");
	// 	$(this).next(".mainRCSlideC").slideDown("slow");
	// 	$(this).css({'background':'url(/images/slide1.png) no-repeat 98% 15px #f8f8f8'});
	// })
	$(".mainRCSlideT").click(function(){
		var x = $(this).attr("data");
		if(x == 1){
			$(this).next(".mainRCSlideC").slideUp("slow");
			$(this).css({'background':'url(/images/slide0.png) no-repeat 98% 15px #f8f8f8'});
			$(this).attr("data",0);
		} else if(x == 0){
			$(this).next(".mainRCSlideC").slideDown("slow");
			$(this).css({'background':'url(/images/slide1.png) no-repeat 98% 15px #f8f8f8'});
			$(this).attr("data",1);
		}
	})

	// table2
	$(".table2 tr").hover(
		function(){
			$(this).css('background-color',"#f1e7de")
			$(this).children("td:first").css('font-weight','bold')
		},
		function(){
			$(this).css('background-color',"#f9f9f9")
			$(this).children("td:first").css('font-weight','normal')
		}
	)

	// listBox &2
	$(".listBox ul li:even").css("background-color","#fafafa");
	$(".listBox2 ul li:odd").css("background-color","#fafafa");
	$(".mc_p2pCCBoxTable tbody tr:odd").css("background-color","#ededed");
	// gotop
	$(".gotop").gotop();

	// tab mc_p2pC
	$(".mc_p2pCT a").click(function(){
	$(".mc_p2pCCBox").hide();
	$(".mc_p2pCT a").removeClass("curr");
	$(this).addClass("curr");
	var tabNum = $(this).index();
	$(".mc_p2pCCBox").eq(tabNum).show();
	})

	// riskE
	var total = 0 , Gtotal = 0;
	$(".qAbox_nextPage").click(function(){
		var num = $(this).closest(".mc_riskEPage").find(".qAbox").length;
		var lengthchecked =  $(this).closest(".mc_riskEPage").find(".qAbox :radio:checked").length;
		if(lengthchecked < num ){
			alert("请认真填写");
			return false;
		} else if(lengthchecked == num){
			// pageNext
			$(this).closest(".mc_riskEPage").hide().next(".mc_riskEPage").show();
		}

	})

	$(".qAbox label").hover(
		function(){
			$(this).css("background-color","#f5ddc5");
		},
		function(){
			$(this).css("background-color","#fff");
		}
	)
	// qAbox_result
	$(".qAbox_result").click(function(){
		var num = $(this).closest(".mc_riskEPage").find(".qAbox").length;
        var userType =0;
		var lengthchecked =  $(this).closest(".mc_riskEPage").find(".qAbox :radio:checked").length;
		if(lengthchecked < num ){
			alert("请认真填写");
			return false;
		} else if(lengthchecked == num){
			// result
			$(":radio:checked").each(function(){
				Gtotal = Gtotal + parseInt($(this).val());
			});

			if(Gtotal>=13&&Gtotal<=25){
                userType =1;
				$(".mc_riskEResult .mc_riskEStrong").hide();
				$(".mc_riskEResult .mc_riskEStrong").eq(0).show();
				$("#riskE1").find("tbody").append(riskE1);
				$(".mc_resultOther a").hide();
				$("#riskEa2").show();
				$("#riskEa3").show();

			}
			else if(Gtotal>=26&&Gtotal<=37){
                userType =2;
                $(".mc_riskEResult .mc_riskEStrong").hide();
				$(".mc_riskEResult .mc_riskEStrong").eq(1).show();
				$("#riskE1").find("tbody").append(riskE2);
				$(".mc_resultOther a").hide();
				$("#riskEa1").show();
				$("#riskEa3").show();
			}
			else if(Gtotal>=38&&Gtotal<=49){
                userType =3;
				$(".mc_riskEResult .mc_riskEStrong").hide();
				$(".mc_riskEResult .mc_riskEStrong").eq(2).show();
				$("#riskE1").find("tbody").append(riskE3);
				$(".mc_resultOther a").hide();
				$("#riskEa1").show();
				$("#riskEa2").show();
			}
            //console.log("checkLoginStatus");
            if(user.isLogined){
                user.write_user_type(userType);
            }
			$(".mc_riskE").hide();
			$(".mc_riskEResult").show();
		}
	})
// 保守型
var riskE1 = '<tr>\
<td>现金/活期存款</td>\
<td>20%</td>\
</tr>\
<tr>\
<td>债券/保本理财产品</td>\
<td>40%</td>\
</tr>\
<tr>\
<td>信托/其他固定收益类产品</td>\
<td>25%</td>\
</tr>\
<tr>\
<td>股票/偏股基金</td>\
<td>15%</td>\
</tr>\
<tr>\
<td>PE</td>\
<td>0%</td>\
</tr>';
// 稳健型
var riskE2 ='<tr>\
<td>现金/活期存款</td>\
<td>15%</td>\
</tr>\
<tr>\
<td>债券/保本理财产品</td>\
<td>25%</td>\
</tr>\
<tr>\
<td>信托/其他固定收益类产品</td>\
<td>30%</td>\
</tr>\
<tr>\
<td>股票/偏股基金</td>\
<td>25%</td>\
</tr>\
<tr>\
<td>PE</td>\
<td>5%</td>\
</tr>';
// 进取型
var riskE3 ='<tr>\
<td>现金/活期存款</td>\
<td>10%</td>\
</tr>\
<tr>\
<td>债券/保本理财产品</td>\
<td>10%</td>\
</tr>\
<tr>\
<td>信托/其他固定收益类产品</td>\
<td>20%</td>\
</tr>\
<tr>\
<td>股票/偏股基金</td>\
<td>40%</td>\
</tr>\
<tr>\
<td>PE</td>\
<td>20%</td>\
</tr>';


$("#riskEa1").riskEHover({tab:riskE1});
$("#riskEa2").riskEHover({tab:riskE2});
$("#riskEa3").riskEHover({tab:riskE3});

// 重做风险偏好评估 mc_riskERefresh
$(".mc_riskERefresh").click(function(){
	Gtotal=0;
	$(":radio:checked").each(function(){
		$(this).attr("checked",false);
	});
	$("#riskE1").find("tbody").html("");
	$(".mc_riskEResult").hide();
	$(".mc_riskEPage").hide();
	$(".mc_riskEPage").eq(0).show();
	$(".mc_riskE").show();
})
	//contact
	$(".mc_contactMap a").click(function(){
		var cityNum = $(this).index();
		$(".mc_contactMap a").removeClass("curr");
		$(this).addClass("curr")
		$(".mc_contactMapC").hide();
		$(".mc_contactMapC").eq(cityNum).fadeIn();
	})

	// mc_assetSpanBox
	$(".mc_assetSpanbox li span").click(function(){
		var x = $(this).attr("name");
		if(x==1){
			$(this).attr("name",0).removeClass("curr");
		}else{
			$(this).attr("name",1).addClass("curr");
		}

	})


    var select_kind ='';
    var select_value ='';
    var kind_type=0;
    var myNumArr = [];
    var myValArr =[];
    var kind='';
    //选择理财步骤1、2
    $(".mystep").click(function(){
         check = false;
        //判断是否选中类型
        $(".radioBox input:radio").each(function(){
            if(this.checked){
                check = true;
            }
        });

   	  var isselpro = false;
   	   //验证是否选择理财产品
       $(".mc_assetSpanbox li span").each(function(i){
            if($(this).attr("name") == 1){
               isselpro = true;
            }
        });
       if (isselpro == false) {
       		alert('请选择理财产品种类');
       		return false;
       }
       //验证选择类型
       if (check == false) {
            alert('请选择类型！！');
            return false;
       }
        if(check == true  && isselpro == true){
            kind =$(':radio[name="lx"]:checked').val();
            kind_type =$(':radio[name="lx"]:checked').val();
            select_kind +=kind;
            select_kind +='|';
            var $mc_assetSpanbox = $('.step2 .mc_assetSpanbox'),
                $li = $(".mc_assetSpanbox li span"),
                $step1 = $('.step1'),
                $step2 = $('.step2');
            $mc_assetSpanbox.html('');
            $step1.hide();
            $step2.show();
            //被选中选项
            $li.each(function(i){
                var num = $(this).attr("name");
                    if(num == 1){
                        var name = $(this).html();
                        myNumArr.push([i,name]);
                        select_kind +=i;
                        select_kind +='|';
                    }
            });
            //第二步被选中填写信息
            $.each(myNumArr, function(i, n){
                var con = '<div id="scroll0'+n[0]+'" class="scrollBox l">\
                        <div class="scrollT clearfix" >\
                            <span class="scrollTL">'+n[1]+'：</span>\
                            <input class="slText" type="text" value="0" name="scroll0'+n[0]+'" onfocus="shownums(this,1)" onblur="shownums(this,2)"/>\
                            <span>万元</span>\
                        </div>\
                        <div class="scrollB clearfix" >\
                            <span>Min</span>\
                            <div class="scrollLine">\
                                <div class="linePoint"></div>\
                                <div class="redLine" style="width:0%;"></div>\
                            </div>\
                            <span>Max</span>\
                        </div>\
                    </div>';
              $mc_assetSpanbox.append(con);
              //执行滑动效果
             // $("#scroll0"+n).scrollPoint();
            });
        }
                 $(".scrollBox").scrollPoint();
    });

    // 点击个人中心后内容展示
   $("#userCenter").click(function(){
        var result = user.getEvaluationResultByUserid();
       alert(result);
   });
    //返回第一步
    $(".btnPre").click(function(){
	     myNumArr = [];
        $(".step1").show();
        $(".step2").hide();
        $(".step3").hide();
    });
   var iszore = false;
     //下一步
    $("#asset3Result").click(function(){
    	//验证内容框输入的是否有为0的情况
    	$('.slText').each(function(i,obj){
    		if ($(obj).val() <= 0 ){
    			//替换字符串中的：号
    			var resstr = $('span.scrollTL').get(i).innerHTML.replace(/\：/, '');
    			iszore = true;
    			alert("请设置"+resstr+"中的资金数！");
    			//alert(iszore);
    			return false;
    		} else {
    			//alert(iszore);
    			iszore = false;
    		}
    	});
    	//如果有一项为0不提交
    	if (iszore == true) {
    		return false;
    	}
        $(".step3").show();
        $(".step2").hide();
        $(".step1").hide();
        $(".slText").each(function(i){
            var t=$(this).val();
            myValArr.push([i,t]);
            select_value +='|';
            select_value +=t;
        });
        var myresult=user.getEvaluationResult(select_kind,select_value,kind_type);
        myresult = myresult.split('|');
        //console.log("myresult"+myresult);
        var rate = myresult[0];
		var total_all = myresult[1];
        var mytotal = 0;
        var average_rate =myresult[2]*100;
        average_rate =average_rate.toFixed(2);
        var total_rate = myresult[3];
        var table_value = myresult[4];
        var risk_type = myresult[5];
        //alert(table_value+"table_value:");
        table_value = table_value.split(',');
        //alert(table_value+"table_value2");
        //console.log("table_value:::"+table_value);
        $(".asset3Num2").html(total_all);
        $(".asset3Num").html(average_rate);
      	//console.log(rate+"::"+mytotal+"::"+average_rate+";;");
                    var chart;
                    var rate_data = eval(rate);
                   // console.log("rate_data:"+rate_data);
                    //console.log(typeof(total_rate));
                    //var total_rate_data = eval(total_rate);
					//var total_rate_data = total_rate;
                        var options = {
                            chart: {
                                renderTo: 'tuxing',
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            },
                            title: {
                                text: ''
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.y}%</b>',
                                percentageDecimals: 1
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        color: '#000000',
                                        connectorColor: '#000000',
                                        formatter: function() {
                                            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                name: 'Proportion'
                            }]
                        }
                        //rate = [['Firefox',45.0],['IE',26.8],{name: 'Chrome',y: 12.8,sliced: true,selected: true},['Safari',8.5],['Opera',6.2],['Others',0.7]];
                        //alert(typeof(rate));
						//console.log(rate_data+"rate_data");
                        options.series[0].data = rate_data;
                        chart = new Highcharts.Chart(options);
                       // console.log("chart:"+chart);
                       //add by zoujing

                        var chart2;

                    /*
                    var rate_d = [];
                    for(var o in rate_data){
                            rate_d.push([
                                rate_data[o].key,
                                rate_data[o].value
                            ]);
                    }*/

                        var options2 = {
                            chart: {
                                renderTo: 'tuxing_total',
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            },
                            title: {
                                text: ''
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.y}%</b>',
                               // pointFormat: this.point[0]+': <b>'+this.point[1]+'%</b>',
                                percentageDecimals: 1
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        color: '#000000',
                                        connectorColor: '#000000',
                                        percentageDecimals: 1,
                                        formatter: function() {
                                            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                name: 'Proportion'
                            }]
                        }
                    //rate = [['Firefox',45.0],['IE',26.8],{name: 'Chrome',y: 12.8,sliced: true,selected: true},['Safari',8.5],['Opera',6.2],['Others',0.7]];
                    var total_rate_data = eval(myresult[3]);
					options2.series[0].data = total_rate_data;
					//console.log("options2:"+options2);
                    chart2 = new Highcharts.Chart(options2);
					//console.log("options2.series[0].data"+options2.series[0].data);
				//	console.log("chart2"+chart2);
					   for(var i=0;i<table_value.length;i++){
							var mytemp =table_value[i];
							//console.log(mytemp);
							var myrow1 =mytemp.split(':');
							mytotal +=parseFloat(myrow1[2]);
					   }
					   //console.log(mytotal+"mytotal");
                       for(var i=0;i<table_value.length;i++){
                            var tmp =table_value[i];
                            var row1 =tmp.split(':');
                            if(row1[0]=="xjl"){
                                var tmp_rate_xj =row1[1]+"%";
                                $("#xjl_rate").html(tmp_rate_xj);
                                $("#xjl_rate2").html(tmp_rate_xj);
                                var tmp_value_xj =row1[1]*mytotal/100;
                                tmp_value_xj =tmp_value_xj.toFixed(1);
                                //alert(tmp_value_xj+mytotal+row1[0]);
                                $("#xjl_value").html(tmp_value_xj);

                            }
                            if(row1[0]=="gdsy"){
                                var tmp_rate_gdsy =row1[1]+"%";
                                $("#gdsy_rate").html(tmp_rate_gdsy);
                                $("#gdsy_rate2").html(tmp_rate_gdsy);
                                var tmp_value_gdsy =row1[1]*mytotal/100;
                                tmp_value_gdsy =tmp_value_gdsy.toFixed(1);
                                //alert(tmp_value_gdsy+mytotal+row1[0]+'testestetrwsetse');
                                $("#gdsy_value").html(tmp_value_gdsy);

                            }
                            if(row1[0]=="qyl"){
                                var tmp_rate_qx =row1[1]+"%";
                                $("#qyl_rate").html(tmp_rate_qx);
                                $("#qyl_rate2").html(tmp_rate_qx);
                                var tmp_value_qy =row1[1]*mytotal/100;
                                tmp_value_qy =tmp_value_qy.toFixed(1);
                                //alert(tmp_value_qy+mytotal+row1[0]);
                                $("#qyl_value").html(tmp_value_qy);

                            }
                            if(row1[0]=="lltz"){
                                var tmp_rate_other =row1[1]+"%";
                                $("#lltz_rate").html(tmp_rate_other);
                                $("#lltz_rate2").html(tmp_rate_other);
                                var tmp_value_other =row1[1]*mytotal/100;
                                tmp_value_other =tmp_value_other.toFixed(1);
                                //alert(tmp_value_other+mytotal+row1[0]);
                                $("#lltz_value").html(tmp_value_other);

                            }
                        }
                        if(risk_type==1){
							$("#kind_type").html("保守型");
                            $("#xjl_rate_range").html("20~41%");
                            $("#gdsy_rate_range").html("48~60%");
                            $("#qyl_rate_range").html("0~35%");
                            $("#lltz_rate_range").html("0%");
                            $("#xjl_rate_adjust").html("28%");
                            $("#gdsy_rate_adjust").html("53%");
                            $("#qyl_rate_adjust").html("19%");
                            $("#lltz_rate_adjust").html("0%");
                        }else if(risk_type==2){
                            $("#kind_type").html("稳健性");
                            $("#xjl_rate_range").html("5~50%");
                            $("#gdsy_rate_range").html("10~50%");
                            $("#qyl_rate_range").html("30~70%");
                            $("#lltz_rate_range").html("0~15%");
							$("#xjl_rate_adjust").html("22%");
                            $("#gdsy_rate_adjust").html("23%");
                            $("#qyl_rate_adjust").html("49%");
                            $("#lltz_rate_adjust").html("6%");
                        }else if(risk_type==3){
                            $("#kind_type").html("进取型");
                            $("#xjl_rate_range").html("5~65%");
                            $("#gdsy_rate_range").html("0~75%");
                            $("#qyl_rate_range").html("15~75%");
                            $("#lltz_rate_range").html("0~25%");
                            $("#xjl_rate_adjust").html("23%");
                            $("#gdsy_rate_adjust").html("22%");
                            $("#qyl_rate_adjust").html("47%");
                            $("#lltz_rate_adjust").html("8%");
                        }
							//删除统计图按钮
							$('.highcharts-button').remove();
                    });

})

$.fn.extend({
 //gotop
  gotop:function(){
    var goTopShowAndHide = function(){
      h = $(window).height();
      t = $(document).scrollTop();
      if(t > h){
        $('.gotop').show();
      }else{
        $('.gotop').hide();
      }
    };
    goTopShowAndHide();
    $('.gotop').click(function(){
      $(document).scrollTop(0);
    });
    $(window).scroll( function() {goTopShowAndHide(); } );
  },
  // riskEHover
  riskEHover:function(con){
  	$(this).hover(
  		function(){
			var txt = $(this).text();
			$(".mc_resultOtherTab p").text(txt);
			$(".mc_resultOtherTab").stop(true,true).fadeIn();
			$(".mc_resultOtherTab table tbody").append(con.tab);
		},
		function(){
			$(".mc_resultOtherTab").hide();
			$(".mc_resultOtherTab table tbody").html("");
		}
  	)
  },
  scrollPoint:function(con){
  	// scorllLine 0-1000
	$(this).find(".slText").change(function(){
		var slTextVal = $(this).val();
        var $scrollBox = $(this).closest(".scrollBox");
		if((slTextVal<=1000)&&(slTextVal>=0)){
			var redWidthMax = $scrollBox.find(".scrollLine").width();
			var redWidth = slTextVal*0.001*(redWidthMax-7);
            var pointWidth = slTextVal*0.001*(redWidthMax-13);
            $scrollBox.find(".redLine").width(redWidth);
            $scrollBox.find(".linePoint").css("left",pointWidth);
		}else{
			alert("您输入的不是有效值，请输入0-1000之间的数字");
            $scrollBox.find(".redLine").width(0);
            $scrollBox.find(".linePoint").css("left",0);
			$(this).val(0);
		}
	})
    // 鼠标拖动效果
    var dragging = false;
    var iX;
    $(this).find(".linePoint").mousedown(function(e) {
        dragging = true;
        iX = e.clientX - this.offsetLeft;
        this.setCapture && this.setCapture();
    });
    $(this).find(".scrollLine").mousemove(function(e){
		if (dragging) {
            var e = e || window.event;
            var oX = e.clientX - iX;
            var redWidth = oX+7;
            if(oX <=0){
                oX =0;
                redWidth = 0;
            } else if (oX >= 147){
                oX = 147;
                redWidth = 160;
            }
            $scrollBox = $(this).closest(".scrollBox");
            $scrollBox.find(".linePoint").css({"left":oX + "px"});
            $scrollBox.find(".redLine").width(redWidth);
            $scrollBox.find(".slText").val(parseInt(redWidth/160*1000));
            return false;
        }
    })
    $(this).find(".scrollLine").mouseup(function(e) {
        dragging = false;
         if ($(this).closest(".scrollBox").find(".linePoint")[0].releaseCapture) {    // Internet Explorer
                $(this).closest(".scrollBox").find(".linePoint")[0].releaseCapture ();
            }else if(window.captureEvents){
                window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
            }
      //  $(this).closest(".scrollBox").find(".linePoint")[0].releaseCapture();
        e.cancelBubble = true;
    })
  }

})

