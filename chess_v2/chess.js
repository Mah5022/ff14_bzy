$(function () {
    let init_state = 0;
    let start_spot;//安全点 0:南侧C点 1:北侧A点
    let first_spot = [],second_spot = [];
    let soldier_top = ['',0],soldier_bottom = ['',0],
        soldier_left = ['',0],soldier_right = ['',0];//小怪计步 [初始位置，步数]
    let buff_1,buff_2;
    let random_pool = [
        [1,2],[1,3],
        [2,1],[2,2],[2,3],
        [3,1],[3,2],
    ];

    //初始化
    function init() {
        first_spot = [],second_spot = [];

        $("ul.center>li").removeClass("start die success first second").text("");
        $(".buff>i").attr("class","");
        $(".soldier").removeClass("soldier-top soldier-bottom soldier-left soldier-right num1 num2 num3");
        $(".soldier>p").attr("style","");
        $(".popup").show().children(".start").show();

        chess_start();
        init_state = 1;

        setTimeout(function () {
            $(".popup").hide().children(".start").hide();
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
        $(".center>li[class*='3-"+(start_spot?'5':'1')+"']").addClass('start');

        [soldier_top[1],soldier_bottom[1]] = random_pool[Math.floor(Math.random()*random_pool.length)];
        [soldier_left[1],soldier_right[1]] = random_pool[Math.floor(Math.random()*random_pool.length)];

        soldier_top[0] = Math.floor(Math.random()*2)?'left':'right';
        soldier_bottom[0] = soldier_top[0]=='left'?'right':'left';
        $(".top").addClass('soldier-'+soldier_top[0]+' num'+soldier_top[1]);
        $(".bottom").addClass('soldier-'+soldier_bottom[0]+' num'+soldier_bottom[1]);

        soldier_left[0] = Math.floor(Math.random()*2)?'top':'bottom';
        soldier_right[0] = soldier_left[0]=='top'?'bottom':'top';
        $(".left").addClass('soldier-'+soldier_left[0]+' num'+soldier_left[1]);
        $(".right").addClass('soldier-'+soldier_right[0]+' num'+soldier_right[1]);
    }

    // 左下角[1,1] spot_x:横坐标 spot_y:纵坐标
    function chess_click(spot_x,spot_y){
        if(!init_state)return false;

        if(init_state == 1){
            //确定起始位置
            init_state = 0;
            first_spot = [spot_x,spot_y];
            $("li[class*='"+spot_x+"-"+spot_y+"']").addClass("first");
            chess_check_1();
            return false;
        }
        if(init_state == 2){
            //第一次移动(第二轮起始点)
            init_state = 0;
            second_spot = [spot_x,spot_y];
            $("li[class*='"+spot_x+"-"+spot_y+"']").addClass("second");
            chess_check_2();
            return false;
        }
        if(init_state == 3 && $("li[class*='"+spot_x+"-"+spot_y+"']").hasClass("start")){
            init_state = 0;
            chess_check_3();
        }
    }

    function chess_check_1(){
        //危险行
        let danger_row_1 = soldier_left[0]=='top'?(4-soldier_left[1]):(2+soldier_left[1]),
            danger_row_2 = soldier_right[0]=='top'?(4-soldier_right[1]):(2+soldier_right[1]);

        run_animation(1,function () {
            if(danger_row_1==first_spot[1]||danger_row_2==first_spot[1]){
                //死了
                $("li[class*='"+first_spot[0]+"-"+first_spot[1]+"']").removeClass("first").addClass("die");
                $(".popup").show().children(".die2").show();
            }else{
                init_state = 2;
            }
        });
    }

    function chess_check_2(){
        //危险列
        let danger_col_1 = soldier_top[0]=='left'?(2+soldier_top[1]):(4-soldier_top[1]),
            danger_col_2 = soldier_bottom[0]=='left'?(2+soldier_bottom[1]):(4-soldier_bottom[1]);
        //点距离
        let distance = Math.abs(first_spot[0]-second_spot[0])+Math.abs(first_spot[1]-second_spot[1]);

        if(distance!=buff_1){
            //死了
            $("li[class*='"+second_spot[0]+"-"+second_spot[1]+"']").removeClass("second").addClass("die");
            $(".popup").show().children(".die1").show();
        }else{
            run_animation(2,function () {
                if(danger_col_1==second_spot[0]||danger_col_2==second_spot[0]){
                    //死了
                    $("li[class*='"+second_spot[0]+"-"+second_spot[1]+"']").removeClass("second").addClass("die");
                    $(".popup").show().children(".die2").show();
                }else{
                    init_state = 3;
                }
            })
        }
    }

    function chess_check_3() {
        let distance = Math.abs(second_spot[0]-3)+Math.abs(second_spot[1]-(start_spot?5:1));
        if(distance!=buff_2){
            //死了
            $(".popup").show().children(".die1").show();
        }else{
            //活了
            $("li[class*='3-"+(start_spot?5:1)+"']").removeClass("first").addClass("success");
            $(".popup").show().children(".success").show();
        }
    }

    function run_animation(type,fn=function () {}){
        let run_time = 600;
        let cell_length =  $("ul.center").width()/5;

        $(".animation").show();
        if(type==1){

            let left_pos = $(".soldier.left>p").position().top,
                right_pos = $(".soldier.right>p").position().top;

            $(".soldier.left>p").animate({
                top:soldier_left[0]=='top'?(left_pos+cell_length*soldier_left[1]):(left_pos-cell_length*soldier_left[1])
            },run_time+100,"linear");
            $(".animation>.sword-qi.sq1").css("top",soldier_left[0]=='top'?(cell_length*(1+soldier_left[1])):(cell_length*(3-soldier_left[1])));
            $(".soldier.right>p").animate({
                top:soldier_right[0]=='top'?(right_pos+cell_length*soldier_right[1]):(right_pos-cell_length*soldier_right[1])
            },run_time+100,"linear");
            $(".animation>.sword-qi.sq2").css("top",soldier_right[0]=='top'?(cell_length*(1+soldier_right[1])):(cell_length*(3-soldier_right[1])));

            let left_timer = setInterval(function () {
                $(".soldier.left").removeClass("num"+soldier_left[1]).addClass("num"+(soldier_left[1]-1));
                soldier_left[1]--;
                if(soldier_left[1]==0)clearInterval(left_timer);
            },run_time/soldier_left[1]);
            let right_timer = setInterval(function () {
                $(".soldier.right").removeClass("num"+soldier_right[1]).addClass("num"+(soldier_right[1]-1));
                soldier_right[1]--;
                if(soldier_right[1]==0)clearInterval(right_timer);
            },run_time/soldier_right[1]);

            setTimeout(function () {
                $(".animation>.sword-qi.sq1,.animation>.sword-qi.sq2").animate({
                    width:cell_length*5
                },120,"linear",function () {
                    setTimeout(function () {
                        $(".animation").hide();
                        $(".animation>.sword-qi.sq1,.animation>.sword-qi.sq2").attr("style","");
                        fn();
                    },200);
                });
            },run_time+200);

            return false;
        }
        if(type==2){
            let top_pos = $(".soldier.top>p").position().left,
                bottom_pos = $(".soldier.bottom>p").position().left;

            $(".soldier.top>p").animate({
                left:soldier_top[0]=='left'?(top_pos+cell_length*soldier_top[1]):(top_pos-cell_length*soldier_top[1])
            },run_time+100,"linear");
            $(".animation>.sword-qi.sq3").css("left",soldier_top[0]=='left'?(cell_length*(1+soldier_top[1])):(cell_length*(3-soldier_top[1])));
            $(".soldier.bottom>p").animate({
                left:soldier_bottom[0]=='left'?(bottom_pos+cell_length*soldier_bottom[1]):(bottom_pos-cell_length*soldier_bottom[1])
            },run_time+100,"linear");
            $(".animation>.sword-qi.sq4").css("left",soldier_bottom[0]=='left'?(cell_length*(1+soldier_bottom[1])):(cell_length*(3-soldier_bottom[1])));

            let top_timer = setInterval(function () {
                $(".soldier.top").removeClass("num"+soldier_top[1]).addClass("num"+(soldier_top[1]-1));
                soldier_top[1]--;
                if(soldier_top[1]==0)clearInterval(top_timer);
            },run_time/soldier_top[1]);
            let bottom_timer = setInterval(function () {
                $(".soldier.bottom").removeClass("num"+soldier_bottom[1]).addClass("num"+(soldier_bottom[1]-1));
                soldier_bottom[1]--;
                if(soldier_bottom[1]==0)clearInterval(bottom_timer);
            },run_time/soldier_bottom[1]);

            setTimeout(function () {
                $(".animation>.sword-qi.sq3,.animation>.sword-qi.sq4").animate({
                    height:cell_length*5
                },120,"linear",function () {
                    setTimeout(function () {
                        $(".animation").hide();
                        $(".animation>.sword-qi.sq3,.animation>.sword-qi.sq4").attr("style","");
                        fn();
                    },200);
                });
            },run_time+200);

            return false;
        }
    }

    $("ul.center>li").click(function (){
        // if($(this).hasClass("start"))return false;
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