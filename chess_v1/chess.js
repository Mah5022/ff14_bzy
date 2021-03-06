$(function () {
    let init_state = 0;
    let countdown = 23,timer = null;//倒计时
    let start_spot;//安全点 0:南侧C点 1:北侧A点
    let soldier_top,soldier_left,soldier_right,soldier_bottom;//小怪计步
    let soldier1_start = 0,soldier2_start = 0;//小怪起始点 soldier1:0北左南右 1北右南左  soldier2:0东上西下 1东下西上
    let buff_1,buff_2;
    let random_pool = [
        [1,2],[1,3],
        [2,1],[2,2],[2,3],
        [3,1],[3,2],
    ];

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

        chess_start();
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

    //棋盘生成
    function chess_start() {
        //生成buff
        [buff_1,buff_2] = random_pool[Math.floor(Math.random()*random_pool.length)];
        [buff_1,buff_2] = [buff_1+1,buff_2+1];
        $(".buff>i").eq(0).addClass("num"+buff_1);
        $(".buff>i").eq(1).addClass("num"+buff_2);

        start_spot = Math.floor(Math.random()*2);
        $(".center>li[class='3-"+(start_spot?'5':'1')+"']").addClass('start');

        [soldier_top,soldier_bottom] = random_pool[Math.floor(Math.random()*random_pool.length)];
        [soldier_left,soldier_right] = random_pool[Math.floor(Math.random()*random_pool.length)];

        soldier1_start = Math.floor(Math.random()*2);
        $(".top").addClass('soldier-'+(soldier1_start?'right':'left')+' num'+soldier_top);
        $(".bottom").addClass('soldier-'+(soldier1_start?'left':'right')+' num'+soldier_bottom);

        soldier2_start = Math.floor(Math.random()*2);
        $(".left").addClass('soldier-'+(soldier2_start?'top':'bottom')+' num'+soldier_left);
        $(".right").addClass('soldier-'+(soldier2_start?'bottom':'top')+' num'+soldier_right);

        init_state = 1;
    }

    //判断点 左下角[1,1] spot_x:横坐标 spot_y:纵坐标
    function chess_check(spot_x,spot_y){
        if(!init_state)return false;

        let die_row = [
                soldier2_start?(4-soldier_left):(2+soldier_left),
                soldier2_start?(2+soldier_right):(4-soldier_right),
            ],//危险行 y
            die_col = [
                soldier1_start?(4-soldier_top):(2+soldier_top),
                soldier1_start?(2+soldier_bottom):(4-soldier_bottom),
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

    $("ul.center>li").click(function (){
        if($(this).hasClass("start"))return false;
        chess_check(Number($(this).data("x")),Number($(this).data("y")));
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