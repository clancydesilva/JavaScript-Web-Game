//Credits
    //music: made by me on https://www.beepbox.co/
    //player.png: https://game-endeavor.itch.io/mystic-woods
    //demons.png: https://craftpix.net/freebies/free-chaos-monsters-32x32-icon-pack/
    //bg.png: combination of https://opengameart.org/content/rpg-tiles-cobble-stone-paths-town-objects 
        //and https://opengameart.org/content/16x16-tiles
    //cross_whole_hit.png and cross_normal_hit.png: https://opengameart.org/content/simple-crosshairs
    //all other images: created by me

//Cheats
    //continuously pressing 0 slows down enemies and arrows
    //continuously pressing 9 increases their speed back to normal (and even faster)

let canvas;
let context;

let request_id;

let fpsInterval = 1000/30;
let now;
let then = Date.now();
let player = {
    x : 0,
    y : 0,
    width : 32,
    height : 32,
    frameX: 0,
    frameY : 0,
    max_hp : 200,
    hp : 200,
    size : 64
};

let playerImage = new Image();

let demons = new Image();
 
let background= [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 9, 10, 11, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 12, 13, 14, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 10, 11, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 12, 13, 14, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 10, 11, 4, 4, 4, 4, 4, 4, 4, 4, 9, 10, 11, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 12, 13, 14, 4, 4, 4, 4, 4, 4, 4, 4, 12, 13, 14, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 
    [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8]
];

let bg = new Image();
let tileSize = 32;

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;
let click = false;
let space = false;
let space_up = true;
let one = false;
let two = false;
let pause = false;
let right;
let left;
let up;
let down = true;

let mouse = {
    x: null,
    y : null
};

let cursor;
let enemies = [];
let wave_display;
let hit;
let number = 0;
let swing_hit;
let check;
let dist;
let dmg_taken;
let stats;

let delays = {
    redirection : 100,
    boss_lava_tile : 50,
    stop_swing : 2
};

let lava = [];

let arrows = [];
let arrow = new Image();
let arrow_wave = 1;
let arrow_phase = false;

let next_stage = new Image();
let stage_arrow = 1;
let music = new Audio();
let zawarudo = new Audio();
let shot = new Audio();
let healed = new Audio();
let over = new Audio();
let over_play = 60;
let player_dmg = new Audio();
let clear_music = new Audio();

let bleed = new Image();
let death = new Image();

let slow_down = false;
let speed_up = false;

let abilities = {
    time_stop : {
        duration : 60,
        cool_down : 200,
        disabled : false
    },
    heal : {
        amount : 50,
        cool_down : 300,
        disabled : false
    },
    shoot : {
        cool_down : 50,
        disabled : false
    }
};

document.addEventListener("DOMContentLoaded", init, false);

let progress = {
    stage : 1,
    wave : 1
};

let stage_cleared = false;

let xhttp;
let xhttp_send = 1;

function init () {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    window.addEventListener("mousedown", get_coords, false);
    window.addEventListener("mouseup", erase, false);

    player.x = (canvas.width/2) - 16;
    player.y = (canvas.height/2) - 16;

    load_assets ([{"var":playerImage, "url":"static/player.png"}, 
    {"var":bg, "url":"static/bg.png"},{"var":demons, "url":"static/demons.png"},{"var":arrow, "url":"static/arrow.png"},
    {"var":next_stage, "url":"static/stage_end.png"},{"var":music, "url":"static/music1.mp3"},
    {"var":bleed, "url":"static/dmg.png"},{"var":death, "url":"static/death.png"},
    {"var":zawarudo, "url":"static/time_stop.mp3"},{"var":shot, "url":"static/shot.mp3"},
    {"var":player_dmg, "url":"static/player_dmg.mp3"},{"var":healed, "url":"static/heal.mp3"},
    {"var":over, "url":"static/game_over.mp3"},{"var":clear_music, "url":"static/stage_clear.mp3"}], draw)
}

