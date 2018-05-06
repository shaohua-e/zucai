//测试服务器
var apiDomain = 'http://35.180.73.179/bocai-manager';
var amountRegExp = /^[0-9]*$/,
    betSub = true,
    ruleName = {
        '100': '3 Way',
        '130': 'Odd/Even',
        '140': 'Correct Score',
        '350': 'Next Team To Score',
        '410': 'Total Goals Exactly'
    };

$.extend({
    betObj : {},
    /*下注框显示*/
    bets: function(obj){
        var stake = [100,200,500,1000],
            lis = "";
        for(var i=0; i<stake.length; i++){
            if(stake[i] < parseInt(obj.maxStakeLimit)){
                lis += '<li class="bet-able">' + stake[i] +'</li>';
            } else {
                lis += '<li class="dis">' + stake[i] +'</li>';
            }
        }

        var str = '<div class="modal fade" id="bets" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> '+
            '<div class="modal-dialog bet-slip modal-top">' +
            '<div class="modal-content login-content">' +
            '<div class="modal-header bets-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">Bet Slip</h4>' +
            '</div>' +
            '<div class="modal-body">'+
            '<div class="bet-left">' +
            '<h5>SV Dellach/Gail or Draw</h5>' +
            '<p>Double Chance <br> SC Landskron v SV Dellach/Gail</p>' +
            '</div>' +
            '<div class="bet-right">' +
            '<input type="text width30" class="form-control" placeholder="Stake" name="amount" data-maxStakeLimit="'+ obj.maxStakeLimit +'">' +
            '<p>Total Possible Win <br><strong class="poss-win"></strong></p>' +
            '</div>' +
            '<ul class="bets-amount">' +
                lis +
            '</ul>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn bets-btn bets-submit">ACCEPT</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#bets').remove();
        $('body').append(str);

        $('#bets').modal('show');

        $('body').on('click','.bet-able', function(){
            $('input[name="amount"]').val($(this).html());
            var n = $(this).html() * obj.requestPrice;
            $('.poss-win').html(n.toFixed(2));
        })

        $('input[name="amount"]').change(function(){
            var amount = parseInt($('input[name="amount"]').val());
            if(amount != "0" && !amountRegExp.test(amount)){
                $.blt('购买金额请输入数字');
                return;
            }else if(amountRegExp.test(amount) && amount > (obj.maxStakeLimit * 16)){
                $.blt('不能大于最大购买额度'+ obj.maxStakeLimit);
                return;
            }
            var n = $(this).val() * obj.requestPrice;
            $('.poss-win').html(n.toFixed(2));
        });
        $.betObj = obj;
    },
    /*下注框成功*/
    betsSuccess: function(obj){
        var str = '<div class="modal fade" id="bets-success" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog bet-slip modal-top">'+
            '<div class="modal-content login-content">'+
            '<div class="modal-header betsSuc-header">'+
            '<h4 class="modal-title"><img src="../public/images/bets-suc.png" class="bet-sucIcon"/>Congratulations</h4>'+
            '</div>'+
            '<div class="modal-body betSuc-body">'+
            '<h5>'+ obj.homeTeamName +'/'+ obj.awayTeamName +'</h5>'+
            '<p>'+ ruleName[obj.ruleTypeId] +'</p>'+
            '<p class="s-p">Betting <strong>'+ obj.requestAmount +'</strong>Total Possible Win <strong class="orange">'+ (obj.requestAmount * obj.requestPrice) +'</strong></p>'+
            '</div>'+
            '<div class="modal-footer betSuc-footer">'+
            '<button type="button" data-dismiss="modal" class="back-btn inline-btn">Back</button>'+
            '<button type="button" class="bets-btn inline-btn">Share</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $('#bets-success').remove();
        $('body').append(str);
        $('#bets-success').modal('show');
    },
    /*下注框失败*/
    betsFail: function(obj){
        var str = '<div class="modal fade" id="bets-fail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog bet-slip modal-top">'+
            '<div class="modal-content login-content">'+
            '<div class="modal-header betsSuc-header">'+
            '<h4 class="modal-title"><img src="../public/images/bets-fail.png" class="bet-sucIcon"/>Oops！</h4>'+
            '</div>'+
            '<div class="modal-body betSuc-body">'+
            '<h5>'+ obj.homeTeamName +'/'+ obj.awayTeamName +'</h5>'+
            '<p>'+ ruleName[obj.ruleTypeId] +'</p>'+
            '<p class="s-p">Betting <strong>'+ obj.requestAmount +'</strong>Total Possible Win <strong class="orange">'+ (obj.requestAmount * obj.requestPrice) +'</strong></p>'+
            '</div>'+
            '<div class="modal-footer betSuc-footer">'+
            '<button type="button" data-dismiss="modal" class="back-btn inline-btn">Back</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $('#bets-fail').remove();
        $('body').append(str);

        $('#bets-fail').modal('show');
    },
    /* 下单提交 */
    betSubmit: function(obj){

        $.ajax({
            type: 'get',
            url: apiDomain + '/order/placeOrder?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: obj,
            success: function (data) {
                $('#bets').modal('hide');
                if (data.code == "0") {
                    $.betsSuccess(obj);
                } else {
                    $.betsFail(obj);
                }
            }
        })
    },
    /* 简单提示框，txt：提示语 */
    blt: function(txt,cb){
        var str = '<div class="modal fade" id="prompt" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                        '<div class="modal-dialog login-box modal-top">'+
                            '<div class="modal-content login-content">'+
                                '<div class="modal-body login-fail">'+
                                    '<h5>'+ txt +'</h5>'+
                                '</div>'+
                                '<div class="modal-footer betSuc-footer">'+
                                    '<button type="button" data-dismiss="modal" class="btn login-btn blt-close">OK</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                '</div>';
        $('#prompt').remove();
        $('body').append(str);
        $('#prompt').modal('show');

        $('.blt-close').on('click', function(){
            if(typeof cb == "function"){
                cb();
            }
        })
    },
    /**
     * 截取传参
     * @param name key值
     * @returns {null}
     * @constructor
     */
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return decodeURI(r[2]);
        return null;
    },
    /**
     * 毫秒转换为日期 $.dateFmt(1439257392759,"yyyy-MM-dd hh:mm");
     * @param time 毫秒 此处 秒*1000
     * @param fmt  转换格式
     * @returns {*}
     */
    dateFmt: function (time, fmt) {
        //var t = new Date(time * 1000);
        var t = new Date(time);
        var o = {
            "M+": t.getMonth() + 1, //月份
            "d+": t.getDate(), //日
            "h+": t.getHours(), //小时
            "m+": t.getMinutes(), //分
            "s+": t.getSeconds(), //秒
            "q+": Math.floor((t.getMonth() + 3) / 3), //季度
            "S": t.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;

    },
    /**
    * 图片适配，例：banner图适配
    * @param 元素对象，查找元素的后代图片元素
    **/
    adaImg: function(ele){
        var imgs = $(ele).find('img');
        imgs.each(function(index, item){
            $(item).load(function(){
                var w1 = $(item).parent().width(),
                    h1 = $(item).parent().height(),
                    w2 = $(item).width(),
                    h2 = $(item).height();
                var p1 = w1/h1;
                var p2 = w2/h2;
                if(p1>p2){
                    $(item).css('width', '100%');
                    $(item).css('margin-top', -($(item).height()-h1)/2);

                }else{
                    $(item).css('height', '100%');
                    $(item).css('margin-left', -($(item).width()-w1)/2);
                }
            })
        })
    }
})

