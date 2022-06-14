var system;
var canvases = [];

class System{
    desktop;
    start;
    running;
    clock;
    clock_interval;
    memos;

    constructor(){
        document.getElementById("welcome").remove();

        var startbar = document.createElement("div");
        var start = document.createElement("button");
        var clock = document.createElement("button");
        var running_apps = document.createElement("div");
        var desktop = document.createElement("div");
        var memos = document.createElement("div");
        var app;


        startbar.id = "startbar";
        start.id = "start";
        start.textContent = "start";
        clock.id = "clock";
        running_apps.id = "running";
        desktop.className = "desktop";
        memos.className = "memo_grid";

        document.body.replaceChildren(startbar, desktop, memos);
        startbar.replaceChildren(start, running_apps, clock);

        app = document.createElement("button");
        app.className = "launcher";
        app.id = "shell_launcher";
        app.style.backgroundImage = "url(/assets/media/icons/terminal.png)";
        app.innerHTML = "<span>Terminal</span>";
        desktop.appendChild(app);
        app = document.createElement("button");
        app.className = "launcher";
        app.id = "whiteboard_launcher";
        app.style.backgroundImage = "url(/assets/media/icons/whiteboard.png)";
        app.innerHTML = "<span>Whiteboard</span>";
        desktop.appendChild(app);
        app = document.createElement("button");
        app.className = "launcher";
        app.id = "tris_launcher";
        app.style.backgroundImage = "url(/assets/media/icons/tris.png)";
        app.innerHTML = "<span>Tic Tac Toe</span>";
        desktop.appendChild(app);
        app = document.createElement("button");
        app.className = "launcher";
        app.id = "hilo_launcher";
        app.style.backgroundImage = "url(/assets/media/icons/hilo.svg)";
        app.style.backgroundSize = "40px";  
        app.innerHTML = "<span>Hi-Lo</span>";
        desktop.appendChild(app);
        app = document.createElement("button");
        app.className = "launcher";
        app.id = "memo_launcher";
        app.style.backgroundImage = "url(/assets/media/icons/memo.png)";
        app.innerHTML = "<span>Promemoria</span>";
        desktop.appendChild(app);

        this.start = start;
        this.clock = clock;
        this.running = running_apps;
        this.desktop = desktop;
        this.memos = memos;
        this.time();
        this.clock_interval = setInterval(this.time, 2000);

        this.start.onclick = () => { 
            clearInterval(this.clock_interval);
            this.shutdown(); 
        }
    }

    closeApp(app){
        app.proc.remove();
        app.window.remove();
    }
    
    launchApp(type_id){
        var window;
        console.log(type_id);
        switch(type_id){
            case "shell_launcher":
                window = new Terminal();
                break;
            case "tris_launcher":
                window = new TicTacToe();
                break;
            case "whiteboard_launcher":
                window = new Whiteboard();
                break;
            case "hilo_launcher":
                window = new HiLo();
                break;
            case "memo_launcher":
                window = new Memo();
                break;
        }
    }

