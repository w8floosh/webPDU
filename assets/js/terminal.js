var blocknum = 0;
var started = false;


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

function nanana(){
    var container = document.getElementById("nanana");
    if (container.children.length == 10)    container.removeChild(container.firstElementChild);
    var na = document.createElement("div");
    na.style.color = '#'+Math.floor(Math.random()*16777215).toString(16);
    na.textContent = "NA";
    na.style.textAlign = "center";
    na.style.verticalAlign = "center";
    container.appendChild(na);
}

function print_nanana(stop, interval){
    if (!stop){
        interval.value = setInterval(nanana, 50);
        console.log(interval.value);
    }
    else            setTimeout(print_nanana, 1300, false, interval);      
}

function batman(){
    var bg = setInterval( 
        () => { document.body.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);}
        , 200);
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
    var nanana_container = document.createElement("div");
    nanana_container.id = "nanana";
    document.body.prepend(nanana_container);
    var interval = { value: 0 };

    print_nanana(true, interval);
    video.onended = function (){
        console.log(interval.value);
        clearInterval(interval.value);
        clearInterval(bg);
        video.remove();
        clear();
        nanana_container.remove();
        document.body.style.backgroundColor = "blueviolet";
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


var btn = document.getElementsByClassName("button_close")[0];
btn.addEventListener("click", () => { shutdown(); });
document.addEventListener("keypress", function (e){
    if (e.code == "Enter" && started){
        var text = document.getElementById("text" + blocknum);
        if (text.textContent == "") echo("<br>");
        text.contentEditable = false;
        var toparse = text.textContent;
        commandParser(toparse);
    }
});

document.addEventListener("keypress", function (e){
    if (e.code == "Space" && !started){
        var startup = new Audio("/assets/media/audio/startup.mp3");
        startup.play();
        startup.onended = () => {
            document.getElementById("welcome").remove();
            started = true;
        }
    }
}, {once: true});