$(function () {
    let init_state = 0;
    let countdown = 23,timer = null;//倒计时
    let start_spot;//安全点 0:南侧C点 1:北侧A点
    let soldier_top,soldier_left,soldier_right,soldier_bottom;//小怪计步
    let soldier1_start = 0,soldier2_start = 0;//小怪起始点 soldier1:0北左南右 1北右南左  soldier2:0东上西下 1东下西上
    let buff_1,buff_2;

    //初始化
    function init() {
        init_state = 0;
        countdown = 23;
        clearInterval(timer);
        timer = null;

        $(".buff>.countdown").text("");
        $("ul.center>li").removeClass("start die success");
        $(".buff>i").attr("class","");
        $(".soldier").removeClass("soldier-top soldier-bottom soldier-left soldier-right num1 num2 num3");
        $(".popup").show().children(".start").show();

        timer = setInterval(function () {
            $(".buff>.countdown1").text(countdown);
            $(".buff>.countdown2").text(countdown+15);
            countdown--;
            if(countdown<0){
                clearInterval(timer);
                timer = null;
                $(".popup").show().children(".die").show();
            }
        },1000);
        setTimeout(function () {
            $(".popup").hide().children(".start").hide();
            // console.log(timer);
        },1000);
    }

    $("ul.center>li").click(function (){
        if($(this).hasClass("start"))return false;
    })

    //开始
    $(".btn>a.start").click(function () {

    });

    $(".btn>a.help").click(function () {
        $(".popup").show().children(".help").show();
    });

    $(".popup>a.close").click(function () {
        $(".popup").hide().children(".text").hide();
    })

    $(".popup").show().children(".help").show();
})