
var HelloWorldLayer = cc.Layer.extend({
    sprFondo:null,
    sprConejo:null,
    zanahorias: [],
    bombas: [],
    flag: null,
    
    size:null,
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + max-min;
	},
   
    movimientoP:function(location, event){
        var juego = event.getCurrentTarget();
        var pos = location.getLocation();
        var xAct = juego.sprConejo.getPositionX();
        
        
      if(xAct < 586 && xAct <= pos.x){
          
        juego.sprConejo.setPositionX(xAct + 15);
          
          //juego.sprConejo.setPositionX(pos.x);
      }
        else if(241 < xAct && pos.x <= xAct){
        juego.sprConejo.setPositionX(xAct - 15);
       
          //juego.sprConejo.setPositionX(pos.x);
        }
        else
        juego.sprConejo.setTexture(res.conejo_png)
            /* cc.log("Pos. Conejo: "+juego.sprConejo.getPositionX());*/
        cc.log("Pos. act: "+pos.x);
    },
    movimientoT:function(key,eventk){
        var juego = eventk.getCurrentTarget();
        var xAct = juego.sprConejo.getPositionX();
        cc.log(key.toString());
        switch(key.toString()){
            case '37' :
                if(xAct < 586){
                juego.sprConejo.setPositionX(xAct + 15); }
                break;        
        }
        
    },
     colision:function(objecto){
         cc.log("Gordito:"+objecto.width);
         
        if (objecto.getPositionX() < this.sprConejo.getPositionX() + this.sprConejo.width  && objecto.getPositionX() + objecto.width  > this.sprConejo.getPositionX() &&
        objecto.getPositionY()< this.sprConejo.getPositionY() + this.sprConejo.heigth && objecto.getPositionY() + objecto.height > this.sprConejo.getPositionY())
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
        this.addChild(zan, 2);
         this.zanahorias.push(zan);	
        
        var moveto = cc.moveTo(3, zan.getPositionX(),-this.size.height);
		zan.runAction(moveto);
         //this.colision(zan);
		
    },
    chequear: function(){
        for(var i =0; i < this.zanahorias.length;i++)
            {
                if (this.zanahorias[i].getPositionX() < this.sprConejo.getPositionX() + this.sprConejo.width  && this.zanahorias[i].getPositionX() + this.zanahorias[i].width  > this.sprConejo.getPositionX() &&
        this.zanahorias[i].getPositionY()< this.sprConejo.getPositionY() + this.sprConejo.heigth && this.zanahorias[i].getPositionY() + this.zanahorias[i]._getHeight() > this.sprConejo.getPositionY())
		{
			cc.log("Funciona manito");
			return true;
		}
              
            }
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
        this.schedule(this.colision,0.1);
        
        //Eventos
            //Pantalla touch
      	cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
                event.getCurrentTarget()
                return true;
            },
			onTouchMoved: this.movimientoP,
            eventk: cc.EventListener.KEYBOARD,
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

