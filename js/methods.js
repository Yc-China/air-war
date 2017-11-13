function Games(){};
Games.prototype.feijidazhan=function(){
    var startButton = document.getElementById('start_button');
  	var startPage = document.getElementById('start_page');
  	var newstart = document.getElementById('newstart');
  	var game_page = document.getElementById('game_page');
  	var grades = document.getElementById('grades');
  	var plane_container = document.getElementById('plane_container');
  	var over = document.getElementsByClassName('box-over')[0];
  	var img=document.querySelector("ul");
  	img.style.top=-innerHeight+"px";
  	var bulletSpeed = 5;
  	var BULLETS = [];
  	var ENEMIES = [];
  	var hero=null;
  	//状态对象
  	var status={
  		nobegin:0,
  		begin:1,
  		playing:2,
  		gameover:3
  	};
  	//当前分数
  	var grade=0;
  	//动画执行器
  	var fireEnemy,fireTimer,updateTimer;
  	//敌机种类
 	var tie=["img/enemy1.png","img/enemy2.png","img/enemy3.png","img/enemy4.png"]
  	/*  点击开始游戏 */
  	startButton.onclick = function(){
  		//进入游戏开始状态
    	setstatus(status.begin)
  	}
  	newstart.onclick = function(){
  		//重新开始
  		grade=0;
    	BULLETS = [];
    	ENEMIES = [];
  		plane_container.innerHTML="";
  		over.style.display="none";
    	setstatus(status.begin);
  	}
	//创建管理器
	function setstatus(e){
		switch(e){
			case '0':
				break;
			case 1:
				startPage.style.display = 'none';
		   	 	grades.innerText=grade;
		    	/*  创建 hero 飞机*/
				hero = new Plane('img/hero.png',100,100,300,400);
				plane_container.appendChild(hero.imgNode);
			    /*件监听鼠标滑动事件，使hero跟随鼠标移动*/
				setmove(1);
				//创建子弹
				setbullet();
				//创建敌机
				setenemy();
				//创建视图
				setview();
				break;
			case '2':
				break;
			case 3:
			    setmove(3)
			    clearInterval(fireEnemy);
				clearInterval(fireTimer);
				clearInterval(updateTimer);
				break;
			default:console.log("??????")
				break;
		}
	}
	//创建移动
	function move(e){
		var x = e.clientX;
		var y = e.clientY;
		hero.move(x,y)
	}
	//创建移动监听
	function setmove(a){
		if(a==1){
			window.addEventListener('mousemove',move,false)
		}else{
			window.removeEventListener("mousemove",move,false)
		}
	}
	//生成敌机
	function setenemy(){
		fireEnemy = setInterval(function(){
			var x = Math.random()*(innerWidth-100);
			var y =parseInt(Math.random()*4);
			var enemy = new Enemy(tie[y],100,100,x,0,y+1)
			ENEMIES.push(enemy);
			plane_container.appendChild(enemy.imgNode)
		},1000)
	}
	//生成子弹
	function setbullet(){
		fireTimer = setInterval(function(){
		    var bullet = new Bullet('img/bullet1.png',10,12,hero.x + 10,hero.y-10);
			plane_container.appendChild(bullet.imgNode)
			BULLETS.push(bullet); 
	    },150)
	}
	//创建视图刷新
	function setview(){
		updateTimer = setInterval(function(){
			//背景图滚动
			img.style.top=img.offsetTop+5+"px";
			if(img.offsetTop>=0){
				img.style.top=-innerHeight+"px"
			}
			
			for(var i = 0;i < BULLETS.length;i++){
			    var b = BULLETS[i];
			    b.move(bulletSpeed);
			    if(b.y < 0){
			        BULLETS.splice(i,1)
			        plane_container.removeChild(b.imgNode)
			    }
			};
			for (var i = 0; i < ENEMIES.length; i++) {
			    var e = ENEMIES[i];
			    e.move(15);
			    if(e.y > 768){
			        ENEMIES.splice(i,1);
			        plane_container.removeChild(e.imgNode)
			    }
			};
			for(var j = 0;j < BULLETS.length;j++){
			    var bbb = BULLETS[j];
				for(var i = 0; i < ENEMIES.length; i++){
					var eee = ENEMIES[i];
					if(bbb.y + bbb.h > eee.y && bbb.y < eee.y +eee.h && bbb.x + bbb.w > eee.x && bbb.x < eee.x + eee.w){
				        eee.life--;
				        if(eee.life<=0){
				        	grade+=eee.gr;
				            grades.innerText=grade;
				            eee.clear();
				            ENEMIES.splice(i,1);
				        }
				        plane_container.removeChild(bbb.imgNode);
				        
				        BULLETS.splice(j,1);
					}
				    if(hero.y+hero.h>eee.y&&hero.y<eee.y+eee.h&&hero.x+hero.w > eee.x && hero.x < eee.x + eee.w){
				        over.style.display="block";
				        //进入游戏结束状态
				        setstatus(status.gameover)
				        break;
					}
				}    
		    };
		},40)
	}
	//创建一个物体
	function Sprite(src,w, h, x, y) {
		this.src = src;
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		//创建一个img节点，之后把此节点添加到容器中。
		this.imgNode = document.createElement('img')
		this.imgNode.src = this.src;
		this.imgNode.style.position = 'absolute';
		this.imgNode.style.width = this.w + 'px';
		this.imgNode.style.height = this.h + 'px';
		this.imgNode.style.left = this.x + 'px';
		this.imgNode.style.top = this.y + 'px';
	}
	//创建飞机
	function Plane(src,w,h,x,y){
	    Sprite.call(this,src,w,h,x,y)
	}
	//
	Plane.prototype.move = function(x,y){
	  this.imgNode.style.left = x - 50 + 'px';
	  this.imgNode.style.top = y - 40 + 'px';
	  this.x = this.imgNode.offsetLeft;
	  this.y = this.imgNode.offsetTop;
	}
	//创建子弹
	function Bullet(src,w,h,x,y){
	    Sprite.call(this,src,w,h,x,y)
	}
	//子弹移动
	Bullet.prototype.move = function(speed){
	  this.imgNode.style.top = this.imgNode.offsetTop - speed + 'px'
	  this.y = this.imgNode.offsetTop;
	}
	//清除子弹
	Bullet.prototype.clear = function(){
	  
	}
	//创建敌机
	function Enemy(src,w,h,x,y,z){
	    Sprite.call(this,src,w,h,x,y)
	    this.life=z;
	    this.gr=z*10;
	}
	//敌机移动
	Enemy.prototype.move = function(speed){
	  this.imgNode.style.top = this.imgNode.offsetTop + speed + 'px'
	  this.y = this.imgNode.offsetTop;
	}
	//清除敌机
	Enemy.prototype.clear = function(){
	    this.imgNode.src="img/wsparticle_07.png";
	    (function(e){
			setTimeout(function(){
				var a=document.getElementById("plane_container");
				a.removeChild(e)
			},150)
		})(this.imgNode)
	}
}
