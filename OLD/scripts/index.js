// var i = 0;
// var txt = 'RGSW Digital Genius : Site Version 0.2';
// var speed = 20;
// 
// function run() {
//     if (i < txt.length) {
//         document.getElementById("text").innerHTML += txt.charAt(i);
//         i++;
//         setTimeout(type, speed);
//     }
// }

function openForm() {
    document.getElementById("updatePopup").style.display = "block";
}
  
function closeForm() {
    document.getElementById("updatePopup").style.display = "none";
}
  
window.onload = openForm;
