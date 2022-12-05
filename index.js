// 풀 페이지 스크롤
new fullpage('#full-page', {});

// 그라디언트 배경화면
var colors = new Array(
    [41, 0, 102],
    [0, 102, 0],
    [102, 0, 29],
    [11, 67, 91],
    [102, 0, 102],
    [102, 51, 0]);
  
  var step = 0;
  //color table indices for: 
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0,1,2,3];
  
  //transition speed
  var gradientSpeed = 0.002;
  
  function updateGradient()
  {
    
    if ( $===undefined ) return;
    
  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];
  
  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb("+r1+","+g1+","+b1+")";
  
  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb("+r2+","+g2+","+b2+")";
  
   $('#gradient').css({
     background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
      background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
    
    step += gradientSpeed;
    if ( step >= 1 )
    {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      
      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      
    }
  }
  
  setInterval(updateGradient,10);

// 밤하늘 이펙트
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var MAX_PARTICLES = (WIDTH * HEIGHT) / 20000;
var DRAW_INTERVAL = 60;
var canvas = document.querySelector('.background');
var context = canvas.getContext('2d');
var gradient = null;
var pixies = new Array();

function setDimensions(e) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    MAX_PARTICLES = (WIDTH * HEIGHT) / 20000;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    console.log("Resize to " + WIDTH + "x" + HEIGHT);
}

setDimensions();
window.addEventListener('resize', setDimensions);

function Circle() {
    this.settings = {ttl:8000, xmax:5, ymax:2, rmin:8, rmax:15, drt:1};

    this.reset = function() {
        this.x = WIDTH*Math.random();                                                   //X 위치 랜덤 (0 ~ WIDTH)
        this.y = HEIGHT*Math.random();                                                  //Y 위치 랜덤 (0 ~ HEIGHT)
        this.r = ((this.settings.rmax-1)*Math.random()) + 1;                            //반지름 크기 랜덤 (1 ~ rmax)
        this.dx = (Math.random()*this.settings.xmax) * (Math.random() < .5 ? -1 : 1);   //X 이동거리 랜덤 (-xmax ~ xmax)
        this.dy = (Math.random()*this.settings.ymax) * (Math.random() < .5 ? -1 : 1);   //Y 이동거리 랜덤 (-ymax ~ ymax)
        this.hl = (this.settings.ttl/DRAW_INTERVAL)*(this.r/this.settings.rmax);        //총 생존 시간 (반지름 크기에 비례)
        this.rt = 0;                                                                    //현재 생존 시간 (0 -> hl -> 0)
        this.settings.drt = Math.random()+1;                                             //노화 속도 (1 ~ 2)
        this.stop = Math.random()*.2+.4;                                                //음영 범위 (0.4 ~ 0.6)
    }

    this.fade = function() {
        this.rt += this.settings.drt;    //노화 진행

        if(this.rt >= this.hl) {
            this.rt = this.hl;
            this.settings.drt = this.settings.drt*-1;
        } else if(this.rt < 0) {
            this.reset();               //수명이 다하면 새로운 위치에 생성
        }
    }

    this.draw = function() {
        var newo = (this.rt/this.hl); //밝기 (0 ~ 1) 
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);  //(x, y) 좌표에 반지름 r 크기의 원 그림
        context.closePath();

        var cr = this.r*newo; //밝기에 따른 반지름
        gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr < this.settings.rmin) ? this.settings.rmin : cr); 
        gradient.addColorStop(0.0, 'rgba(255,255,255,'+newo+')');
        gradient.addColorStop(this.stop, 'rgba(77,101,181,'+(newo*.6)+')');
        gradient.addColorStop(1.0, 'rgba(77,101,181,0)');
        context.fillStyle = gradient;
        context.fill();
    }

    this.move = function() {
        this.x += (1 - this.rt/this.hl)*this.dx;
        this.y += (1 - this.rt/this.hl)*this.dy;
        if(this.x > WIDTH || this.x < 0) this.dx *= -1;
        if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }
}

function draw() {
    
    context.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i=pixies.length; i<MAX_PARTICLES; i++) {
        pixies.push(new Circle());
        pixies[i].reset();
    }

    for(var i = 0; i < MAX_PARTICLES; i++) {
        pixies[i].fade();
        pixies[i].move();
        pixies[i].draw();
    }
}

setInterval(draw, DRAW_INTERVAL);

// 슬릭 슬라이드
$(function(){
    $(".s2").slick();
    $(".s3").slick();
});

// 이메일 전송
document.querySelector('#form-send').addEventListener('submit', function(event) {
    event.preventDefault(); // submit이벤트 막기
    const fromName = document.querySelector('input[name="from_name"]').value; // 전송자 이름 추출

    emailjs.init("wuAUq3sAgA6OjO4P5"); // API keys
    emailjs.sendForm('seol2724', 'seol2724', this)
        .then(function() {
            alert(`${fromName}님, 메일 전송 완료 되었습니다 :)`)
        }, function(error) {
            alert(`${fromName}님, 메일 전송이 실패 되었습니다 :(`)
            console.log('전송실패', error);
        });
});