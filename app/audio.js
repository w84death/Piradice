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

var audio = {

    pool: [],
    channels: [],
    max_channels: 8,
    type: 'audio/ogg',
    ext: 'ogg',

    init: function(){
        if(game.audio){
            this.pool['music1'] = {
                audio: this.createChannel('media/audio/piradice-menu-3.'+this.ext),            
                volume: 0.7,
                loop: true,
            };
            
            this.pool['button'] = {
                audio: this.createChannel('media/audio/click-ack-hi.'+this.ext),
                volume: 0.8,
            };

            this.pool['select_unit'] = {
                audio: this.createChannel('media/audio/click-ack-low.'+this.ext),
                volume: 0.6,
            };
            
            this.pool['click'] = {
                audio: this.createChannel('media/audio/general-click.'+this.ext),
                volume: 0.5,
            };

            this.pool['gold'] = {
                audio: this.createChannel('media/audio/jrpg-style-ack.'+this.ext),
                volume: 0.8,
            };

            this.pool['cannon'] = {
                audio: this.createChannel('media/audio/cannon-amiga.'+this.ext),
                volume: 0.9,
            };

            this.pool['gun'] = {
                audio: this.createChannel('media/audio/shot-amiga.'+this.ext),
                volume: 0.9,
            };      
        }
    },

    enableMP3: function(){
        this.type = 'audio/mpeg';
        this.ext = 'mp3';
    },

    enableOGG: function(){
        this.type = 'audio/ogg';
        this.ext = 'ogg';
    },

    createChannel: function(src){
        var audio = document.createElement('audio');         
        //document.body.appendChild(audio);
        
        // loading
        // this.channels[i].addEventLitener('canplaythrough',channelLoaded, false);        
        audio.setAttribute('src', src);        
        return audio;
    },

    play: function(args){
        var create_channel = true;
        if(game.audio){
            if(this.pool[args.sound]){

                for (var i = 0; i < this.channels.length; i++) {
                    if(this.channels[i].sound == args.sound && this.channels[i].audio.ended){
                       this.channels[i].audio.volume = this.pool[args.sound].volume;
                       this.channels[i].audio.play();                       
                       create_channel = false; 
                       return true;
                    }
                };

                if(create_channel){
                    if(this.channels.length < this.max_channels){
                        var temp_channel = document.createElement('audio'),
                            loop = this.pool[args.sound].loop;
                        temp_channel.setAttribute('src', this.pool[args.sound].audio.src);
                        temp_channel.setAttribute('type',this.type);
                        temp_channel.volume = this.pool[args.sound].volume;                        
                        temp_channel.play();
                        this.channels.push({
                            audio: temp_channel,
                            sound: args.sound,
                            loop: loop
                        });

                        if(loop){
                            this.channels[this.channels.length-1].audio.addEventListener('ended',audio.replay,false);
                        }

                    }else{
                        for (var i = 0; i < this.channels.length; i++) {
                            if((this.channels[i].audio.ended || !this.channels[i].audio.playing) && !this.channels[i].loop){
                                this.channels[i].audio.src = this.pool[args.sound].audio.src;
                                this.channels[i].sound = args.sound;
                                this.channels[i].audio.play();
                                return true;
                            }
                        }
                    }
                }

            }
        }
    },

    changeVolume: function(args){
        if(game.audio){
            for (var i = 0; i < this.channels.length; i++) {
                if(this.channels[i].sound == args.sound){
                    this.channels[i].audio.volume = args.volume;
                }
            }
            this.pool[args.sound].volume = args.volume;
        }
    },

    stop: function(args){
        if(game.audio){
            for (var i = 0; i < this.channels.length; i++) {
                if(this.channels[i].sound == args.sound){
                    this.channels[i].audio.pause();                
                }
            }
        }
    },

    replay: function(){
        if(game.audio){
            for (var i = 0; i < audio.channels.length; i++) {
                if(audio.channels[i].loop && (audio.channels[i].audio.ended || !audio.channels[i].audio.playing)){
                    audio.channels[i].audio.play();
                }
            }
        }
    },

}