function draw () {
    if (player.hp > 0 && progress.wave != 5) {
        music.play();
    } 
    else {
        music.pause();
    }
    window.requestAnimationFrame(draw)
    let now = Date.now()
    let elapsed = now - then
    if (elapsed <= fpsInterval) {
        return;
    };

    then = now - (elapsed % fpsInterval);
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Draw background
    generate_tiles();

    //Draw/Animate Player and Melee Attacks
    attack_animation();    
    animate_player();

    stop_movement();

    //Player health bar
    hp_bar(player);

    //Check ability statuses
    ability_status();

    //Generate Enemies
    wave_display = document.querySelector("#wave")
    stats = document.querySelector("#stats")
    if (progress.wave === 1 || progress.wave === 2) {
        wave_display.innerHTML = "Stage 1 - Uprising"
        if (number < 10) {
            number++
            let e = {
                x : randint(64,canvas.width-64),
                y : randint(64,canvas.height-64),
                size : 64,
                max_hp : 1,
                hp : 1,
                xChange : randint(-5,5,0),
                yChange : randint(-5,5,0),
                frame : 1
            };
            enemies.push(e);
        };
        if (progress.wave === 1) {
            stats.innerHTML = "Wave 1 - Enemies Left: "+enemies.length
        }
        else if (progress.wave === 2) {
            stats.innerHTML = "Wave 2 - Enemies Left: "+enemies.length
        } 
    }
    else if (progress.wave === 4) {
        if (number === 0) {
            number++
            let e = {
                x : 900,
                y : 320,
                size : 96,
                max_hp : 20,
                hp : 20,
                xChange : null,
                yChange : null,
                frame : 1
            };
            enemies.push(e);
            wave_display.innerHTML = "Stage 1 - Coup D'état"
            stats.innerHTML = "Defeat the Boss"
        };
    }

    //Obstacle Stage
    if (progress.wave === 3 && arrows.length === 0) {
        wave_display.innerHTML = "Stage 1 - Infiltration"
        stats.innerHTML = "Survive "+(17-arrow_wave)+" Volleys of Arrows"
        arrow_phase = true;
        console.log(arrow_wave)
        if (arrow_wave === 17) {
            arrow_phase = false;
            stats.innerHTML = "Still alive? Not for long."
        }
        else if (arrow_wave % 4 === 0) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : randint(64,canvas.width-64,0),
                    y : 0,
                    move : 20,
                    size : 8,
                    direction : "d"
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave % 4 === 1) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : canvas.width,
                    y : randint(64,canvas.height-64,0),
                    move : -20,
                    size : 8,
                    direction : "l"
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave % 4 === 2) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : randint(64,canvas.width-64,0),
                    y : canvas.height,
                    move : -20,
                    size : 8,
                    direction : "u"
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave % 4 === 3) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : 0,
                    y : randint(64,canvas.height-64,0),
                    move : 20,
                    size : 8,
                    direction : "r"
                };
                arrows.push(a);
            };
        };
    };

    //Draw Enemies
    for (let e of enemies) {
        if (progress.wave === 1) {
            if (e.xChange > 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,0,64,32,32,e.x,e.y+4,64,60);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,0,64,32,32,e.x,e.y,64,64);
                    e.frame++;
                };
            };
            if (e.xChange < 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,32,160,32,32,e.x,e.y+4,64,60);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,32,160,32,32,e.x,e.y,64,64);
                    e.frame++;
                };
            };
        }
        else if (progress.wave === 2) {
            if (e.xChange > 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,0,32,32,32,e.x,e.y+4,64,60);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,0,32,32,32,e.x,e.y,64,64);
                    e.frame++;
                };
            };
            if (e.xChange < 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,32,128,32,32,e.x,e.y+4,64,60);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,32,128,32,32,e.x,e.y,64,64);
                    e.frame++;
                };

            };
        }
        else if (progress.wave === 4) {
            if (e.xChange > 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,0,0,32,32,e.x,e.y+6,96,90);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,0,0,32,32,e.x,e.y,96,96);
                    e.frame++;
                }
            };
            if (e.xChange < 0) {
                if (e.frame % 5 === 0) {
                    context.drawImage(demons,32,96,32,32,e.x,e.y+6,96,90);
                    e.frame++;
                }
                else {
                    context.drawImage(demons,32,96,32,32,e.x,e.y,96,96);
                    e.frame++;
                }
            };
            hp_bar(e)
        };

    };

    //Boss Movement and Attacks
    if (progress.wave === 4) {
        for (let e of enemies) {
            e.xChange = (player.x-e.x)/50
            e.yChange = (player.y-e.y)/50  
        }
        delays.boss_lava_tile--;
        if (delays.boss_lava_tile === 0) {
            let l = {
                x : randint(0, background[0].length)*32,
                y : randint(0, background.length)*32,
                size : 32
            }
            lava.push(l);
            background[l.y/32][l.x/32] = 50
            delays.boss_lava_tile = 50
        }
    };

    //Cheats
    if (slow_down) {
        for (let e of enemies) {
            e.xChange = e.xChange/1.1
            e.yChange = e.yChange/1.1
        }
        for (let a of arrows) {
            a.move = a.move/1.1
        }
    }
    else if (speed_up) {
        for (let e of enemies) {
            e.xChange = e.xChange*1.1
            e.yChange = e.yChange*1.1
        }
        for (let a of arrows) {
            a.move = a.move*1.1
        }
    };

    //Animate arrows
    for (let a of arrows) {
        if (a.direction === "r") {
            context.drawImage(arrow,16,8,24,8,a.x,a.y,48,16)
        }
        else if (a.direction === "d") {
            context.drawImage(arrow,0,0,8,24,a.x,a.y,16,48)
        }
        else if (a.direction === "l") {
            context.drawImage(arrow,16,0,24,8,a.x,a.y,48,16)
        }
        else if (a.direction === "u") {
            context.drawImage(arrow,8,0,8,24,a.x,a.y,16,48)
        };
    };
    for (let a of arrows) {
        if (a.direction === "r") {
            a.x = a.x + a.move;
            if (a.x > canvas.width) {
                arrows.splice(arrows.indexOf(a),1)
                if (arrows.length === 0) {
                    arrow_wave++
                };
            }
        }
        else if (a.direction === "d") {
            a.y = a.y + a.move;
            if (a.y > canvas.height) {
                arrows.splice(arrows.indexOf(a),1)
                if (arrows.length === 0) {
                    arrow_wave++
                };
            };
        }
        else if (a.direction === "l") {
            a.x = a.x + a.move;
            if (a.x < 0) {
                arrows.splice(arrows.indexOf(a),1)
                if (arrows.length === 0) {
                    arrow_wave++
                };
            }
        }
        else if (a.direction === "u") {
            a.y = a.y + a.move;
            if (a.y < 0) {
                arrows.splice(arrows.indexOf(a),1)
                if (arrows.length === 0) {
                    arrow_wave++
                };
            };
        };
    };

    //Animate Enemies and check for time stop ability
    if (one && abilities.time_stop.duration === 0) {
        one = false
        abilities.time_stop.duration = 60;
        abilities.time_stop.cool_down = 0;
        console.log("time stop over")
    }
    else if (one && abilities.time_stop.duration > 0) {
        zawarudo.play();
        abilities.time_stop.duration--;
        console.log("time stop started, ending in "+abilities.time_stop.duration)
    }
    else if (!one) {
        for (let e of enemies) {
            e.x = e.x + e.xChange;
            e.y = e.y + e.yChange;
            if (e.x <= 0 || e.x >= canvas.width-64) {
                e.xChange = e.xChange*-1
                e.x = e.x + e.xChange;
            }
            if (e.y <= 0 || e.y >= canvas.height-64) {
                e.yChange = e.yChange*-1
                e.y = e.y + e.yChange;
            }
            console.log("time moving")
        };
        if (abilities.time_stop.cool_down < 200) {
            abilities.time_stop.disabled = true;
            console.log("time stop on cool down "+abilities.time_stop.cool_down+"/200")
            abilities.time_stop.cool_down++;
        }
        else if (abilities.time_stop.cool_down === 200) {
            abilities.time_stop.disabled = false;
        };
    }

    //Check Heals
    heal();

    //Shooting
    if (click) {
        shot.play();
        cursor = document.querySelector("canvas")
        cursor.style.cursor = "url(static/cross_normal_hit.png), auto" 
        context.strokeStyle = "red"
        context.lineWidth = 3
        context.beginPath();
        context.moveTo(player.x+32,player.y+32);
        context.lineTo(mouse.x,mouse.y);
        context.stroke();
    };

    //Check for ranged targets hit
    for (let e of enemies) {
        hit = shoot(e)
        if (hit) {
            e.hp = e.hp - 1
            context.drawImage(bleed,0,0,411,411,e.x-e.size/2,e.y-e.size/2,2*e.size,2*e.size)
            console.log("Current HP: "+e.hp)
            if (e.hp === 0) {
                enemies.splice(enemies.indexOf(e),1);
                console.log("Enemies Left: "+enemies.length);
                context.drawImage(death,0,0,577,577,e.x,e.y,e.size,e.size)
            };
        };
    };

    //Check for melee targets hit
    for (let e of enemies) {
        swing_hit = melee(e);
        if (swing_hit) {
            e.hp = e.hp - 1
            context.drawImage(bleed,0,0,411,411,e.x-e.size/2,e.y-e.size/2,2*e.size,2*e.size)
            console.log("Current HP: "+e.hp)
            if (e.hp === 0) {
                enemies.splice(enemies.indexOf(e),1);
                console.log("Enemies Left: "+enemies.length);
                context.drawImage(death,0,0,577,577,e.x,e.y,e.size,e.size)
            };
        };
    };
    
    //Check if damaged taken
    for (let e of enemies) {
        dmg_taken = collision_with(e)
        if (dmg_taken) {
            if (player.hp != 0 && !one) {
                if (progress.wave === 4) {
                    player.hp -= 5;
                    player_dmg.play()
                }
                else {
                    player.hp--;
                    player_dmg.play()
                }
            };
            //console.log("Player Health: "+player.hp);
        };
    };
    for (let a of arrows) {
        dmg_taken = collision_with(a)
        if (dmg_taken) {
            if (player.hp != 0) {
                player.hp -= 2;
                player_dmg.play()
            };
            //console.log("Player Health: "+player.hp);
        };
    };
    for (let l of lava) {
        dmg_taken = collision_with(l)
        // console.log("Length: "+lava.length);
        // console.log("Lava Tile at coords: "+l.x+" "+l.y);
        if (dmg_taken) {
            if (player.hp != 0) {
                player.hp -= 5;
                player_dmg.play()
            };
        }
    };

    //Check if wave cleared
    let wave_end = enemies.length === 0 && !arrow_phase
    if (wave_end && progress.wave <= 4) {
        for (let r = 0; r < background.length; r += 1) {
            for (let c = 0; c < background[0].length; c += 1) {
                if (background[r][c] === 50)
                    background[r][c] -= 1;
            };
        };
        lava.length = 0;
        if (stage_arrow < 10) {
            context.drawImage(next_stage,0,0,64,64,canvas.width-64,((canvas.height/2)-32),64,64);
            stage_arrow++;
        }
        else if (stage_arrow === 10) {
            context.drawImage(next_stage,0,0,64,64,canvas.width-64-5,((canvas.height/2)-32),64,64);
            stage_arrow = 1;
        };

        if (player.x > canvas.width-100) {
            player.x = 64;
            player.y = (canvas.height/2) - 16;
            progress.wave++;         
            number = 0;
        };
    };

    //Handle key presses and set boundaries
    movement();

    //Stage Cleared
    if (progress.wave === 5) {
        clear_music.play();
        stage_cleared = true;
        stats.innerHTML = ""
        wave_display.innerHTML = "Stage 1 - Complete";
        stats.innerHTML = "You will be redirected shortly"
        delays.redirection--;
        console.log(delays.redirection)
        if (delays.redirection < 0) {
            send_progress();
            window.history.back();
        };
    };

    //Player Dies
    if (player.hp <= 0) {
        if (over_play != 0) {
            over.play();
            over_play--;
        }
        else {
            over.pause();
        };
        stats.innerHTML = "";
        wave_display.innerHTML = "YOU DIED";
        wave_display.style.color = "darkred";
        stats.innerHTML = "You will be redirected in a moment";
        delays.redirection--;
        console.log(delays.redirection)
        if (delays.redirection < 0) {
            send_progress();
            window.history.back();
        };
        stop();
    };
}

