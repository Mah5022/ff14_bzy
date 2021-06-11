$(function () {
    let init_state = 0;
    let countdown = 23,timer = null;//倒计时
    let start_spot;//安全点 0:南侧C点 1:北侧A点
    let first_spot = [],second_spot = [];
    let soldier_top = [0,0],soldier_bottom = [0,0],
        soldier_left = [0,0],soldier_right = [0,0];//小怪计步 [方向，步数] 南北0左1右 东西0下1上
    let buff_1,buff_2;
    let random_pool = [
        [1,2],[1,3],
        [2,1],[2,2],[2,3],
        [3,1],[3,2],
    ];

    //初始化
    function init() {
        countdown = 23;
        clearInterval(timer);
        timer = null;
        first_spot = [],second_spot = [];

        $(".buff>.countdown").text("");
        $("ul.center>li").removeClass("start die success");
        $(".buff>i").attr("class","");
        $(".soldier").removeClass("soldier-top soldier-bottom soldier-left soldier-right num1 num2 num3");
        $(".popup").show().children(".start").show();

        chess_start();
        init_state = 1;
        // timer = setInterval(function () {
        //     $(".buff>.countdown1").text(countdown);
        //     $(".buff>.countdown2").text(countdown+15);
        //     countdown--;
        //     if(countdown<0){
        //         clearInterval(timer);
        //         timer = null;
        //         $(".popup").show().children(".die").show();
        //     }
        // },1000);
        setTimeout(function () {
            $(".popup").hide().children(".start").hide();
            // console.log(timer);
        },1000);
    }

    //棋盘生成
    function chess_start() {
        //生成buff
        [buff_1,buff_2] = random_pool[Math.floor(Math.random()*random_pool.length)];
        [buff_1,buff_2] = [buff_1+1,buff_2+1];
        $(".buff>i").eq(0).addClass("num"+buff_1);
        $(".buff>i").eq(1).addClass("num"+buff_2);

        start_spot = Math.floor(Math.random()*2);
        $(".center>li[class='3-"+(start_spot?'5':'1')+"']").addClass('start');

        [soldier_top[1],soldier_bottom[1]] = random_pool[Math.floor(Math.random()*random_pool.length)];
        [soldier_left[1],soldier_right[1]] = random_pool[Math.floor(Math.random()*random_pool.length)];

        soldier_top[0] = Math.floor(Math.random()*2);
        soldier_bottom[0] = 1 - soldier_top[0];
        $(".top").addClass('soldier-'+(soldier_top[0]?'right':'left')+' num'+soldier_top[1]);
        $(".bottom").addClass('soldier-'+(soldier_bottom[0]?'right':'left')+' num'+soldier_bottom[1]);

        soldier_left[0] = Math.floor(Math.random()*2);
        soldier_right[0] = 1 - soldier_left[0];
        $(".left").addClass('soldier-'+(soldier_left[0]?'top':'bottom')+' num'+soldier_left[1]);
        $(".right").addClass('soldier-'+(soldier_right[0]?'top':'bottom')+' num'+soldier_right[1]);
    }

    //判断点 左下角[1,1] spot_x:横坐标 spot_y:纵坐标
    function chess_click(spot_x,spot_y){
        if(!init_state)return false;

        if(init_state == 1){
            //确定起始位置
            $("ul.center li").removeClass("first").text("");
            $("li[class='"+spot_x+"-"+spot_y+"']").addClass("first").text(buff_1);
            first_spot = [spot_x,spot_y];
            init_state = 2;
            chess_check_1();
        }else if(init_state == 2 && !$("li[class*='"+spot_x+"-"+spot_y+"']").hasClass("first")){
            //第一次移动(第二轮起始点)
            let distance = Math.abs(first_spot[0]-spot_x)+Math.abs(first_spot[1]-spot_y);
            $("ul.center li").removeClass("second").text("");
            $("li[class='"+spot_x+"-"+spot_y+"']").addClass("second").text((buff_1-distance)<0?"×":(buff_1-distance));
            second_spot = [spot_x,spot_y];
        }

        return false;
        let die_row = [
                // soldier2_start?(4-soldier_left):(2+soldier_left),
                // soldier2_start?(2+soldier_right):(4-soldier_right),
            ],//危险行 y
            die_col = [
                // soldier1_start?(4-soldier_top):(2+soldier_top),
                // soldier1_start?(2+soldier_bottom):(4-soldier_bottom),
            ];//危险列 x

        //东西侧小怪判定
        if(die_row.indexOf(spot_y)>=0){
            //死了
            if(timer){
                clearInterval(timer);
                timer = null;
                $(".popup").show().children(".die").show();
            }
            $("li[class='"+spot_x+"-"+spot_y+"']").addClass("die");
            return false;
        }

        // console.log("点击:["+spot_x+","+spot_y+"]");
        for(let move_x=-buff_1;move_x<=buff_1;move_x++){
            //第一次计步后x坐标
            let first_x = spot_x+move_x;
            if(first_x<1)continue;
            if(first_x>5)continue;
            if(die_col.indexOf(first_x)>=0)continue;

            //第一次计步后y坐标
            let first_y = spot_y-(buff_1-Math.abs(move_x));
            if(first_y>=1&&first_y<=5){
                if(Math.abs(first_x-3)+Math.abs(first_y-(start_spot?5:1))==buff_2){
                    //活了
                    if(timer){
                        clearInterval(timer);
                        timer = null;
                        $(".popup").show().children(".success").show();
                    }
                    $("li[class='"+spot_x+"-"+spot_y+"']").addClass("success");
                    return false;
                }
            }

            first_y = spot_y+(buff_1-Math.abs(move_x));
            if(first_y>=1&&first_y<=5){
                if(Math.abs(first_x-3)+Math.abs(first_y-(start_spot?5:1))==buff_2){
                    //活了
                    if(timer){
                        clearInterval(timer);
                        timer = null;
                        $(".popup").show().children(".success").show();
                    }
                    $("li[class='"+spot_x+"-"+spot_y+"']").addClass("success");
                    return false;
                }
            }
        }

        //死了
        if(timer){
            clearInterval(timer);
            timer = null;
            $(".popup").show().children(".die").show();
        }
        $("li[class='"+spot_x+"-"+spot_y+"']").addClass("die");
        return false;
    }

    function chess_check_1(){
        let
        if(first_spot[1]==(soldier_left[0]?(4-soldier_left[1]):(1+soldier_left[1]))){
            console.log("error");
        }
    }

    $("ul.center>li").click(function (){
        if($(this).hasClass("start"))return false;
        chess_click(Number($(this).data("x")),Number($(this).data("y")));
    })

    //开始
    $(".btn>a.start").click(function () {init();});

    $(".btn>a.help").click(function () {
        $(".popup").show().children(".help").show();
    });

    $(".popup>a.close").click(function () {
        $(".popup").hide().children(".text").hide();
    })

    $(".popup").show().children(".help").show();
})