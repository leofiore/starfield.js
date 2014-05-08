/* 
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
 *                    Version 2, December 2004 
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 
 *
 * Everyone is permitted to copy and distribute verbatim or modified 
 * copies of this license document, and changing it is allowed as long 
 * as the name is changed. 
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 *
 * __author__: leonardo http://github.com/leofiore
 */


(function(){
"use strict";
var canvas = document.getElementById('starfield'),
    ctx = canvas.getContext('2d'),
    c_height = parseInt(canvas.getAttribute('height'), 10),
    c_width = parseInt(canvas.getAttribute('width'), 10),
    c_x = Math.round(c_width / 2),
    c_y = Math.round(c_height / 2),
    fps = 20, // We love it VINTAGE;
    interval = 1000/fps,
    lastframe = Date.now(),

    point = function(){
        var x = ~~(Math.random() * c_width),
            y = ~~(Math.random() * c_height),
            distance = { 
                x: (x > c_x? x - c_x: c_x - x),
                y: (y > c_y? y - c_y: c_y - y)
            },
            rand_size = ~~(Math.random() * 2) + 1;

        return {
            x: x,
            y: y,
            distance: distance,
            speed: { // pretty sure this calculation is not the one used
                     // for the original starfield
                x: (distance.x + 1) / (distance.x < c_x/4 ? 3 :6),
                y: (distance.y + 1) / (distance.x < c_y/4 ? 3 :6)
            }, 
            direction: {
                x: (x > c_x? 1: -1),
                y: (y > c_y? 1: -1)
            },
            size: {
                w: (distance.x < c_x/4 ? rand_size: 1), 
                h: (distance.y < c_y/4 ? rand_size: 1),
                factor: (distance.y < c_y/4 && distance.x < c_x/4? 0.02: 0.008)
            },
            move: function(){
                this.x += this.speed.x * this.direction.x;
                this.y += this.speed.y * this.direction.y;
                this.size.w += this.size.factor;
                this.size.h += this.size.factor;
                this.speed.x += 0.05;
                this.speed.y += 0.05;
            }
        };
    },
    stars = (function(){ // preload of starz
        var ret = [];
        while (ret.length < ~~(Math.random() * 100) + 100)
            ret.push(point());
        return ret;
    })();

    function step(){
        var now = Date.now(),
            rm = [];

        if (now - lastframe < interval)
            return window.requestAnimationFrame(step);

        lastframe = Date.now();
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c_width, c_height);
        ctx.fillStyle = "#ffffff";
        stars.forEach(function(el, idx, ar){
            el.move();
            if ((el.x < 0 ||  el.x > c_width) ||
                (el.y < 0 || el.y > c_height)) {
                rm.push(idx);
            }
            else {
                ctx.fillRect(el.x, el.y, el.size.w, el.size.h);
            }

        });
        while (rm.length)
            stars.splice(rm.pop(), 1);
        while (stars.length < ~~(Math.random() * 100) + 100)
            stars.push(point());
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
})();
