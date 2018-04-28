//测试服务器
var apiDomain = 'http://35.180.73.179/bocai-manager';
$.extend({
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
            '<input type="text width30" class="form-control" name="requestAmount" placeholder="Stake" data-maxStakeLimit="'+ obj.maxStakeLimit +'">' +
            '<p>Total Possible Win <br><strong data-backOdds='+ obj.backOdds +' class="poss-win"></strong></p>' +
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

        $('body').append(str);
        $('#bets').modal('show');

        $('body').on('click','.bet-able', function(){
            $('input[name="requestAmount"]').val($(this).html());

            $('.poss-win').html($(this).html() * obj.backOdds);
        })

        $('body').on('click', '.bets-submit', function(){
            $.ajax({
                type: 'get',
                url: apiDomain + '/order/homeList?' + new Date().getTime(),
                dataType: "json",
                cache: false,
                data: {},
                success: function (data) {
                    console.log(data);
                    if (data.code == "0") {

                    } else {
                        //简单提示框
                        $.blt(data.msg);
                    }
                }
            })
        })
    },
    /*下注框成功*/
    betsSuccess: function(){
        var str = '<div class="modal fade" id="bets-success" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog bet-slip modal-top">'+
            '<div class="modal-content login-content">'+
            '<div class="modal-header betsSuc-header">'+
            '<h4 class="modal-title"><img src="../public/images/bets-suc.png" class="bet-sucIcon"/>Congratulations</h4>'+
            '</div>'+
            '<div class="modal-body betSuc-body">'+
            '<h5>SV Dellach/Gail or Draw</h5>'+
            '<p>Double Chance <br> SC Landskron v SV Dellach/Gail</p>'+
            '<p class="s-p">Betting <strong>500.00</strong>Total Possible Win <strong class="orange">750.00</strong></p>'+
            '</div>'+
            '<div class="modal-footer betSuc-footer">'+
            '<button type="button" data-dismiss="modal" class="back-btn inline-btn">Back</button>'+
            '<button type="button" class="bets-btn inline-btn">Share</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $('body').append(str);
        $('#bets-success').modal('show');
    },
    /*下注框失败*/
    betsFail: function(){
        var str = '<div class="modal fade" id="bets-fail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog bet-slip modal-top">'+
            '<div class="modal-content login-content">'+
            '<div class="modal-header betsSuc-header">'+
            '<h4 class="modal-title"><img src="../public/images/bets-fail.png" class="bet-sucIcon"/>Oops！</h4>'+
            '</div>'+
            '<div class="modal-body betSuc-body">'+
            '<h5>SV Dellach/Gail or Draw</h5>'+
            '<p>Double Chance <br> SC Landskron v SV Dellach/Gail</p>'+
            '<p class="s-p">Betting <strong>500.00</strong>Total Possible Win <strong class="orange">750.00</strong></p>'+
            '</div>'+
            '<div class="modal-footer betSuc-footer">'+
            '<button type="button" data-dismiss="modal" class="back-btn inline-btn">Back</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $('body').append(str);
        $('#bets-fail').modal('show');
    },
    /* 简单提示框，txt：提示语 */
    blt: function(txt){
        var str = '<div class="modal fade" id="prompt" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                        '<div class="modal-dialog login-box modal-top">'+
                            '<div class="modal-content login-content">'+
                                '<div class="modal-body login-fail">'+
                                    '<h5>'+ txt +'</h5>'+
                                '</div>'+
                                '<div class="modal-footer betSuc-footer">'+
                                    '<button type="button" data-dismiss="modal" class="btn login-btn">OK</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                '</div>';
        $('body').append(str);
        $('#prompt').modal('show');
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
})

/*  下注框显示
    可以下注的td，都有data-bets属性
*/
$('body').on('click','.able',function(){
    //$('#bets').modal('show');
    console.log({
        selectionId: $(this).attr('data-selectionId'),
        v1: $(this).data('v1'),
        v2: $(this).data('v2'),
        v3: $(this).data('v3'),
        eventId: $(this).parent().attr('data-eventId'),
        marketId: $(this).attr('data-marketId'),
        competitionName : $(this).parent().attr('data-competitionName'),
        homeTeamName : $(this).parent().attr('data-homeTeamName'),
        awayTeamName : $(this).parent().attr('data-awayTeamName'),
        placedResult : $(this).attr('data-verifyResult'),
        BackOdds : $(this).html(),
        maxStakeLimit : $(this).attr('data-maxStakeLimit')
    });
    $.bets({
        selectionId: $(this).attr('data-selectionId'),
        v1: $(this).data('v1'),
        v2: $(this).data('v2'),
        v3: $(this).data('v3'),
        eventId: $(this).parent().attr('data-eventId'),
        marketId: $(this).attr('data-marketId'),
        competitionName : $(this).parent().attr('data-competitionName'),
        homeTeamName : $(this).parent().attr('data-homeTeamName'),
        awayTeamName : $(this).parent().attr('data-awayTeamName'),
        placedResult : $(this).attr('data-verifyResult'),
        backOdds : $(this).html(),
        maxStakeLimit : $(this).attr('data-maxStakeLimit')
    });
})

//下注提交
$('body').on('click', '.bets-submit', function(){
    $('#bets').modal('hide');
    // $.betsSuccess();
     $.betsFail();
})
$('body').css('min-height', $(window).height());

