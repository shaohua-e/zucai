var AllGame = {
    /* 获取标签 */
    getTabList: function(){
        $.ajax({
            type: 'post',
            url: apiDomain + '/customTab/getTabList?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {isEnable:0},
            success: function (data) {
                if (data.code == "0") {
//                  渲染模版
                    var tpl = doT.template($("#tpl-tabList").html());
                    $("#res-tabList").html(tpl(data.results));

                    AllGame.initTab();
                } else {
                    //简单提示框
                    $.blt(data.msg);
                }
            }
        })
    },
    /* tab初始化 */
    initTab: function(){
        /*布局滚动*/
        var w = 0;
        $('.match-menu li').each(function (index, item) {
            w += $(item).outerWidth(true);
        })
        $('#scrollerX').css('width', w + 5);
        var myScrollX = new IScroll('#wrapperX', {
            eventPassthrough: true,
            scrollX: true,
            scrollY: false,
            preventDefault: false
        })

        $('.match-menu').on('click', '[data-tid]', function(){
            var tid = $(this).data('tid');
            $(this).addClass('active').siblings().removeClass('active');
            var tabId = $(this).attr('data-tid');
            var tabType = $(this).attr('data-tabType');

            AllGame.getTabData({tabId: tabId, tabType: tabType});
        })
        $("#res-tabList li").eq(0).addClass('active');

        AllGame.getTabData({tabId: $("#res-tabList li").eq(0).attr('data-tid'), tabType: $("#res-tabList li").eq(0).attr('data-tabType')})
    },
    /*
    * 获取标签下数据
    * */
    getTabData: function(obj){
        $.ajax({
            type: 'get',
            url: apiDomain + '/competition/getTabLists?' + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: obj,
            success: function (data) {
                console.log(data);
                if (data.code == "0") {
//                  渲染模版
                    if(obj.tabType == "0"){
                        var tpl = doT.template($("#tpl-tabData0").html());
                        $("#res-tabData").html(tpl(data.results));
                    }else if(obj.tabType == "1") {
                        var tpl = doT.template($("#tpl-tabData1").html());
                        $("#res-tabData").html(tpl(data.results));
                    }else if(obj.tabType == "2"){
                        var tpl = doT.template($("#tpl-tabData2").html());
                        $("#res-tabData").html(tpl(data.results));
                    }

                } else {
                    //简单提示框
                    $.blt(data.msg);
                }
            }
        })
    }
}

$(document).ready(function() {
    AllGame.getTabList();

    //侧边栏控制
    $('.menu-link').bigSlide();






});