    time() {
        var currentdate = new Date();
        var time = (currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours() + ":" + ((currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes());
        this.clock.innerHTML = time;
    }
    
    shutdown(){
        var shutdown_audio = document.createElement("audio");
        shutdown_audio.src = "/assets/media/audio/shutdown.mp3";
        shutdown_audio.controls = false;
        document.body.replaceChildren();
        document.body.style.backgroundImage = "url('/assets/media/images/shutdown.jpg')";
        document.body.style.backgroundSize = "100% 100%";
        document.body.style.backgroundColor = "none";
        document.body.style.backgroundPosition = "center center";
        shutdown_audio.play();
        
        shutdown_audio.onended = function (){
            window.location.href = "/";
        }
    }

    dragElement(elmnt) {
        console.log(elmnt);
        var newpos_x = 0, newpos_y = 0, oldpos_x = 0, oldpos_y = 0;
        elmnt.bar.onmousedown = dragMouseDown;
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          oldpos_x = e.clientX;
          oldpos_y = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          newpos_x = oldpos_x - e.clientX;
          newpos_y = oldpos_y - e.clientY;
          oldpos_x = e.clientX;
          oldpos_y = e.clientY;
          // set the element's new position:
          elmnt.window.style.top = (elmnt.window.offsetTop - newpos_y) + "px";
          elmnt.window.style.left = (elmnt.window.offsetLeft - newpos_x) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

    enableControls(elmnt){
        var close = elmnt.bar.getElementsByClassName("button_close")[0];
        var maximize = elmnt.bar.getElementsByClassName("button_maximize")[0];
        var minimize = elmnt.bar.getElementsByClassName("button_minimize")[0];
        close.addEventListener("click", () => { 
            this.closeApp(elmnt);
        });
        maximize.addEventListener("click", () => {
            
            elmnt.window.style.top = 0;
            elmnt.window.style.left = 0;
            elmnt.window.style.width = (elmnt.window.style.width == "100%" ? 
                (elmnt.window.style.width = elmnt.window.style.minWidth) : elmnt.window.style.width = "100%");
            elmnt.window.style.height = (elmnt.window.style.height == "calc(100% - 30px)" ? 
                (elmnt.window.style.height = elmnt.window.style.minHeight) : elmnt.window.style.height = "calc(100% - 30px)");
        });
        minimize.addEventListener("click", () => {
            elmnt.window.style.display = "none";
        });
        elmnt.proc.addEventListener("click", () => {
            (elmnt.window.style.display == "none") ? 
                elmnt.window.style.display = "block" : 
                elmnt.window.style.display = "none";
        });
    }
    createProcess(elmnt, icon, name){
        var process = document.createElement("button");
        var process_name = document.createElement("span");
        var process_icon = document.createElement("span");
        process_icon.style.backgroundImage = icon;
        process.className = "process";
        process_icon.className = "process_icon";
        process_name.innerHTML = name;
        process.appendChild(process_icon);
        process.appendChild(process_name);
        elmnt.proc = process;
        system.running.appendChild(elmnt.proc);
    }
    
    drawWindow(elmnt, icon, name){
        var window = document.createElement("div");
        var control_bar = document.createElement("div");
        var close = document.createElement("button");
        var minimize = document.createElement("button");
        var maximize = document.createElement("button");
        var title = document.createElement("div");
        control_bar.className = "bar";
        close.className = "button_close";
        minimize.className = "button_minimize";
        maximize.className = "button_maximize";
        close.innerHTML = "X";
        minimize.innerHTML = "-";
        maximize.innerHTML = "O";

        title.className = "title";
        title.textContent = name;

        window.replaceChildren(control_bar);
        control_bar.replaceChildren(icon, title, close, maximize, minimize);
        document.body.appendChild(window);
        
        elmnt.bar = control_bar;
        return window;
    }
}

class Terminal{
    window;
    screen;
    bar;
    tosend;
    proc;

    constructor() {
        var window;
        var screen = document.createElement("div");
        var text = document.createElement("div");
        var icon = document.createElement("div");

        screen.className = "screen";
        text.contentEditable = "true";
        text.className = "text";
        icon.className = "icon";
        icon.style.backgroundImage = "url(/assets/media/icons/terminal.png)";
        screen.appendChild(text);

        var window = system.drawWindow(this, icon, "Terminal");
        window.className = "terminal";
        window.prepend(screen);

        this.window = window;
        this.screen = screen;
        this.tosend = this.screen.getElementsByClassName("text")[(screen.children.length)-1];

        window.addEventListener("keydown", e => { 
            if (e.code == "Enter"){
                if (this.tosend.textContent == "") echo("<br>");
                this.tosend.contentEditable = false;
                this.commandParser(this.tosend.textContent);
            }
        });

        window.addEventListener("click", () => {
            var windows = document.body.children;
            var array = Array.from(windows);
            array.shift();
            array.shift();
            for (let x of array)    x.style.zIndex = 0;
            this.window.style.zIndex = 1;
        })

        system.dragElement(this);
        system.createProcess(this, "url(/assets/media/icons/terminal.png)", "Terminal");
        system.enableControls(this);
    }

    echo(toprint){
        var stampa = document.createElement("div");
        stampa.contentEditable = false;
        stampa.innerHTML = toprint;
        stampa.className = "reply";
        this.screen.appendChild(stampa);
        var newline = document.createElement("div");
        newline.contentEditable = true;
        newline.className = "text";
        this.screen.appendChild(newline);
        this.screen.scrollTop = this.screen.scrollHeight;
        if (this.screen.children.length > 100){
            this.screen.removeChild(this.screen.firstElementChild);
        }
        this.tosend = newline;
    }

    clear(){
        this.screen.replaceChildren();
        echo("<br>");
        this.screen.removeChild(this.screen.firstElementChild);
    }

    nanana(){
        var container = document.getElementById("nanana");
        if (container.children.length == 10)    container.removeChild(container.firstElementChild);
        var na = document.createElement("div");
        na.style.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        na.textContent = "NA";
        na.style.textAlign = "center";
        na.style.verticalAlign = "center";
        container.appendChild(na);
    }
    
    print_nanana(stop, interval){
        if (!stop){
            interval.value = setInterval(this.nanana, 50);
            console.log(interval.value);
        }
        else            setTimeout(this.print_nanana, 1300, false, interval);      
    }
    
    batman(){
        var bg = setInterval( 
            () => { document.body.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);}
            , 200);
        var video = document.createElement("video");
        video.controls = false;
        var sorgente = document.createElement("source");
        sorgente.src = "/assets/media/video/batman.mp4";
        sorgente.type = "video/mp4";
        this.screen.appendChild(video);
        video.appendChild(sorgente);
        video.style.position = "absolute";
        video.style.top = "0px";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "fill";
        video.play();
        var nanana_container = document.createElement("div");
        nanana_container.id = "nanana";
        this.window.prepend(nanana_container);
        var interval = { value: 0 };
    
        this.print_nanana(true, interval);
        video.onended = () => {
            console.log(interval.value);
            clearInterval(interval.value);
            clearInterval(bg);
            video.remove();
            this.clear();
            nanana_container.remove();
            document.body.style.backgroundColor = "blueviolet";
        }
    }

    parseCalc(text){
        var result = text[0];
        for (let i = 1; i < text.length-1; i=i+2){
            result = this.calc(Number(result), text[i], Number(text[i+1]))
        }
        this.echo(result);
    }
    
    calc(num1, op, num2){
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
    
    commandParser(toparse){
        if (toparse == "") return;
        var text = toparse.split(" ");
        var command = text.shift();
        switch(command){
            case "echo":    this.echo(text.join(" "));
            break;
            case "calc":    this.parseCalc(text);
            break;
            case "help":
                echo( `Comandi disponibili: <br>
                clear <br>
                echo text <br>
                calc num1 op num2 [op num3] [...] <br>
                batman <br>
                shutdown <br>`);
            break;
            case "batman":      this.batman();
            break;
            case "clear":       this.clear();
            break;
            case "shutdown":    this.shutdown();
            break;
            default:            this.echo("Comando sconosciuto");
            break;
        }
    }

}

class Whiteboard{
    window;
    canvas;
    bar;
    tool_picker;
    color_picker;
    proc;

    constructor(){
        var window;
        var wb_interface = document.createElement("div");
        var whiteboard = document.createElement("canvas");
        var icon = document.createElement("div");
        var tools = document.createElement("div");
        var colors = document.createElement("div");
        whiteboard.className = "paint_area";
        whiteboard.id = whiteboard.className + document.body.children.length;
        wb_interface.className = "wb_interface";
        tools.className = "tool_picker";
        colors.className = "color_picker";
        icon.className = "icon";
        icon.style.backgroundImage = "url(/assets/media/icons/whiteboard.png)";

        window = system.drawWindow(this, icon, "Whiteboard");
        window.className = "whiteboard";

        window.appendChild(wb_interface);
        wb_interface.replaceChildren(tools, colors, whiteboard);

        this.window = window;
        this.tool_picker = tools;
        this.color_picker = colors;

        this.canvas = new fabric.Canvas(whiteboard.id);
        canvases.push(this.canvas);
        this.canvas.setWidth(whiteboard.width);
        this.canvas.setHeight(whiteboard.height);

        system.dragElement(this);
        system.createProcess(this, icon, "Whiteboard");
        system.enableControls(this);

        window.addEventListener("click", () => {
            var windows = document.children;
            var array = Array.from(windows);
            array.shift();
            array.shift();
            for (let x of array)    x.window.style.zIndex = 0;
            this.window.style.zIndex = 1;
        });
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.width = 5;
        this.canvas.freeDrawingBrush.color = "#FF0000";
    }

}

class TicTacToe{
    window;
    bar;
    game_info;
    grid;
    proc;

    constructor(){
        var window;
        var tttscreen = document.createElement("div");
        var icon = document.createElement("div");
        var tttgrid = document.createElement("div");
        var tttinfo = document.createElement("div"); 
        var cells;

        tttgrid.className = "tttgrid";
        tttinfo.className = "tttinfo";
        tttscreen.className = "tttscreen";
        icon.className = "icon";
        icon.style.backgroundImage = "url(/assets/media/icons/tris.png)";


        window = system.drawWindow(this, icon, "Tic Tac Toe");
        window.className = "tictactoe";
        tttscreen.replaceChildren(tttinfo, tttgrid);
        window.replaceChildren(this.bar, tttscreen);

        this.window = window;
        this.grid = tttgrid;
        this.game_info = tttinfo;

        for (let i = 0; i<9; i++){
            var cell = document.createElement("button");
            cell.className = "cell";
            this.grid.appendChild(cell);
        }
        cells = this.grid.getElementsByClassName("cell");
        this.enableButtons(cells);
        
        system.dragElement(this);
        system.createProcess(this, "url(/assets/media/icons/tris.png)", "Tic Tac Toe");
        system.enableControls(this);

        window.addEventListener("click", () => {
            var windows = document.children;
            var array = Array.from(windows);
            array.shift();
            array.shift();
            for (let x of array)    x.window.style.zIndex = 0;
            this.window.style.zIndex = 1;
        });
    }

    playerMove(cells, i){
        console.log("clicked on button " + i);
        cells[i].innerHTML = "O";
        this.disableButtons(cells);
        this.switchPlayer(cells);
    }
    enableButtons(cells){

        for (let i = 0; i<9; i++){
            if (cells[i].innerHTML == "") cells[i].addEventListener("click", () => this.playerMove(cells, i));
            this.game_info.textContent = "Player's turn";
        }
    }
    disableButtons(cells){
        let i;
        function foo() { this.playerMove(cells, i)};
        for (let i = 0; i<9; i++){
            cells[i].replaceWith(cells[i].cloneNode(true));
        }
    }
    switchPlayer(cells){
        this.game_info.textContent = "Opponent's turn"; 
        setTimeout(() => this.opponentTurn(cells), 1000);
    }

    opponentTurn(cells){
        this.game_info.textContent = "Checking possible moves...";
        this.opponentMove(cells);
        this.game_info.textContent = "Player's turn";
        this.enableButtons(cells);
    }

    opponentMove(cells){
        var i;
        var endgame = true;
        this.checkVert(cells);
        this.checkHoriz(cells);
        this.checkDiag(cells);

        for (let x of cells){
            if (x.innerHTML == ""){
                endgame = false;
                break;
            }
        }
        if (endgame == true)    return this.checkResult(cells);

        while ((i = Math.floor(Math.random()*9)) >= 0){
            if (cells[i].innerHTML == ''){
                cells[i].innerHTML = "X";
                return;
            }  
        }
    }
    checkHoriz(cells){
        if      (
                ((cells[0].innerHTML == "X" && cells[1].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[1].innerHTML == "O")) && cells[2].innerHTML == "") cells[2].innerHTML = "X"
        else if (
                ((cells[0].innerHTML == "X" && cells[2].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[2].innerHTML == "O"))  && cells[1].innerHTML == "") cells[1].innerHTML = "X"
        else if (
                ((cells[1].innerHTML == "X" && cells[2].innerHTML == "X")
                    ||
                (cells[1].innerHTML == "O" && cells[2].innerHTML == "O")) && cells[0].innerHTML == "") cells[0].innerHTML = "X"
        else if (
                ((cells[3].innerHTML == "X" && cells[4].innerHTML == "X")
                    ||
                (cells[3].innerHTML == "O" && cells[4].innerHTML == "O")) && cells[5].innerHTML == "") cells[5].innerHTML = "X"
        else if (
                ((cells[3].innerHTML == "X" && cells[5].innerHTML == "X")
                    ||
                (cells[3].innerHTML == "O" && cells[5].innerHTML == "O")) && cells[4].innerHTML == "") cells[4].innerHTML = "X"
        else if (
                ((cells[4].innerHTML == "X" && cells[5].innerHTML == "X")
                    ||
                (cells[4].innerHTML == "O" && cells[5].innerHTML == "O")) && cells[3].innerHTML == "") cells[3].innerHTML = "X"
        else if (
                ((cells[6].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                (cells[6].innerHTML == "O" && cells[7].innerHTML == "O")) && cells[8].innerHTML == "") cells[8].innerHTML = "X"
        else if (
                ((cells[6].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[6].innerHTML == "O" && cells[8].innerHTML == "O")) && cells[7].innerHTML == "") cells[7].innerHTML = "X"
        else if (
                ((cells[7].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[7].innerHTML == "O" && cells[8].innerHTML == "O")) && cells[6].innerHTML == "") cells[6].innerHTML = "X"
        
    }
    checkVert(cells){
        if      (
                ((cells[0].innerHTML == "X" && cells[3].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[3].innerHTML == "O")) && cells[6].innerHTML == "") cells[6].innerHTML = "X"
        else if (
                ((cells[0].innerHTML == "X" && cells[6].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[6].innerHTML == "O"))  && cells[3].innerHTML == "") cells[3].innerHTML = "X"
        else if (
                ((cells[3].innerHTML == "X" && cells[6].innerHTML == "X")
                    ||
                (cells[3].innerHTML == "O" && cells[6].innerHTML == "O")) && cells[0].innerHTML == "") cells[0].innerHTML = "X"
        else if (
                ((cells[1].innerHTML == "X" && cells[4].innerHTML == "X")
                    ||
                (cells[1].innerHTML == "O" && cells[4].innerHTML == "O")) && cells[7].innerHTML == "") cells[7].innerHTML = "X"
        else if (
                ((cells[1].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                (cells[1].innerHTML == "O" && cells[7].innerHTML == "O")) && cells[4].innerHTML == "") cells[4].innerHTML = "X"
        else if (
                ((cells[4].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                (cells[4].innerHTML == "O" && cells[7].innerHTML == "O")) && cells[1].innerHTML == "") cells[1].innerHTML = "X"
        else if (
                ((cells[2].innerHTML == "X" && cells[5].innerHTML == "X")
                    ||
                (cells[2].innerHTML == "O" && cells[5].innerHTML == "O")) && cells[8].innerHTML == "") cells[8].innerHTML = "X"
        else if (
                ((cells[2].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[2].innerHTML == "O" && cells[8].innerHTML == "O")) && cells[5].innerHTML == "") cells[5].innerHTML = "X"
        else if (
                ((cells[5].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[5].innerHTML == "O" && cells[8].innerHTML == "O")) && cells[2].innerHTML == "") cells[2].innerHTML = "X"
    
    }
    checkDiag(cells){
        if      (
                ((cells[0].innerHTML == "X" && cells[4].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[4].innerHTML == "O")) && cells[8].innerHTML == "") cells[8].innerHTML = "X"
        else if (
                ((cells[0].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[0].innerHTML == "O" && cells[8].innerHTML == "O"))  && cells[4].innerHTML == "") cells[4].innerHTML = "X"
        else if (
                ((cells[4].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                (cells[4].innerHTML == "O" && cells[8].innerHTML == "O")) && cells[0].innerHTML == "") cells[0].innerHTML = "X"
        else if (
                ((cells[2].innerHTML == "X" && cells[4].innerHTML == "X")
                    ||
                (cells[2].innerHTML == "O" && cells[4].innerHTML == "O")) && cells[7].innerHTML == "") cells[7].innerHTML = "X"
        else if (
                ((cells[2].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                (cells[2].innerHTML == "O" && cells[7].innerHTML == "O")) && cells[4].innerHTML == "") cells[4].innerHTML = "X"
        else if (
                ((cells[4].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                (cells[4].innerHTML == "O" && cells[7].innerHTML == "O")) && cells[2].innerHTML == "") cells[2].innerHTML = "X"
    }

    checkResult(cells){
        if      (   
                    (cells[0].innerHTML == "X" && cells[1].innerHTML == "X" && cells[2].innerHTML == "X")
                    ||
                    (cells[3].innerHTML == "X" && cells[4].innerHTML == "X" && cells[5].innerHTML == "X")
                    ||
                    (cells[6].innerHTML == "X" && cells[7].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                    (cells[0].innerHTML == "X" && cells[3].innerHTML == "X" && cells[6].innerHTML == "X")
                    ||
                    (cells[1].innerHTML == "X" && cells[4].innerHTML == "X" && cells[7].innerHTML == "X")
                    ||
                    (cells[2].innerHTML == "X" && cells[5].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                    (cells[0].innerHTML == "X" && cells[4].innerHTML == "X" && cells[8].innerHTML == "X")
                    ||
                    (cells[2].innerHTML == "X" && cells[4].innerHTML == "X" && cells[6].innerHTML == "X")
                )
                {
                    this.game_info.textContent = "You lose";
                    this.disableButtons(cells);
                }

        else if (
                    (cells[0].innerHTML == "O" && cells[1].innerHTML == "O" && cells[2].innerHTML == "O")
                    ||
                    (cells[3].innerHTML == "O" && cells[4].innerHTML == "O" && cells[5].innerHTML == "O")
                    ||
                    (cells[6].innerHTML == "O" && cells[7].innerHTML == "O" && cells[8].innerHTML == "O")
                    ||
                    (cells[0].innerHTML == "O" && cells[3].innerHTML == "O" && cells[6].innerHTML == "O")
                    ||
                    (cells[1].innerHTML == "O" && cells[4].innerHTML == "O" && cells[7].innerHTML == "O")
                    ||
                    (cells[2].innerHTML == "O" && cells[5].innerHTML == "O" && cells[8].innerHTML == "O")
                    ||
                    (cells[0].innerHTML == "O" && cells[4].innerHTML == "O" && cells[8].innerHTML == "O")
                    ||
                    (cells[2].innerHTML == "O" && cells[4].innerHTML == "O" && cells[6].innerHTML == "O")
                )
                {
                    this.game_info.textContent = "You win";
                    this.disableButtons(cells);

                }
        else{
            this.game_info.textContent = "Draw";
            this.disableButtons(cells);
        }
    }

    
}

class HiLo{
    window;
    bar;
    screen;
    deck;
    card_slot;
    last_card;
    commands;
    bet;
    game_info;
    streak;
    proc;

    constructor(){
        var window;
        var icon = document.createElement("div");
        var screen = document.createElement("div");
        var commands = document.createElement("div");
        var card_slot = document.createElement("div");
        var hi = document.createElement("button");
        var lo = document.createElement("button");
        var info = document.createElement("div");
        var deck = document.createElement("div");


        this.streak = 0;
        icon.className = "icon";
        screen.className = "hiloscreen";
        hi.className = "button_hi";
        hi.textContent = "Higher";
        lo.className = "button_lo";
        lo.textContent = "Lower";
        commands.className = "hilocommands";
        icon.style.backgroundImage = "url(/assets/media/icons/hilo.svg)";

        window = system.drawWindow(this, icon, "Hi-Lo");
        window.className = "hilo";

        commands.replaceChildren(lo, info, hi);
        screen.replaceChildren(card_slot, commands);
        window.replaceChildren(this.bar, screen);

        for (let i=1; i<=52; i++){
            var deck_card = new Image();
            deck_card.src = "/assets/media/icons/PNGcards/" + i + ".png";
            deck_card.style.width = "200px";
            deck_card.style.height = "300px";
            deck_card.alt = i.toString();
            deck.appendChild(deck_card);
            console.log(deck_card);
        }

        this.deck = deck.children;
        this.window = window;
        this.commands = commands;
        this.screen = screen;
        this.game_info = info;
        this.card_slot = card_slot;

        system.dragElement(this);
        system.createProcess(this, "url(/assets/media/icons/hilo.svg)", "Hi-Lo");
        system.enableControls(this);

        window.addEventListener("click", () => {
            var windows = document.children;
            var array = Array.from(windows);
            array.shift();
            array.shift();
            for (let x of array)    x.window.style.zIndex = 0;
            this.window.style.zIndex = 1;
        });

        hi.addEventListener("click", () => {
            this.bet = "hi";
            this.last_card = this.card_slot.firstElementChild;
            this.drawCard();
        })
        lo.addEventListener("click", () => {
            this.bet = "lo";
            this.last_card = this.card_slot.firstElementChild;
            this.drawCard();
        })

        this.drawCard();

    }

    drawCard(){
        let i = Math.floor((Math.random()*52));
        console.log(this.deck[i]);
        this.card_slot.replaceChildren(this.deck[i]);
        console.log(this.card_slot.firstElementChild);
        this.checkResult();
    }
    checkResult(){
        if (this.last_card != undefined){
            if ((this.bet == "hi" && (parseInt(this.last_card.alt) <= parseInt(this.card_slot.firstElementChild.alt)))
                    ||
                (this.bet == "lo" && (parseInt(this.last_card.alt) >= parseInt(this.card_slot.firstElementChild.alt)))){
                this.streak++;
                this.screen.style.backgroundColor = "green";
                setTimeout(() => this.screen.style.backgroundColor = "white", 100);
                this.game_info.textContent = "Great!";
            }
            else {
                this.screen.style.backgroundColor = "red";
                this.game_info.textContent = "You lose. Your win streak: " + this.streak;
                this.commands.replaceChildren(this.game_info);
                this.commands.style.gridTemplateColumns = "396px";
            }
        }

    }
}

class Memo{
    window;
    bar;
    memotext;
    memogrid;
    proc;

    constructor(){
        var window;
        var text = document.createElement("div");
        var icon = document.createElement("div");

        icon.className = "icon";
        text.className = "memotext";
        text.contentEditable = true;
        text.placeholder = "Digita un promemoria";
        icon.style.backgroundImage = "url(/assets/media/icons/memo.png";

        window = system.drawWindow(this, icon, "Memo");
        window.className = "memoapp";
        window.appendChild(text);
        this.window = window;
        this.memotext = text;
        this.memogrid = system.memos;

        system.dragElement(this);
        system.createProcess(this, "url(/assets/media/icons/memo.png)", "Promemoria");
        system.enableControls(this);

        window.addEventListener("keydown", e => { 
            if (e.code == "Enter"){
                if (this.memotext.textContent == "") return;
                this.createMemo(this.memotext.textContent);
                system.closeApp(this);
            }
        });

        window.addEventListener("click", () => {
            var windows = document.children;
            var array = Array.from(windows);
            array.shift();
            array.shift();
            for (let x of array)    x.window.style.zIndex = 0;
            this.window.style.zIndex = 1;
        });
    }

    createMemo(text){
        var memo = document.createElement("div");
        memo.className = "memo";
        memo.innerHTML = "<div>" + text + "</div>";
        if (this.memogrid.children.length == 4){
            this.memogrid.firstElementChild.remove();
            this.memogrid.appendChild(memo);
        }
        else this.memogrid.appendChild(memo);
    }
}
document.addEventListener("keypress", function (e){
    if (e.code == "Space"){
        var startup = new Audio("/assets/media/audio/startup.mp3");
        startup.play();
        setTimeout(system_startup, 1000);
    }
}, {once: true});

function system_startup(){
    system = new System();
    var launcher = system.desktop.getElementsByClassName("launcher");
    for (let x of launcher){
        x.addEventListener("mouseup", () => system.launchApp(x.id));
    }
}
