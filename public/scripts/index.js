var Index = {
    /* 获取推荐赛事列表 */
    homeList: function(){
        $.ajax({
            type: 'get',
            url: apiDomain + '/order/homeList?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {},
            success: function (data) {
                console.log(data);
                if (data.code == "0") {
//                  渲染模版
                    var tpl = doT.template($("#tpl-recommendList").html());
                    $("#res-recommendList").html(tpl(data.results));
                } else {
                    //简单提示框
                    $.blt(data.msg);
                }
            }
        })
    },
/* 获取轮播图 */
    getBanner: function(){
        $.ajax({
            type: 'get',
            url: apiDomain + '/adInfo/findAdInfoAll?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {},
            success: function (data) {
                if (data.code == "0") {
//                  渲染模版
                    var tpl = doT.template($("#tpl-banner").html());
                    $("#res-banner").html(tpl(data.results));

                    // banner
                    var mySwiper = new Swiper ('.swiper-container', {
                        direction: 'horizontal',
                        loop: true,
                        // autoplay: {
                        //     delay: 2500,
                        //     disableOnInteraction: false,
                        // },
                        // 如果需要分页器
                        pagination: {
                            el: '.swiper-pagination',
                        }
                    })
                    $.adaImg($("#res-banner"));
                } else {
                    //简单提示框
                    $.blt(data.msg);
                }
            }
        })
    },
/* 注册 */
    register: function(){
        var userPhone = $('input[name="userPhone"]').val();
        var passWord = $('input[name="passWord"]').val();
        var userCode = $('input[name="userCode"]').val();
        var salesId = $.getQueryString('salesId')  || "";

        if(!userPhone){
            $.blt('Please enter the account');
            return;
        }
        if(!passWord){
            $.blt('Please enter the password');
            return;
        }
        if(!userCode){
            $.blt('Please enter the userCode');
            return;
        }
        if(!$('.agress').hasClass('agreed')){
            $.blt('Please agree with the user agreement');
            return;
        }
        $.ajax({
            type: 'get',
            url: apiDomain + '/user/register?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {
                userPhone: userPhone,
                passWord: passWord,
                salesId: salesId,
                userCode: userCode
            },
            success: function (data) {
                if (data.code == "0") {
                    $.blt("SUCCESS");
                    $('#logup').modal('hide');
                } else {
                    //简单提示
                    $.blt(data.msg);
                }
            }
        })
    },
    /* 获取验证码*/
    getCode: function(ele){
        var userPhone = ele.val();
        if(!userPhone){
            $.blt('Please enter the account');
            return;
        }
        $.ajax({
            type: 'get',
            url: apiDomain + '/user/getPhoneCode?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {
                userPhone: userPhone,
            },
            success: function (data) {
                if (data.code == "0") {
                    $.blt('SUCCESS');
                } else {
                    //简单提示
                    $.blt(data.msg);
                }
            }
        })

    },
    /* 登录 */
    login: function(){
        var accountNumber = $('input[name="accountNumber"]').val();
        var password = $('input[name="password"]').val();
        if(!accountNumber){
            $.blt('Please enter the account');
            return;
        }
        if(!password){
            $.blt('Please enter the password');
            return;
        }
        $.ajax({
            type: 'get',
            url: apiDomain + '/user/sign?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {
                accountNumber: accountNumber,
                password: password
            },
            success: function (data) {
                if (data.code == "0") {
                    $.blt('SUCCESS');
                    $('#login').modal('hide');
                    $.cookie('userId',data.results.userId, { expires: 1, path: '/' });
                    $.cookie('userPhone',data.results.userPhone, { expires: 1, path: '/' });
                    $.cookie('accountId',data.results.userAccountId, { expires: 1, path: '/' });
                    $.cookie('userReadMessageState',data.results.userReadMessageState, { expires: 1, path: '/' });

                    $('.sign-btn').hide();
                    $('.toUser').show();
                } else {
                    //简单提示
                    $('#login').modal('hide');
                    $('#login-fail').modal('show');
                }
            }
        })
    },
    /* 忘记密码 */
    reset: function(){
        var userPhone = $('input[name="userPhone2"]').val();
        var newPassWord = $('input[name="newPassWord"]').val();
        var userCode = $('input[name="userCode2"]').val();

        if(!userPhone){
            $.blt('Please enter the account');
            return;
        }
        if(!newPassWord){
            $.blt('Please enter the password');
            return;
        }
        if(!userCode){
            $.blt('Please enter the userCode');
            return;
        }
        $.ajax({
            type: 'get',
            url: apiDomain + '/user/forgetPwd?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {
                userPhone: userPhone,
                passWord: newPassWord,
                userCode: userCode
            },
            success: function (data) {
                if (data.code == "0") {
                    $.blt("SUCCESS");
                    $('#reset').modal('hide');
                } else {
                    //简单提示
                    $.blt(data.msg);
                }
            }
        })
    }
}

$(document).ready(function() {
    Index.homeList();

    //侧边栏控制
    $('.menu-link').bigSlide();

    Index.getBanner();

    //忘记密码
    $('body').on('click', '.reset', function(){
        $('#login').modal('hide');
        $('#reset').modal('show');
    })
    //注册
    $('body').on('click', '.logup', function(){
        $('#login').modal('hide');
        $('#logup').modal('show');
    })
    //注册提交
    $('body').on('click', '#logup-btn', function(){
        Index.register();
    })

    $('body').on('click', '.agress', function(){
        $(this).toggleClass('agreed');
    })

    //登录提交
    $('body').on('click', '#login-submit', function(){
        Index.login();
    })

    if($.cookie('userId')){
        $('.sign-btn').hide();
        $('.toUser').show();
    }else {
        $('.sign-btn').show();
        $('.toUser').hide();
    }

    if($.cookie('userReadMessageState')=="0"){
        $('.news-tip').show();
    }else{
        $('.news-tip').hide();
    }
    $('body').on('click', '#smsSend', function(){
        Index.getCode($('input[name="userPhone"]'));
    })
    $('body').on('click', '#re-smsSend', function(){
        Index.getCode($('input[name="userPhone2"]'));
    })

    $('body').on('click', '.reset-btn', function(){
        Index.reset();
    })
});
