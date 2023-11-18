var i = 0;
var txt = 'RGSW Digital Genius : Site Version 0.2';
var speed = 20;

function type() {
    if (i < txt.length) {
        document.getElementById("text").innerHTML += txt.charAt(i);
        i++;
        setTimeout(type, speed);
    }
}

window.onload = type;
