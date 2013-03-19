var load = {
    maps: [],
    
    map: function(args){
        if(args.campain){
            this.loadCampain();
        }else{
            this.proceduralMap(args);
        }
        
        this.generateMask();
        
        return this.maps;
    },
    
    loadCampain: function(){
        
        this.maps[0] = {
            name:   'Tutorial',
            width:  16,
            height: 12,
            data: [
                0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,
                0,0,0,0,0,0,0,0,0,0,0,1,5,4,4,1,
                0,0,0,0,1,1,1,1,1,0,0,1,1,5,5,1,
                0,0,0,1,1,2,2,2,1,1,0,0,1,1,1,1,
                0,0,0,1,2,2,4,4,2,1,1,0,0,0,0,0,
                0,0,0,1,2,5,4,4,2,2,1,0,0,0,0,0,
                0,0,0,1,3,2,5,5,2,3,1,0,0,0,0,0,
                0,0,0,1,1,3,3,3,3,1,1,0,0,0,0,0,
                0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
            ],
            moves: [],
            entities: [                                
                new Pirate({x:4,y:5,squad:1,team:0}),
                new Pirate({x:4,y:6,squad:2,team:0}),                
                new Skeleton({x:6,y:6,squad:1,team:1}),
                new Skeleton({x:7,y:6,squad:1,team:1}),
            ],
            items: [
                new Chest({x:7, y:5}),
                new Palm({x:6, y:5}),
                new Palm({x:14, y:1})
            ]    
        };
        
        this.maps[1] = {
            name:   'First islands',
            width:  16,
            height: 12,
            data: [
                0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
                0,1,1,2,2,2,1,1,1,1,1,1,1,1,0,0,
                1,1,2,2,4,2,2,2,2,1,1,2,2,1,1,1,
                1,2,4,4,4,4,2,2,3,6,2,5,4,5,2,1,
                1,2,5,5,5,5,2,3,1,1,3,2,5,2,3,1,
                1,3,2,2,3,3,3,1,1,1,1,3,3,3,1,1,
                1,1,3,3,1,1,1,1,1,1,1,1,7,1,1,1,
                0,1,1,7,1,1,0,1,1,2,2,4,4,4,2,1,
                1,1,1,4,4,1,0,1,2,5,4,4,4,5,2,1,
                1,4,4,4,4,1,0,1,3,2,5,5,5,2,3,1,
                1,5,5,5,5,1,0,1,1,3,3,3,3,3,1,1,
                1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,
            ],
            moves: [],
            entities: [
                new Pirate({x:1,y:3,squad:1,team:0}),
                new RangePirate({x:1,y:5,team:0}),
                new Pirate({x:2,y:3,squad:2,team:0}),                
                new Pirate({x:1,y:4,squad:1,team:0}),
                new Pirate({x:14,y:9,squad:2,team:0}),
                new Pirate({x:13,y:10,squad:1,team:0}),
                new Pirate({x:13,y:9,squad:1,team:0}),
                
                new Octopus({x:6, y:8,team:1}),
                new Skeleton({x:5,y:2,squad:2,team:1}),
                new Skeleton({x:4,y:5,squad:1,team:1}),
                new Skeleton({x:12,y:4,squad:2,team:1}),
                new Skeleton({x:9,y:8,squad:1,team:1}),
                new Skeleton({x:13,y:8,squad:1,team:1}),                
                new Skeleton({x:4,y:9,squad:1,team:1}),
            ],
            items: [
                new Chest({x:5, y:4}),
                new Chest({x:11, y:2}),
                new Chest({x:9, y:8}),
                new Chest({x:1, y:10}),
                new Palm({x:4,y:3}),
                new Palm({x:11,y:7}),
                new Palm({x:11,y:8}),
                new Palm({x:10,y:8}),
                new Palm({x:3, y:3}),
                new Palm({x:2, y:9}),
                new Palm({x:4, y:8}),
                new Palm({x:4, y:10}),
                new Palm({x:1, y:9}), 
                new Palm({x:12, y:3})
            ]        
        };
            
        this.maps[2] = {
            name:   'Big land',
            width:  16,
            height: 12,
            data: [
                0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,
                1,1,2,2,1,1,0,0,0,0,1,1,1,1,1,1,
                1,2,2,2,2,1,1,0,0,1,1,4,4,4,5,1,
                1,2,2,2,2,2,1,0,0,1,4,4,4,4,1,1,
                1,2,2,2,2,2,1,0,0,1,5,4,4,4,4,1,
                1,3,2,4,3,1,1,0,0,1,1,4,4,4,5,1,
                1,1,5,4,1,1,0,0,0,0,1,5,4,4,1,1,
                0,1,1,7,1,1,0,0,0,0,1,1,5,4,1,1,
                0,1,1,4,4,1,1,1,1,1,0,1,1,4,4,1,
                0,1,5,4,4,4,5,5,4,1,1,1,4,4,5,1,
                0,1,1,5,5,5,1,1,5,5,6,5,5,5,1,1,
                0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0
            ],
            moves: [],
            entities: [
                new Ship({x:6,y:2,squad:1,team:0}),
                new BlackPearl({x:8,y:3,squad:1,team:0}),
                new Pirate({x:2,y:1,squad:2,team:0}),
                new Pirate({x:2,y:2,squad:3,team:0}),
                new Pirate({x:3,y:1,squad:2,team:0}),                
                new RangePirate({x:3,y:3,squad:3,team:0}),
                new RangePirate({x:1,y:2,squad:1,team:0}),
                
                
                new Octopus({x:6, y:6,team:1}),
                new Octopus({x:1, y:8,team:1}),
                new Octopus({x:14, y:10,team:1}),
                new Skeleton({x:4,y:4,squad:1,team:1}),
                new Skeleton({x:3,y:9,squad:5,team:1}),                
                new Skeleton({x:8,y:10,squad:3,team:1}),
                new Skeleton({x:13,y:5,squad:1,team:1}),
                new Skeleton({x:11,y:4,squad:2,team:1}),
                new Skeleton({x:13,y:7,squad:1,team:1}),
                new Skeleton({x:12,y:5,squad:1,team:1}),
                new Skeleton({x:12,y:6,squad:1,team:1})
                
            ],
            items: [
                new Chest({x:12, y:3}),
                new Palm({x:4, y:8}),
                new Palm({x:12, y:9}),
                new Palm({x:14, y:8}),
                new Palm({x:12, y:2}),
                new Palm({x:13, y:4}),
                new Palm({x:14, y:4}),
                new Palm({x:14, y:5}),
                new Palm({x:11, y:3}),
                new Palm({x:10, y:3}),
                new Palm({x:10, y:4})              
            ]    
        };
        
        this.maps[3] = {
            name:   'Hunting',
            width:  16,
            height: 12,
            data: [
                0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,
                1,1,2,2,1,1,2,2,3,3,2,2,1,1,1,0,
                1,2,2,2,2,2,2,2,1,1,3,2,2,2,1,1,
                1,2,2,3,3,2,2,3,1,1,1,3,3,2,2,1,
                1,2,2,1,1,3,3,1,1,1,1,1,1,2,2,1,
                1,2,2,1,1,1,1,1,4,4,1,1,1,2,2,1,
                1,2,2,1,1,0,0,1,5,4,1,1,1,2,2,1,
                1,3,2,2,1,1,1,1,1,7,1,1,1,2,3,1,
                1,1,3,2,2,2,1,1,1,4,4,4,4,3,1,1,
                0,1,1,3,2,2,4,4,4,5,5,5,1,1,1,0,
                0,0,1,1,3,3,3,5,5,1,1,1,1,0,0,0,
                0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0
            ],
            moves: [],
            entities: [                                
                new RangePirate({x:2,y:1,squad:1,team:0}),
                new RangePirate({x:2,y:2,squad:1,team:0}),
                new RangePirate({x:1,y:3,squad:2,team:0}),
                
                new RangePirate({x:13,y:2,squad:1,team:0}),
                new RangePirate({x:13,y:3,squad:1,team:0}),
                new RangePirate({x:14,y:3,squad:3,team:0}),
                
                new Skeleton({x:14,y:6,squad:3,team:1}),
                new Skeleton({x:13,y:7,squad:1,team:1}),
                new Skeleton({x:11,y:9,squad:1,team:1}),
                
                new Skeleton({x:6,y:1,squad:1,team:1}),
                new Skeleton({x:1,y:6,squad:1,team:1}),
                new Skeleton({x:5,y:2,squad:1,team:1}),                
                new Skeleton({x:2,y:7,squad:1,team:1}),                
                new Skeleton({x:6,y:10,squad:3,team:1}),
                new Skeleton({x:5,y:9,squad:2,team:1}),
                new Skeleton({x:13,y:8,squad:1,team:1})
            ],
            items: [
                new Chest({x:9, y:5}),
                new Chest({x:6, y:9}),
                new Chest({x:12, y:8}),
                new Palm({x:8, y:5}),
                new Palm({x:10, y:8}),
                new Palm({x:11, y:8}),
                new Palm({x:8, y:9}),
                new Palm({x:7, y:9})
            ]    
        };
        
    },
    
    generateMask: function(){
        for (var i = 0; i < this.maps.length; i++) {                                
            for (var j = 0; j < this.maps[i].data.length; j++) {
                if(this.maps[i].data[j] === 0 || this.maps[i].data[j] == 1){
                    this.maps[i].moves.push(0);
                }else{
                    this.maps[i].moves.push(1);
                }
            }
        }},
    
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
                width:  32,
                height: 24,
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
                            procMap.items.push(new Palm({x:x, y:y}));
                        }
                    }
                }
                
               
                // bridge
                if(procMapData[x][y] != 0 && procMapData[x-1][y] != 0  && procMapData[x+1][y] != 0 && procMapData[x][y-1] === 0  && procMapData[x][y+1] === 0){
                    procMapData[x][y] = 6;
                }
                
                if(procMapData[x][y] != 0 && procMapData[x-1][y] === 0  && procMapData[x+1][y] === 0 && procMapData[x][y-1] != 0  && procMapData[x][y+1] != 0){
                    procMapData[x][y] = 7;
                }
            }
        }
        
         for (var i = 0; i < start.length; i++) {
            if(procMapData[start[i].x][start[i].y] != 0 &&  i < args.chests ){
                procMap.items.push(new Chest({x:start[i].x, y:start[i].y}));
            }
        }
        
        
        // generate army
        console.log(':: GENERATING ARMY..');
        
        procMap.entities = args.entities;
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
        
        // generate beach water
        for (var y = 1; y < procMap.height-1; y++) {
            for (var x = 1; x < procMap.width-1; x++) {
                if(procMapData[x][y] == 0 && ( (
                    procMapData[x-1][y] == 2 || procMapData[x][y-1] == 2  || procMapData[x+1][y] == 2 || procMapData[x][y+1] == 2 || procMapData[x-1][y-1] == 2 || procMapData[x-1][y+1] == 2  || procMapData[x+1][y+1] == 2 || procMapData[x+1][y-1] == 2 ) || (
                    procMapData[x-1][y] == 4 || procMapData[x][y-1] == 4  || procMapData[x+1][y] == 4 || procMapData[x][y+1] == 4 || procMapData[x-1][y-1] == 4 || procMapData[x-1][y+1] == 4  || procMapData[x+1][y+1] == 4 || procMapData[x+1][y-1] == 4 )
                    ) ){
                    procMapData[x][y] = 1;
                }
            }
        }
        
        
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
                
        
        this.maps[args.id] = procMap;
    },
    
    
       
};