/*  下注框显示
    可以下注的td，都有data-bets属性
*/
$('body').on('click','.able',function(){
    if(!$.cookie('userId')){
        $.blt('请先登录');
        return;
    }
    $.bets({
        selectionId: $(this).attr('data-selectionId'),
        v1: $(this).data('v1'),
        v2: $(this).data('v2'),
        v3: $(this).data('v3'),
        eventId: $(this).parent().attr('data-eventId'),
        marketId: $(this).attr('data-marketId'),
        ruleTypeId: $(this).attr('data-ruleType'),
        competitionName : $(this).parent().attr('data-competitionName'),
        homeTeamName : $(this).parent().attr('data-homeTeamName'),
        awayTeamName : $(this).parent().attr('data-awayTeamName'),
        placedResult : $(this).attr('data-verifyResult'),
        requestPrice : $(this).attr('data-backOdds'),
        maxStakeLimit : $(this).attr('data-maxStakeLimit')
    });
})
//下注提交
$('body').on('click', '.bets-submit', function () {
    var amount = parseInt($('input[name="amount"]').val());
    if (amount == "") {
        $.blt('请输入购买金额');
        return;
    } else if (amount == 0) {
        $.blt('请输入购买金额');
        return;
    }
    var data = $.extend({}, $.betObj, {requestAmount: amount, userId: $.cookie('userId'), accountId: $.cookie('accountId')});
    $.betSubmit(data);
})

$('body').css('min-height', $(window).height());



