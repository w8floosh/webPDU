var blocknum = 0;
function echo(toprint){
    var screen = document.getElementsByClassName("screen")[0];
    if (toprint != "<br>") blocknum++;
    var stampa = document.createElement("div");
    stampa.contentEditable = false;
    stampa.innerHTML = toprint;
    stampa.className = "reply";
    stampa.id = "text" + blocknum;
    screen.appendChild(stampa);
    blocknum++;
    var newline = document.createElement("div");
    newline.contentEditable = true;
    newline.id = "text" + blocknum;
    newline.className = "text";
    screen.appendChild(newline);
    screen.scrollTop = screen.scrollHeight;
    if (blocknum > 100){
        screen.removeChild(screen.firstElementChild);
    }
}
function clear(){
    var screen = document.getElementsByClassName("screen")[0];
    screen.replaceChildren();
    blocknum = -1;
    echo("<br>");
    screen.removeChild(screen.firstElementChild);

}
function batman(){
    var video = document.createElement("video");
    video.controls = false;
    var sorgente = document.createElement("source");
    sorgente.src = "/assets/media/video/batman.mp4";
    sorgente.type = "video/mp4";
    var screen = document.getElementsByClassName("screen")[0];
    screen.appendChild(video);
    video.appendChild(sorgente);
    video.style.position = "absolute";
    video.style.top = "0px";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "fill";
    video.play();
    video.onended = function (){
        video.remove();
        clear();
    }
}

function shutdown(){
    var shutdown_audio = document.createElement("audio");
    shutdown_audio.src = "/assets/media/audio/shutdown.mp3";
    shutdown_audio.controls = false;
    document.body.style.backgroundImage = "url('/assets/media/images/shutdown.jpg')";
    document.body.style.backgroundSize = "contain";
    document.body.style.backgroundColor = "none";
    document.body.style.backgroundPosition = "center center";
    shutdown_audio.play();
    document.getElementById("terminal").remove();
    shutdown_audio.onended = function (){
        location.href = "index.html";
    }

}
function parseCalc(text){
    var result = text[0];
    for (let i = 1; i < text.length-1; i=i+2){
        result = calc(Number(result), text[i], Number(text[i+1]))
    }
    echo(result);
}

function calc(num1, op, num2){
    var risultato;
    switch (op){
        case '+': risultato = num1+num2;
        break;
        case '-': risultato = num1-num2;
        break;
        case '/': risultato = num1/num2;
        break;
        case '*': risultato = num1*num2;
        break;
        default:  risultato = "Sintassi: num1 op num2 [op num3] [...] (op deve essere + - / *)";
        break;
    }
    return risultato;
}
// 3 + 5 + 5 + 7
function commandParser(toparse){
    if (toparse == "") return;
    var text = toparse.split(" ");
    var command = text.shift();
    switch(command){
        case "echo":    echo(text.join(" "));
        break;
        case "calc":    parseCalc(text);
        break;
        case "help":
            echo( `Comandi disponibili: <br>
            clear <br>
            echo text <br>
            calc num1 op num2 [op num3] [...] <br>
            batman <br>
            shutdown <br>`);
        break;
        case "batman":      batman();
        break;
        case "clear":       clear();
        break;
        case "shutdown":    shutdown();
        break;
        default:            echo("Comando sconosciuto");
        break;
    }
}



document.addEventListener("keypress", function (e){
    if (e.code == "Enter"){
        var text = document.getElementById("text" + blocknum);
        if (text.textContent == "") echo("<br>");
        text.contentEditable = false;
        var toparse = text.textContent;
        commandParser(toparse);
    }
});