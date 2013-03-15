var editor = {
    settings: null,
    entities: [],
    saved_entities: [],
    
    init: function(){
        this.updateSettings();
        game.init(this.settings);        
        game.editor = true;
        game.play = false;
    },
    
    generateMap: function(clear){
        game.editor = true;
        game.play = false;
        if(clear){
            this.entities = [];
        }else {
            this.entities = utilities.clone(this.saved_entities);
        }
        this.updateSettings();
        world.loadMap(this.settings);
        render.render({gui:true, entities:true, map:true});
    },
    
    playMap: function(){
        this.updateSettings();
        world.loadMap(this.settings);        
        
        game.turn.start = true;
        game.play = true;
        game.editor = false;
        game.preview_play = true;
        
        document.getElementById('generator').style.display = 'none';
        document.getElementById('play').innerHTML = 'Exit play';
        document.getElementById('play').setAttribute('onclick','editor.exitPlay()');
    },
    
    exitPlay: function(){
        
        game.editor = true;
        game.play = false;
        
        editor.generateMap(false);
        
        render.render({gui:true, entities:true, map:true});
        
        document.getElementById('generator').style.display = 'block';
        document.getElementById('play').innerHTML = 'Play this map';
        document.getElementById('play').setAttribute('onclick','editor.playMap()');
    },
    
    updateSettings: function(){
        this.settings = { 
            editor: true,
            id: 0,
            seed: document.getElementById('seed').value,
            islands: document.getElementById('islands').value,
            islands_size: document.getElementById('islands_size').value,      
            grass: document.getElementById('grass').value,
            palms: document.getElementById('palms').value,
            chests: document.getElementById('chests').value,
            entities: this.entities,               
        }
    },
    
    putUnit: function(x,y){ 
        
        var new_unit = true;
        
        for (var i = 0; i < this.entities.length; i++) {
            if(this.entities[i].x == x && this.entities[i].y == y){
                new_unit = false;
                this.entities.splice(i, 1);
                 this.saved_entities
            }
        }
        
        var squad = parseInt(document.getElementById('squad').value);
        
        if(new_unit){
            if(document.getElementById('unit').value == 'pirate'){
                this.entities.push(new Pirate({x:x,y:y,squad:squad,team:0}));
                this.saved_entities.push(new Pirate({x:x,y:y,squad:squad,team:0}));
            }
            
            if(document.getElementById('unit').value == 'range_pirate'){
                this.entities.push(new RangePirate({x:x,y:y,squad:squad,team:0}));
                this.saved_entities.push(new RangePirate({x:x,y:y,squad:squad,team:0}));
            }
            
            if(document.getElementById('unit').value == 'skeleton'){
                this.entities.push(new Skeleton({x:x,y:y,squad:squad,team:1}));
                this.saved_entities.push(new Skeleton({x:x,y:y,squad:squad,team:1}));
            }
            
            if(document.getElementById('unit').value == 'octopus'){
                this.entities.push(new Octopus({x:x,y:y,squad:1,team:1}));
                this.saved_entities.push(new Octopus({x:x,y:y,squad:1,team:1}));
            }
            
            if(document.getElementById('unit').value == 'ship'){
                this.entities.push(new Ship({x:x,y:y,squad:1,team:0}));
                this.saved_entities.push(new Ship({x:x,y:y,squad:1,team:0}));
            }
            
            if(document.getElementById('unit').value == 'black_pearl'){
                this.entities.push(new BlackPearl({x:x,y:y,squad:1,team:0}));
                this.saved_entities.push(new BlackPearl({x:x,y:y,squad:1,team:0}));
            }
        }
        
        render.render({entities:true});
    },
    
    
}