function randint(min, max, ex) {
    let ans = Math.round(Math.random() * (max - min)) + min;
    while (ans === ex) {
            ans = Math.round(Math.random() * (max - min)) + min;
    };
    return ans;
}

function activate(event) {
    let key = event.key;
    if (key === "p") {
        pause = true;
    }
    else if (key === "r") {
        pause = false;
    }
    if (key === " " && space_up === true) {
        space = true;
        space_up = false;
    }
    else if (key === " " && space_up === false) {
        space = false;
    };
    if (key === "1" && !abilities.time_stop.disabled) {
        one = true;
    } 
    else if (key === "2") {
        two = true;
    }
    if (key === "0") {
        slow_down = true;
    } 
    else if (key === "9") {
        speed_up = true;
    };
    if (key === "ArrowLeft" || key === "a") {
        moveLeft = true;
        facing();
    } else if (key === "ArrowUp" || key === "w") {
        moveUp = true;
        facing();
    } else if (key === "ArrowRight" || key === "d") {
        moveRight = true;
        facing();
    } else if (key === "ArrowDown" || key === "s") {
        moveDown = true;
        facing();
    };
}

function deactivate(event) {
    let key = event.key;
    if (key === " ") {
        space = false;
        space_up = true;
    };
    if (key === "0") {
        slow_down = false;
    } 
    else if (key === "9") {
        speed_up = false;
    };
    if (key === "ArrowLeft" || key === "a") {
        moveLeft = false;
    } else if (key === "ArrowUp" || key === "w") {
        moveUp = false;
    } else if (key === "ArrowRight" || key === "d") {
        moveRight = false;
    } else if (key === "ArrowDown" || key === "s") {
        moveDown = false;
    };
}

