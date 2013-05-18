/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI && PRZEMYSLAW SIKORSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
        webpage: http://piradice.krzysztofjankowski.com
        twitter: @w84death, @rezoner
        
    ----------------------------------------------------------------------------
*/

var maps = {
    map: [],
    
    load: function(args){
        this.proceduralMap(args);                
        this.generateMask();        
        return this.map;
    },    
    
    generateMask: function(){
                                      
        for (var j = 0; j < this.map.data.length; j++) {
            if(this.map.data[j] === 0 || this.map.data[j] == 1){
                this.map.moves.push(0);
            }else{
                this.map.moves.push(1);
            }
        }
    
        for (var k = 0; k < this.map.items.length; k++) {
            if(this.map.items[k].forest || this.map.items[k].rock){
                this.map.moves[this.map.items[k].x + this.map.items[k].y*this.map.width] = 2;
            }
        }
            
    },
    
    proceduralMap: function(args){
        /*
        
            Procedural Paradice Generator for Piradice
            created: 14-03-2013            
            
        */
        
        if(!args.stop_generator){
            args.stop_generator = 100;
        }
        
        Math.seedrandom(args.seed);
        
        var procMap = { name:   'Procedural Map',
                width:  args.width,
                height: args.height,
                data: [],
                moves: [],
                entities: [],
                items: []
            },
            new_block = 0,
            procMapData = [];        
        
        
        // init map
        
        for (var x = 0; x < procMap.width; x++) {
            procMapData[x] = [procMap.height];            
        }
        
        for (var y = 0; y < procMap.height; y++) {
            for (var x = 0; x < procMap.width; x++) {                      
               procMapData[x][y] = 0;
            }            
        }
        
        var start = [];
        
        // start first islands
        console.log(':: GENERATING ISLANDS..');
        
        for (var i = 0; i < args.islands; i++) {
            var padding = {
                x: (procMap.width*0.2)<<0,
                y: (procMap.height*0.2)<<0
            }
            
            start.push({
                x: padding.x + (Math.random()*(procMap.width - padding.x*2))<<0,
                y: padding.y + (Math.random()*(procMap.height - padding.y*2))<<0});  
            
            procMapData[start[i].x][start[i].y] = 2;
            
        }
                
        var size = args.islands_size;        
                
        for (var generate = 0; generate < args.stop_generator; generate++) {
            for (var y = 3; y < procMap.height-3; y++) {
                for (var x = 3; x < procMap.width-3; x++) {                    
                    if(procMapData[x][y] == 2 && (Math.random()*args.stop_generator)<<0 < size){        
                            size *= 0.99;
                            procMapData[x-1][y] = 2;
                            procMapData[x][y-1] = 2;
                            procMapData[x+1][y] = 2;
                            procMapData[x][y+1] = 2;
                    }
                }
            }
        }

        
        // generate grass
        console.log(':: GENERATING GRASS..');
        
        for (var generate = 0; generate < args.grass; generate++) {
            for (var y = 4; y < procMap.height-4; y++) {
                for (var x = 4; x < procMap.width-4; x++) {
                    if(generate == 0){
                        if(procMapData[x][y] == 2 && procMapData[x-3][y] == 2 && procMapData[x][y-3] == 2 && procMapData[x+3][y] == 2 && procMapData[x][y+3] == 2 && (Math.random()*args.stop_generator)<<0 < args.grass){                            
                            procMapData[x-1][y] = 4;
                            procMapData[x][y-1] = 4;
                            procMapData[x+1][y] = 4;
                            procMapData[x][y+1] = 4;    
                        }                        
                    }else{
                        if(procMapData[x][y] == 4 && (Math.random()*args.stop_generator)<<0 < args.grass){
                            if(procMapData[x-1][y] == 2 ) { procMapData[x-1][y] = 4; }
                            if(procMapData[x][y-1] == 2 ) { procMapData[x][y-1] = 4; }
                            if(procMapData[x+1][y] == 2) { procMapData[x+1][y] = 4; }
                            if( procMapData[x][y+1] ==2 ) { procMapData[x][y+1] = 4; }
                        }
                    }
                    
                }
            }
        }
                        
                
        // clear artifacts        
        
        for (var y = 2; y < procMap.height-2; y++) {
            for (var x = 2; x < procMap.width-2; x++) {
                
                if(procMapData[x][y] == 2 && ( 
                    // up
                    procMapData[x][y+1] == 2 && procMapData[x][y-1] == 0 && procMapData[x-1][y] == 0 && procMapData[x+1][y] == 0 || 
                    // down
                    procMapData[x][y+1] == 0 && procMapData[x][y-1] == 2 && procMapData[x-1][y] == 0 && procMapData[x+1][y] == 0
                ) ){
                    procMapData[x][y] = 0;
                }
                
                if(procMapData[x][y] == 0 && procMapData[x][y+1] != 0 && procMapData[x][y-1] != 0 && procMapData[x-1][y] != 0 && procMapData[x+1][y] != 0){
                    procMapData[x][y] == 2;
                }
                
                if(procMapData[x][y] == 2 && ( 
                    // empty grass
                    procMapData[x][y+1] == 4 && procMapData[x][y-1] == 4 && procMapData[x-1][y] == 4 && procMapData[x+1][y] == 4
                ) ){
                    procMapData[x][y] = 4;
                }
                
                if(procMapData[x][y] == 2 && procMapData[x-1][y] == 0 && procMapData[x][y-1] == 0 && procMapData[x+1][y] == 0 && procMapData[x][y+1] == 0){
                    procMapData[x][y] = 0;
                }
            }
        }
        
        // generate item
        console.log(':: GENERATING ITEMS..');
                
        for (var y = 2; y < procMap.height-2; y++) {
            for (var x = 2; x < procMap.width-2; x++) {
                // palm
                if(procMapData[x][y] != 0 && (Math.random()*args.stop_generator)<<0 < args.palms){
                    if(procMapData[x-2][y] != 0 && procMapData[x][y-2] != 0  && procMapData[x+2][y] != 0 &&  procMapData[x][y+2] != 0 ) { 
                        var place_palm = true;
                        for (var i = 0; i < start.length; i++) {
                            if(x == start[i].x && y == start[i].y){
                                place_palm = false;
                            }
                        }
                        if(place_palm){                            
                            // place a palm
                            procMap.items.push(new Palm({x:x, y:y, palms:0}));

                        }                                           
                    }
                }

                if((Math.random()*args.stop_generator)<<0 < args.environment ){
                    // place some Environment :D
                    if(procMapData[x][y] === 0 || procMapData[x][y] == 1){
                        procMap.items.push(new Environment({x:x, y:y, biome:'water'}));
                    }
                    if(procMapData[x][y] === 2 || procMapData[x][y] == 3){
                        procMap.items.push(new Environment({x:x, y:y, biome:'sand'}));
                    }
                    if(( procMapData[x][y] == 4 || procMapData[x][y] == 5 )){
                        procMap.items.push(new Environment({x:x, y:y, biome:'grass'}));
                    }
                }

                if((Math.random()*args.stop_generator)<<0 < args.rocks ){
                    // place rocks
                    if(procMapData[x][y] === 0){
                        procMap.items.push(new Rock({x:x, y:y}));
                    }
                }                                       
               
                // bridge
                if(procMapData[x][y] !== 0 && procMapData[x-1][y] !== 0  && procMapData[x+1][y] !== 0 && procMapData[x][y-1] === 0  && procMapData[x][y+1] === 0){
                    procMapData[x][y] = 6;
                }
                
                if(procMapData[x][y] !== 0 && procMapData[x-1][y] === 0  && procMapData[x+1][y] === 0 && procMapData[x][y-1] !== 0  && procMapData[x][y+1] !== 0){
                    procMapData[x][y] = 7;
                }
            }
        }
        
        
        for (i = 0; i < procMap.items.length; i++) {

            // initial grow (randomize) sprite
            procMap.items[i].grow();

            if(procMap.items[i].forest){
                var neighbors = 0;
                for (var j = 0; j < procMap.items.length; j++) {
                    if(procMap.items[j].forest){
                        if(procMap.items[j].x - 1 == procMap.items[i].x && procMap.items[j].y == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x + 1 == procMap.items[i].x && procMap.items[j].y == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x == procMap.items[i].x && procMap.items[j].y - 1  == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x == procMap.items[i].x && procMap.items[j].y + 1 == procMap.items[i].y) { neighbors++; }
                        
                        if(procMap.items[j].x - 1 == procMap.items[i].x && procMap.items[j].y - 1 == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x + 1 == procMap.items[i].x && procMap.items[j].y - 1 == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x - 1 == procMap.items[i].x && procMap.items[j].y + 1 == procMap.items[i].y) { neighbors++; }
                        if(procMap.items[j].x + 1 == procMap.items[i].x && procMap.items[j].y + 1 == procMap.items[i].y) { neighbors++; }
                    }
                }                

                if(neighbors > 4){
                    procMap.items[i].grow();
                }
            }                
        }
                
        for (i = 0; i < start.length; i++) {
            if(procMapData[start[i].x][start[i].y] !== 0 &&  i < args.chests ){
                procMap.items.push(new Chest({x:start[i].x, y:start[i].y}));
            }
        }
        
        
        // generate army
        console.log(':: GENERATING ARMY..');
        
        procMap.entities = [];
        /*
        
         // MAYBE SOME DAY..
         
         
        args.skeletons = 10;
        args.skeletons_size = 3;
        
        for (var i = 0; i < start.length; i++) {
             
            if(procMapData[start[i].x][start[i].y] != 0 ){
                // 70%
                if((Math.random()*args.stop_generator)<<0 < args.stop_generator*0.7){
                    
                    var new_x = start[i].x + ((Math.random()*3 )<<0 ) -1,
                        new_y = start[i].y + ((Math.random()*3 )<<0 ) -1,
                        new_squad = ((Math.random()*args.skeletons_size )<<0 ) + 1;
                   
                    procMap.entities.push( new Skeleton({x:new_x,y:new_y,squad:new_squad,team:1}) );  
                }
            }

        }            
        */

        
        // HARD LINE            
        
        
        // generate shadows
        for (var y = 1; y < procMap.height-1; y++) {
            for (var x = 1; x < procMap.width-1; x++) {
                if(procMapData[x][y] == 4 && procMapData[x][y+1] != 4){
                    procMapData[x][y] = 5;
                }
            }
        }
        
        for (var y = 1; y < procMap.height-1; y++) {
            for (var x = 1; x < procMap.width-1; x++) {
                if(procMapData[x][y] == 2 && procMapData[x][y+1] == 1){
                    procMapData[x][y] = 3;
                }
            }
        }
        
        // generate water
        
        
        // load data
        for (var y = 0; y < procMap.height; y++) {
            for (var x = 0; x < procMap.width; x++) {                      
                if(!procMapData[x][y]){                
                    procMap.data.push(0);
                }else{
                    procMap.data.push(procMapData[x][y]);
                }
            }
            
        }
                
        
        this.map = procMap;
    },
    
    
       
};

