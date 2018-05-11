//测试服务器
var apiDomain = 'http://35.180.73.179/bocai-web';
var amountRegExp = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
    betSub = true,
    ruleName = {
        '100': '3 Way',
        '130': 'Odd/Even',
        '140': 'Correct Score',
        '350': 'Next Team To Score',
        '410': 'Total Goals Exactly'
    };

$.extend({
    detailObj : {},
    /*
    * 获取选项名
    * */
    getSelection: function(selectedId, ruleTypeId, cb){
        var ruleDetail;
        $.ajax({
            type: 'get',
            url: apiDomain + '/getRuleTypeDetail?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {selectedId: selectedId, ruleTypeId: ruleTypeId},
            success: function (data) {
                if (data.code == "0") {
                    ruleDetail = data.results;
                    cb(data.results);
                } else {

                }
            }
        })
        return ruleDetail;
    },
    /*下注框显示*/
    bets: function(obj){
        var stake = [100,200,500,1000],
            lis = "";
        for(var i=0; i<stake.length; i++){
            if(stake[i] < parseInt(obj.maxStakeLimit * 16)){
                lis += '<li class="bet-able">' + stake[i] +'</li>';
            } else {
                lis += '<li class="dis">' + stake[i] +'</li>';
            }
        }
        var betObj = {};
        $.getSelection(obj.selectionId, obj.ruleTypeId, function(data){
            var str = '<div class="modal fade" id="bets" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> '+
                '<div class="modal-dialog bet-slip modal-top">' +
                '<div class="modal-content login-content">' +
                '<div class="modal-header bets-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">Bet Slip</h4>' +
                '</div>' +
                '<div class="modal-body">'+
                '<div class="bet-left">' +
                '<h5>'+ data.selectionName +'</h5>' +
                '<p>'+ data.ruleTypeName +'<br>'+obj.homeTeam+'/'+obj.awayTeam+'</p>' +
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

            $.betObj = $.extend({}, obj, data);
        });


        $('body').on('click','.bet-able', function(){
            $('input[name="amount"]').val($(this).html());
            var n = $(this).html() * obj.requestPrice;
            $('.poss-win').html(n.toFixed(2));
        })

        $('input[name="amount"]').change(function(){
            var amount = parseInt($('input[name="amount"]').val());
            if(amount != "0" && !amountRegExp.test(amount)){
                $.blt('Please enter the amount');
                return;
            }else if(amountRegExp.test(amount) && amount > (obj.maxStakeLimit * 16)){
                $.blt('Rejected By Amount Exceeded'+ obj.maxStakeLimit * 16);
                return;
            }
            var n = $(this).val() * obj.requestPrice;
            $('.poss-win').html(n.toFixed(2));
        });
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
            '<h5>'+ obj.selectionName +'</h5>' +
            '<p>'+ obj.ruleTypeName +'<br>'+obj.homeTeam+'/'+obj.awayTeam+'</p>' +
            '<p class="s-p">Betting <strong>'+ obj.requestAmount +'</strong>Total Possible Win <strong class="orange">'+ (obj.requestAmount * obj.requestPrice) +'</strong></p>'+
            '</div>'+
            '<div class="modal-footer betSuc-footer">'+
            '<button type="button" data-dismiss="modal" class="back-btn inline-btn">Back</button>'+
            '<button type="button" class="bets-btn inline-btn share_button" >Share</button>'+
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
            '<h5>'+ obj.selectionName +'</h5>' +
            '<p>'+ obj.ruleTypeName +'<br>'+obj.homeTeam+'/'+obj.awayTeam+'</p>' +
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
     * 毫秒转换为日期 $.dateFmt(1439257392759,"yyyy-MM-dd hh:mm:ss");
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
    },
    /*
    * 分享，设置打开后的宽高
    * */
    popupwindow: function(url, title, w, h){
        wLeft = window.screenLeft ? window.screenLeft : window.screenX;
        wTop = window.screenTop ? window.screenTop : window.screenY;

        var left = wLeft + (window.innerWidth / 2) - (w / 2);
        var top = wTop + (window.innerHeight / 2) - (h / 2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    },
    /*
    * 查询下单选项信息
    *@param data 比赛详情选项数据
    * @param ruleType 玩法种类
    * @param selectionId 选项id
    * @returns {
    *   maxStakeLimit: 下单最大限额
    *   backOdds,
    *   v1,
    *   v2,
    *   v3
    *   }
    * */
    getSelect: function(data, ruleType, selectionId){
        var market = data['market'+ ruleType];

        if(market.selections.length){
            var obj = {};
            market.selections.filter(function(item, index){
                if(item.selectionId == selectionId){
                    obj = item;
                }
            })
            return obj;
        }
    },
    /*
    * 底部分享框
    * */
    shareModal: function(){
        // '<div class="mark"></div>'+
        var str =
            '<div class="accordion">'+
            '<p>Share to <span class="pull-right cancel">Cancel</span></p>'+
            '<div class="icon-btn">'+
            '<a href="javascript:;" class="icon facebook"><img src="../public/images/fb.jpg"> Facebook</a>'+
            '<a href="javascript:;" class="icon whatsApp"><img src="../public/images/wa.jpg"> WhatsApp</a>'+
            '</div>'+
            '</div>';

        //$('.mark').remove();
        $('.accordion').remove();
        $('body').append(str);
        $('.accordion').slideDown(300);

        $('.cancel').on('click', function(){
            $('.accordion').slideUp(300);
            $('.mark').hide();
        })
        // $('body').on('click','.mark', function(e){
        //     e.preventDefault();
        //     $('.accordion').slideUp(300);
        //     $('.mark').hide();
        // })
    },
    /**
     * 时间秒数格式化
     * @param s 时间戳（单位：秒）
     * @returns {*} 格式化后的时分秒
     */
    sec_to_time : function(ms) {
        var s = ms/1000;
        var t;
        if(s > -1){
            var hour = Math.floor(s/3600);
            var min = Math.floor(s/60) % 60;
            var sec = s % 60;
            if(hour < 10) {
                t = '0'+ hour + ":";
            } else {
                t = hour + ":";
            }

            if(min < 10){t += "0";}
            t += min + ":";
            if(sec < 10){t += "0";}
            t += parseInt(sec);
        }
        return t;
    }
})

$(function(){


/*  下注框显示
    可以下注的td，都有.able属性
*/
$(document).on('click','.able',function(){
    if(!$.cookie('userId')){
        $.blt('Please log in first');
        return;
    }
    var maxStakeLimit, v1, v2, v3, backOdds;
    if($(this).hasClass('race-detail')){
        var detailSelect = $.getSelect($.detailObj, $(this).data('ruletype'), $(this).attr('data-selectionId'));
        maxStakeLimit = detailSelect.maxStakeLimit;
        v1 = detailSelect.v1;
        v2 = detailSelect.v2;
        v3 = detailSelect.v3;
        backOdds = detailSelect.backOdds
    }else {
        maxStakeLimit = $(this).attr('data-maxStakeLimit') ;
        v1 = $(this).data('v1');
        v2 = $(this).data('v2');
        v3 = $(this).data('v3');
        backOdds = $(this).attr('data-backOdds')
    }
    //data-maxStakeLimit="{{= val.maxStakeLimit}}" data-v1="{{= val.v1}}" data-v2="{{= val.v2}}" data-v3="{{= val.v3}}" data-backOdds="{{= val.backOdds}}"


    $.bets({
        selectionId: $(this).attr('data-selectionId'),
        v1: v1,
        v2: v2,
        v3: v3,
        eventId: $(this).parent().attr('data-eventId'),
        marketId: $(this).attr('data-marketId'),
        ruleTypeId: $(this).attr('data-ruleType'),
        competitionName : $(this).parent().attr('data-competitionName'),
        homeTeam : $(this).parent().attr('data-homeTeamName'),
        awayTeam : $(this).parent().attr('data-awayTeamName'),
        placedResult : $(this).attr('data-verifyResult'),
        requestPrice : backOdds,
        maxStakeLimit : maxStakeLimit
    });
})
//下注提交
$('body').on('click', '.bets-submit', function () {
    var amount = parseInt($('input[name="amount"]').val());
    if (amount == "") {
        $.blt('Please enter the amount');
        return;
    } else if (amount == 0) {
        $.blt('Please enter the amount');
        return;
    }
    var data = $.extend({}, $.betObj, {requestAmount: amount, userId: $.cookie('userId'), accountId: $.cookie('accountId')});
    $.betSubmit(data);
})

$('body').css('min-height', $(window).height());

/* 分享 */
$('body').on('click', '.share_button', function () {
    $.shareModal();
})

$('body').on('click', '.facebook', function(){
    var url = window.location.href,
        userId = $.cookie('userId')
    var shareUrl = "http://www.facebook.com/sharer/sharer.php?u=" +url + "&salesId=" + userId;
    $.popupwindow(shareUrl, 'Facebook', 300, 200);
})
$('body').on('click', '.whatsApp', function(){
    var url = window.location.href,
        userId = $.cookie('userId')
    var shareUrl = "whatsapp://send?text=" +url + "&salesId=" + userId;
    $.popupwindow(shareUrl, 'whatsapp', 300, 200);
})

})