function shoot(e) {
    if (click) {
        let a = player.x+32-e.x+(e.size/2)
        let b = player.y+32-e.y+(e.size/2)
        let d = Math.sqrt(((a)**2+(b)**2))
        if (d < (3*canvas.width)/8) {
            if (mouse.x < e.x || mouse.x > (e.x + e.size) || mouse.y < e.y || mouse.y > (e.y + e.size)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}

function melee(e) {
    if (space && right || space && left) {
        if (128 >= ((e.y+e.size)-player.y) && ((e.y+e.size)-player.y) >= 0) {
            if (up && left || down && left) {
                up = false;
                down = false;
                left = true;
            }
            if (left) {
                dist = e.x-(player.x+64)
                if (-128 <= dist && dist <=0) {
                    return true;
                }
            }
            if (up && right || down && right) {
                up = false;
                down = false;
                right = true;
            }
            if (right) {
                dist = player.x-(e.x+e.size)
                if (-128 <= dist && dist <= 0) {
                    return true;
                }
            }
        }
    };
    if (space && up || space && down) {
        if (128 >= ((e.x+e.size)-player.x) && ((e.x+e.size)-player.x) >= 0) {
            if (up) {
                dist = e.y-(player.y+64)
                if (-128 <= dist && dist <= 0) {
                    return true;
                }
            }
            if (down) {
                dist = player.y-(e.y+e.size)
                if (-128 <= dist && dist <= 0) {
                    return true;
                }
            }
        }
    };
}

function collision_with(e) {
    if (!space && !(player.x + 64 < e.x || e.x + e.size < player.x || player.y > e.y + e.size || e.y > player.y + 64)) {
        return true;
    }
    else {
        return false;
    };
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function () {
        console.log("loaded")
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        };
    };

    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url
    }
}

function generate_tiles() {
    if (progress.wave === 1 || progress.wave === 2) {
        for (let r = 0; r < background.length; r += 1) {
            for (let c = 0; c < background[0].length; c += 1) {
                let value = background[r][c] % 18
                context.drawImage(bg,32*value,0,32,32,c*32,r*32,32,32)
            };
        };
    }
    else if (progress.wave === 3) {
        for (let r = 0; r < background.length; r += 1) {
            for (let c = 0; c < background[0].length; c += 1) {
                context.drawImage(bg,32*16,0,32,32,c*32,r*32,32,32)
            }
        }
    }
    else if (progress.wave === 4 || progress.wave === 5) {
        for (let r = 0; r < background.length; r += 1) {
            for (let c = 0; c < background[0].length; c += 1) {
                let value = background[r][c]
                if (value === 50) {
                    context.drawImage(bg,32*18,0,32,32,c*32,r*32,32,32)
                    //console.log("Lava Tile at: "+c*32+" "+r*32);
                }
                else {
                    context.drawImage(bg,32*17,0,32,32,c*32,r*32,32,32)
                }
                
            }
        }
    };
}

function facing() {
    if (moveRight) {
        right = true;
    } else {
        right = false;
    };
    if (moveLeft) {
        left = true;
    } else {
        left = false;
    };
    if (moveUp) {
        up = true;
    } else {
        up = false;
    };
    if (moveDown) {
        down = true;
    } else {
        down = false;
    }
}

function attack_animation() {
    if (!space) {
        context.drawImage(playerImage, player.frameX*player.width, 
            player.frameY*player.height, player.width, player.height,
            player.x, player.y, player.width*2, player.height*2);
    } else if (space && right) {
        context.drawImage(playerImage, 1*player.width, 
            (7*player.height)+1, player.width, player.height+1,
            player.x, player.y, player.width*2, player.height*2);
    } else if (space && up) {
        context.drawImage(playerImage, 1*player.width, 
            8*player.height, player.width, player.height,
            player.x, player.y, player.width*2, player.height*2);
    } else if (space && down) {
        context.drawImage(playerImage, 1*player.width, 
            6*player.height, player.width, player.height,
            player.x, player.y, player.width*2, player.height*2);
    } else if (space && left) {
        context.drawImage(playerImage, 3*player.width, 
            7*player.height, player.width, player.height,
            player.x, player.y, player.width*2, player.height*2);
    };
}

function animate_player() {
    if (moveRight) {
        player.frameX = (player.frameX+1) % 6
    };
    if (moveLeft) {
        player.frameX = 5 - (player.frameX+1) % 6
    };
    if (moveDown) {
        player.frameX = (player.frameX+1) % 6
    };
    if (moveUp) {
        player.frameX = (player.frameX+1) % 6
    };
}

function hp_bar(a) {
    context.strokeStyle = "black"
    context.lineWidth = 6
    context.beginPath();
    context.moveTo(a.x+5,a.y+a.size);
    context.lineTo(a.x+a.size-5,a.y+a.size);
    context.stroke();
    if (a.hp > 0) {
        let hp = a.hp/a.max_hp;
        context.strokeStyle = "red"
        context.lineWidth = 6
        context.beginPath();
        context.moveTo(a.x+5,a.y+a.size);
        context.lineTo(a.x+((a.size-5)*hp),a.y+a.size);
        context.stroke();
    }
}

function get_coords(event) {
    let map = document.querySelector("canvas");
    let coords = map.getBoundingClientRect();
    mouse.x = event.clientX-coords.left+7;
    mouse.y = event.clientY-coords.top+7;
    let a = player.x+32-mouse.x
    let b = player.y+32-mouse.y
    let d = Math.sqrt(((a)**2+(b)**2))
    if ((d < (3*canvas.width)/8) && (mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height) 
        && !abilities.shoot.disabled) {
        click = true;
        abilities.shoot.disabled = true;
        abilities.shoot.cool_down = 0;
    };
}

function erase(event) {
    mouse.x = null;
    mouse.y = null;
    click = false;
    cursor = document.querySelector("canvas")
    cursor.style.cursor = "url(static/cross_whole_hit.png), auto"
} 

function movement() {
    if (moveRight) {
        player.frameY = 4;
        if (player.x + 48 <= canvas.width) {
            player.x = player.x + 10;
        }
        player.x = player.x
    };
    if (moveUp) {
        player.frameY = 5;
        if (player.y > 0) {
            player.y = player.y - 10;
        }
        player.y = player.y
    };
    if (moveDown) {
        player.frameY = 3;
        if (player.y + 48 <= canvas.height) {
            player.y = player.y + 10;
        }
        player.y = player.y
    };
    if (moveLeft) {
        player.frameY = 9;
        if (player.x + 16 > 0) {
            player.x = player.x - 10;
        }
        player.x = player.x
    };
}

function ability_status() {
    if (!abilities.time_stop.disabled && abilities.time_stop.duration != 0) {
        let duration = abilities.time_stop.duration/60
        context.strokeStyle = "blue"
        context.lineWidth = 6
        context.beginPath();
        context.moveTo(player.x+5,player.y-5);
        context.lineTo(player.x+5+((player.size)/3)*duration,player.y-5);
        context.stroke();
    }
    if (!abilities.heal.disabled) {
        context.strokeStyle = "green"
        context.lineWidth = 6
        context.beginPath();
        context.moveTo(player.x+((player.size)/3),player.y-5);
        context.lineTo(player.x+(2*(player.size)/3),player.y-5);
        context.stroke();
    }
    if (!abilities.shoot.disabled) {
        context.strokeStyle = "orange"
        context.lineWidth = 6
        context.beginPath();
        context.moveTo(player.x+(2*(player.size)/3),player.y-5);
        context.lineTo(player.x+((player.size))-5,player.y-5);
        context.stroke();
    }
    //The shooting cool down was weird, didn't know where to place it so I left it here
    else if (abilities.shoot.disabled && abilities.shoot.cool_down < 50) {
        abilities.shoot.cool_down++;
    }
    else if (abilities.shoot.disabled && abilities.shoot.cool_down === 50) {
        abilities.shoot.cool_down = 50;
        abilities.shoot.disabled = false;
    }
}

function heal() {
    if (player.hp > 0) {
        if (two && !abilities.heal.disabled) {
            if ((player.max_hp - player.hp) > abilities.heal.amount) {
                player.hp += abilities.heal.amount;
                console.log("Healed for "+abilities.heal.amount);
            }
            else {
                player.hp += player.max_hp - player.hp
                console.log("Healed for "+(player.max_hp - player.hp));
            }
            healed.play()
            abilities.heal.disabled = true;
            abilities.heal.cool_down = 0;
            two = false;
        }
        else if (abilities.heal.disabled && abilities.heal.cool_down < 300) {
            abilities.heal.cool_down++;
            console.log("Heal on cool down for "+(abilities.heal.cool_down)+"/300")
        }
        else if (abilities.heal.disabled && abilities.heal.cool_down == 300) {
            abilities.heal.disabled = false;
        }
    };
}

function stop_movement() {
    if (space && (moveRight || moveLeft || moveDown || moveUp)) {
        if (delays.stop_swing === 0) {
            space = false;
            delays.stop_swing = 2;
        }
        else if (delays.stop_swing > 0) {
            delays.stop_swing--;
        }
    }
}

function stop() {
    window.cancelAnimationFrame(request_id);
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("mousedown", get_coords, false);
}

function send_progress() {
    if (xhttp_send === 1) {
        xhttp_send--;
        let data = new FormData();
        data.append("stage_cleared", stage_cleared);
        data.append("stage_no", progress.stage);

        xhttp = new XMLHttpRequest();
        xhttp.addEventListener("readystatechange", handle_response, false)
        xhttp.open("POST", "/store_progress", true);
        xhttp.send(data);
    };
}

function handle_response() {
    if (xhttp.readySate === 4) {
        if (xhttp.readySate === 200) {
            if (xhttp.responseText === "success") {
                console.log("yes");
            }
            else {
                console.log("no");
            };
        };
    };
}