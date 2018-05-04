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
        if(!userPhone){
            $.blt('手机号不能为空');
            return;
        }
        if(!passWord){
            $.blt('密码不能为空');
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
                salesId: "1"
            },
            success: function (data) {
                if (data.code == "0") {
                    $('#logup').modal('hide');
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
            $.blt('账号不能为空');
            return;
        }
        if(!password){
            $.blt('密码不能为空');
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
                    $('#login').modal('hide');
                    $.cookie('userId',data.results.userId);
                    $.cookie('accountId',data.results.userAccountId);
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
    //登录提交
    $('body').on('click', '#login-submit', function(){
        Index.login();
    })


});
