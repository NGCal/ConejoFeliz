var INITIALIZED = false;
var HelloWorldLayer = cc.Layer.extend({
    sprFondo:null,
    sprConejo:null,
    zanahorias: [],
    bombas: [],
    puntuacion: 0,
    noVidas: 5,
    vidas: [],
    lPuntuacion: new cc.LabelTTF("0","Arial"),
    size:null,
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + max-min;
	},
   
    movimientoP:function(location, event){
        var juego = event.getCurrentTarget();
        var pos = location.getLocation();
        var xAct = juego.sprConejo.getPositionX();
        
        
      if(xAct < 598 && xAct <= pos.x){
          
        juego.sprConejo.setPositionX(xAct + 45);
          
          //juego.sprConejo.setPositionX(pos.x);
      }
        else if(250 < xAct && pos.x <= xAct){
        juego.sprConejo.setPositionX(xAct - 45);
       
          //juego.sprConejo.setPositionX(pos.x);
        }
        else
        juego.sprConejo.setTexture(res.conejo_png)
            /* cc.log("Pos. Conejo: "+juego.sprConejo.getPositionX());*/
        //cc.log("Pos. act: "+pos.x);
    },
    movimientoT:function(key,event){
        var juego = event.getCurrentTarget();
        var xAct = juego.sprConejo.getPositionX();
     
        switch(key){
            case cc.KEY.left:
                cc.log("left");
                if(xAct > 250){
                juego.sprConejo.setPositionX(xAct - 45); }
                break;   
            case cc.KEY.right :
                if(xAct < 598){
                juego.sprConejo.setPositionX(xAct + 45); }
                break;  
        }
        
    },
     colision:function(objecto){
         //cc.log("Gordito:"+objecto.getPositionX());
         var cuadro = this.sprConejo.getBoundingBox();
         var cuadro2= objecto.getBoundingBox();
        if (cuadro2.x < cuadro.x + cuadro.width  && cuadro2.x + cuadro2.width > cuadro.x &&
        cuadro2.y < cuadro.y + cuadro.height && cuadro2.y + cuadro2.height > cuadro.y)
		{
			cc.log("Funciona manito");
			return true;
		}
	return false;	   
    },
    creaBomba: function(){
        var bomba = new cc.Sprite(res.bomba_png);
        var anchoFondo = this.sprFondo._getWidth();
        var altoFondo = this.sprFondo._getHeight();
       
        
        bomba.setScale(0.4,0.4); bomba.setPosition(this.random((anchoFondo/2)+50,anchoFondo+100), this.sprFondo._getHeight());
        this.addChild(bomba, 1);
        
        var moveto = cc.moveTo(5, bomba.getPositionX(),-this.size.height);
		bomba.runAction(moveto);
		this.bombas.push(bomba);	
    },
     creaZan: function(){
        var zan = new cc.Sprite(res.zanahoria_png);
        var anchoFondo = this.sprFondo._getWidth();
        var altoFondo = this.sprFondo._getHeight();
       
        
        zan.setScale(0.4,0.4);
         zan.setPosition(this.random((anchoFondo/2)+50,(anchoFondo)+150), this.sprFondo._getHeight());
        this.addChild(zan, 1);
         this.zanahorias.push(zan);	
        
        var moveto = cc.moveTo(3, zan.getPositionX(),-this.size.height);
		zan.runAction(moveto);
         //this.colision(zan);
		
    },
    chequear: function(){
        for(var i =0; i < this.zanahorias.length;i++)
        {
            if(this.colision(this.zanahorias[i])) {
               this.removeChild(this.zanahorias[i]);
                this.zanahorias.splice(i,1);
                this.puntuacion += 1;
                //cc.log("Puntos: "+this.puntuacion);
               this.actPuntuacion(this.puntuacion);
            }
                
               
               };
            
        for(var i =0; i < this.bombas.length;i++)
        {
            if(this.colision(this.bombas[i])) {
               
                if(this.noVidas > 0){
                    this.removeChild(this.bombas[i]);
                    this.bombas.splice(i,1);
                    this.vidas[this.noVidas - 1].setVisible(false);
                    this.noVidas -= 1; 
                }
                        
                if(this.noVidas === 0)
                    {
                        var sceneo = new gameOverScene();
                        cc.director.pushScene(new cc.TransitionFade(3.0,sceneo));  }
               
               };
              
            }
    },
    actPuntuacion: function(puntuacion){
        this.lPuntuacion.setString(puntuacion.toString());
        
         this.lPuntuacion.setFontSize(35);

        this.lPuntuacion.setPosition(cc.p((this.size.width / 2)+215,(this.size.height /2)+280));
        this.lPuntuacion.setColor(cc.color(255,0,0));
        
        
    },
    dibujarVidas: function(){
        for(var i =0; i < this.noVidas; i++){
          var vida = new cc.Sprite(res.conejo_png);
        var anchoFondo = this.sprFondo._getWidth();
        var altoFondo = this.sprFondo._getHeight();
       
        vida.setScale(0.25,0.25);
         vida.setPosition(265, ((this.size.height /2)+280)-(50*i));
        this.addChild(vida, 2);
         this.vidas.push(vida);	}
        
    },
    
    ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;
        this.size = size;
        cc.log("Win size: "+ size.width);

        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setScale(0.45,0.45);
        this.sprConejo.setPosition((size.width / 2)-74,size.height*0.03);
        this.sprConejo.setAnchorPoint(0,0);
        this.addChild(this.sprConejo, 1);
        //Calendarios
        this.schedule(this.creaBomba,1);
        this.schedule(this.creaZan,2);
        this.schedule(this.chequear,0.1);
        this.dibujarVidas();
        
        //Etiquetas
        this.addChild(this.lPuntuacion,3);
        
        //Eventos
            //Pantalla touch
      	cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
                event.getCurrentTarget()
                return true;
            },
			onTouchMoved: this.movimientoP
			
		}, this);
        
        cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.movimientoT
			
		}, this);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
        
    }
});

/*====================GAME OVER========================*/
   var gOver= cc.Layer.extend({
            menu:function(){
                cc.log("Inside");
                var boton = new cc.MenuItemImage(res.reset,res.start,reiniciar());
                var menu = new cc.Menu(boton);
                menu.alignItemsVertically();
                this.addChild(menu);
            },
            
             ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;
        this.size = size;
        cc.log("Win size: "+ size.width);

        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.sprFondo, 0);
        var boton = new cc.MenuItemImage(res.reset,res.start,reiniciar());
                var menu = new cc.Menu(boton);
                menu.alignItemsVertically();
                this.addChild(menu);
        
        return true;
    }
            
        });

var reiniciar = function(){
                cc.log("HHHH");
                      var sceneo = new HelloWorldScene();
                        cc.director.pushScene(new cc.TransitionFade(3.0,sceneo));
                    
                };


var gameOverScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        if (INITIALIZED === false)
        {
        	INITIALIZED = true;

        	var layer = new gOver();
        	this.addChild(layer);
        }
    }
});
