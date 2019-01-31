layui.use(['jquery', 'element', 'layer', 'code', 'form', 'util', 'layedit', 'carousel'], function () {
    layui.util.fixbar();
    var $ = layui.jquery
        ,element = layui.element
        ,layer = layui.layer
        ,layedit = layui.layedit
        ,form = layui.form
        ,carousel = layui.carousel;
    // 分页跳转
    form.on('select(page)', function(data){window.location.href=data.value});
    // 代码样式
    layui.code({elem: 'pre'});
    // 表格样式
    $(".blog-content table").addClass("layui-table");

    $('.leftIn').click(function(){leftIn()});
    $('.leftOut').click(function(){leftOut()});

    //显示侧边导航
    function leftIn() {
        $('.blog-nav-left').animate({width: "100%"});
        $('.leftOut').parent().css('display', 'block');
        $('.leftIn').parent().css('display', 'none');
    }

    //隐藏侧边导航
    function leftOut() {
        $('.blog-nav-left').animate({width: "0"});
        $('.leftIn').parent().css('display', 'block');
        $('.leftOut').parent().css('display', 'none');
    }

    // 捐献部分
    // layer.tab({
    //     area: ['322px', '400px'],
    //     tab: [{
    //         title: '支付宝',
    //         content: '<img src="http://www.qinshoushou.com/usr/themes/monster/images/reward-weixin.jpg" width="200">'
    //     }, {
    //         title: '微信',
    //         content: '内容2'
    //     }, {
    //         title: 'QQ',
    //         content: '内容3'
    //     }]
    // });

    var edit = layedit.build('content', {
        height: 320,
        tool: [],
    });
    //自定义验证规则
    form.verify({
        content: function (value) {
            layedit.sync(edit);
            value = $.trim(layedit.getContent(edit));
            if (value.length <= 0) {
                return "至少得有一个字吧"
            }
        }
    });
    //监听提交
    form.on('submit(submit)', function (data) {
        // 次数超限提示
        var count = sessionStorage.count;
        if (typeof(count) == "undefined") sessionStorage.count = 1;
        else if (count < 3) sessionStorage.count = count * 1 + 1;
        else {
            layer.open({
                title: '次数提示'
                , content: '已经发送了3次邮件,一直发邮件很不好的,以后再发吧!'
            });
            return false;
        }
        layedit.sync(edit);
        var load = layer.load(2, {shade: [0.1,'#fff']});
        $.post(data.form.action, {
            sub: "主页-联系我功能",
            content: "IP:" + returnCitySN["cip"] + "\n地区:" + returnCitySN["cname"] + "\n内容:" + data.field.content
        }, function (res, textStatus, jqXHR) {
            layer.close(load);
            if (res.code == 200) layer.msg(res.msg);
            else layer.msg(res.msg, {icon: 5});
        }, "json");

        return false;
    });
    carousel.render({
        elem: '#test1'
        ,width: '100%' //容器宽度
        ,height: '420px' //容器高度
        ,arrow: 'hover' //始终显示箭头
        ,anim: 'fade' //切换动画方式
        ,indicator: 'inside' //指示器位置
        ,interval: 2000 //自动切换的时间间隔
    });

    $(".blog-tags a").click(function(){$(window.location.hash).next().addClass("layui-show")})
    if(""!=window.location.hash)$(window.location.hash).next().addClass("layui-show")
});
var _hmt = _hmt || [];(function() { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?ad8ed62a484da49dcb7b8cd1ced18c1f"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);var bp = document.createElement('script');var curProtocol = window.location.protocol.split(':')[0];if (curProtocol === 'https')bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';else bp.src = 'http://push.zhanzhang.baidu.com/push.js';var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(bp, s);})();
(function(T,h,i,n,k,P,a,g,e){g=function(){P=h.createElement(i);a=h.getElementsByTagName(i)[0];P.src=k;P.charset="utf-8";P.async=1;a.parentNode.insertBefore(P,a)};T["ThinkPageWeatherWidgetObject"]=n;T[n]||(T[n]=function(){(T[n].q=T[n].q||[]).push(arguments)});T[n].l=+new Date();if(T.attachEvent){T.attachEvent("onload",g)}else{T.addEventListener("load",g,false)}}(window,document,"script","tpwidget","//widget.seniverse.com/widget/chameleon.js"))
tpwidget("init", {"flavor": "bubble","location": "WX4FBXXFKE4F","geolocation": "enabled","position": "bottom-left","margin": "10px 10px","language": "zh-chs","unit": "c","theme": "chameleon","uid": "U6B158D118","hash": "c225347d3d839feb28eabf4c985e2004"});
tpwidget("show");
