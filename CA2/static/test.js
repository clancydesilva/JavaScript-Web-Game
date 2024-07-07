let x = 10
if (0 < x < 20) {
    console.log("True")
};

if ((r === 10 && c === 30) || (r === 11 && c === 30)) {
    context.drawImage(bg,0,0,32,32,c*32,r*32,32,32)
}

    //Obstacle Stage
    if (wave === 3 && arrow_wave != 5 && arrows.length === 0) {
        console.log("Arrow Wave: "+arrow_wave)
        if (arrow_wave === 1) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : randint(64,894,0),
                    y : 0,
                    move : 20,
                    size : 32,
                    limit : canvas.height
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave === 2) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : canvas.width,
                    y : randint(64,576,0),
                    move : -20,
                    size : 32,
                    limit : 0
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave === 3) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : randint(64,894,0),
                    y : canvas.height,
                    move : -20,
                    size : 32,
                    limit : 0
                };
                arrows.push(a);
            };
        }
        else if (arrow_wave === 4) {
            for (let i = 0; i < 10; i++) {
                let a = {
                    x : 0,
                    y : randint(64,576,0),
                    move : 20,
                    size : 32,
                    limit : canvas.width
                };
                arrows.push(a);
            };
        };
    };

    //Animate arrows
    for (let a of arrows) {
        context.drawImage(arrow,0,0,32,32,a.x,a.y,64,64)
    };
    for (let a of arrows) {
        if (a.limit === canvas.height) {
            console.log("first time: 1, second time: 3")
            check = a.y;
            a.y = a.y + a.move;
        }
        else if (a.limit === canvas.width) {
            console.log("first time: 2, second time: 4")
            check = a.x;
            a.x = a.x + a.move;
        }
        if (check > a.limit) {
            arrows.splice(arrows.indexOf(a),1)
            if (arrows.length === 0) {
                arrow_wave++
            };
        };  
    };