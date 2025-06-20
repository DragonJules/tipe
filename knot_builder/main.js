const draw_cursor = "url(\"data:image/svg+xml,%3Csvg width='26px' height='26px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' stroke='%23ffffff' stroke-width='0'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ctitle%3Epencil-solid%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='invisible_box' data-name='invisible box'%3E%3Crect width='48' height='48' fill='none'%3E%3C/rect%3E%3C/g%3E%3Cg id='icons_Q2' data-name='icons Q2'%3E%3Cpath d='M43.4,18.8,29.3,4.6a1.9,1.9,0,0,0-2.8,0l-6,6,16.9,17,6-6A1.9,1.9,0,0,0,43.4,18.8ZM4.6,26.5A2,2,0,0,0,4,27.9V42a2,2,0,0,0,2,2H20.1a2,2,0,0,0,1.4-.6l13.1-13-17-16.9Z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") 13 13, auto"
const rotate_cursor = "url(\"data:image/svg+xml,%3Csvg width='32px' height='32px' viewBox='0 0 42 42' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='%23ffffff' xml:space='preserve' stroke='%23ffffff' stroke-width='' transform='rotate(0)'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round' stroke='%23ffffff' stroke-width='1'%3E%3Cg%3E%3Cpath d='M32.076,15.138l-7.152,9.341l-7.152-9.341h4.666c-0.451-4.397-4.178-7.842-8.695-7.842C8.922,7.296,5,11.218,5,16.038 c0,4.82,3.922,8.742,8.742,8.742c1.381,0,2.5,1.119,2.5,2.5s-1.119,2.5-2.5,2.5C6.166,29.78,0,23.615,0,16.038 S6.166,2.296,13.742,2.296c7.273,0,13.23,5.686,13.697,12.842H32.076z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cg%3E%3Cpath d='M32.076,15.138l-7.152,9.341l-7.152-9.341h4.666c-0.451-4.397-4.178-7.842-8.695-7.842C8.922,7.296,5,11.218,5,16.038 c0,4.82,3.922,8.742,8.742,8.742c1.381,0,2.5,1.119,2.5,2.5s-1.119,2.5-2.5,2.5C6.166,29.78,0,23.615,0,16.038 S6.166,2.296,13.742,2.296c7.273,0,13.23,5.686,13.697,12.842H32.076z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") 11 14, auto"
const erase_cursor = "url(\"data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M11.4096 5.50506C13.0796 3.83502 13.9146 3 14.9522 3C15.9899 3 16.8249 3.83502 18.4949 5.50506C20.165 7.1751 21 8.01013 21 9.04776C21 10.0854 20.165 10.9204 18.4949 12.5904L14.3017 16.7837L7.21634 9.69828L11.4096 5.50506Z' fill='%23ffffff'%3E%3C/path%3E%3Cpath d='M6.1557 10.759L13.2411 17.8443L12.5904 18.4949C12.2127 18.8727 11.8777 19.2077 11.5734 19.5H21C21.4142 19.5 21.75 19.8358 21.75 20.25C21.75 20.6642 21.4142 21 21 21H9C7.98423 20.9747 7.1494 20.1393 5.50506 18.4949C3.83502 16.8249 3 15.9899 3 14.9522C3 13.9146 3.83502 13.0796 5.50506 11.4096L6.1557 10.759Z' fill='%23ffffff'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 15 15, auto"

const themes = {
    dark: "darkMode",
    light: "lightMode"
}

let theme = themes.dark

const colors = {
    darkMode: {
        background: "#22222f",
        dark: "#333343",
        medium: "#8888aa",
        light: "#E6E9EF"
    },
    lightMode: {
        background: "#E6E9EF",
        dark: "#D3D9E5",
        medium: "#AEB1B7",
        light: "#111121"
    }
}

const cursors = {
    draw: draw_cursor,
    erase: erase_cursor,
    rotate: rotate_cursor
}

const cell_size = { x: 100, y: 100 };

const grid_canvas = document.querySelector("canvas.grid");
const grid_ctx = grid_canvas.getContext("2d");

const knot_canvas = document.querySelector("canvas.knot");
const ctx = knot_canvas.getContext("2d");

const window_width = window.innerWidth;
const window_height = window.innerHeight;

grid_canvas.width = window_width;
grid_canvas.height = window_height

knot_canvas.width = window_width;
knot_canvas.height = window_height

const grid_height = Math.floor(window_height / cell_size.y);
const grid_width = Math.floor(window_width / cell_size.x);

const grid = Array(grid_height).fill(0).map(() => Array(grid_width).fill(0));

function drawGrid() {
    grid_ctx.clearRect(0, 0, grid_canvas.width, grid_canvas.height);

    grid_ctx.strokeStyle = colors[theme].dark;
    grid_ctx.lineWidth = 2;

    grid_ctx.beginPath();
    for (var x = 1; x < grid_canvas.width; x += cell_size.x) {
        grid_ctx.moveTo(x, 0);
        grid_ctx.lineTo(x, window_height);
    }
    
    for (var y = 1; y < grid_canvas.height; y += cell_size.y) {
        grid_ctx.moveTo(0, y);
        grid_ctx.lineTo(window_width, y);
    }
    grid_ctx.stroke();
}

function highlightCell(x, y) {
    const top = y * cell_size.y;
    const left = x * cell_size.x;

    grid_ctx.strokeStyle = colors[theme].medium;
    grid_ctx.lineWidth = 2;
    grid_ctx.beginPath();
    grid_ctx.moveTo(left, top);
    grid_ctx.lineTo(left + cell_size.x, top);
    grid_ctx.lineTo(left + cell_size.x, top + cell_size.y);
    grid_ctx.lineTo(left, top + cell_size.y);
    grid_ctx.lineTo(left, top);
    grid_ctx.stroke();
}

function getCoords(e) {
  const coords = {
    x: Math.floor(e.offsetX / cell_size.x),
    y: Math.floor(e.offsetY / cell_size.y),
  };
  return coords;
}

function setSymbolAt(x, y, code) {
    grid[y][x] = code
}

function getSymbolAt(x, y) {
    return grid[y][x]
}

function clearCell(x, y) {
    const top = y * cell_size.y;
    const left = x * cell_size.x;

    ctx.clearRect(left, top, cell_size.x + 1, cell_size.y + 1);
}


function drawSymbol(x, y, code) {
    const top = y * cell_size.y;
    const left = x * cell_size.x;

    const x_mid = left + cell_size.x / 2;
    const y_mid = top + cell_size.y / 2;

    clearCell(x, y);

    ctx.strokeStyle = colors[theme].light;
    ctx.lineWidth = 5;
    ctx.beginPath();
    switch (code) {
        case 1:
            ctx.moveTo(left, y_mid)
            ctx.lineTo(left + cell_size.x, y_mid)
            break;
    
        case 2:
            ctx.moveTo(x_mid, top)
            ctx.lineTo(x_mid, top + cell_size.y)

            break;

        case 3:
            ctx.moveTo(x_mid, top+cell_size.y)
            ctx.lineTo(x_mid, y_mid)
            ctx.lineTo(left+cell_size.x, y_mid)
            break;

        case 4:
            ctx.moveTo(x_mid, top + cell_size.y);
            ctx.lineTo(x_mid, y_mid);
            ctx.lineTo(left, y_mid);
            break;

        case 5:
            ctx.moveTo(x_mid, top);
            ctx.lineTo(x_mid, y_mid);
            ctx.lineTo(left + cell_size.x, y_mid);
            break;

        case 6:
            ctx.moveTo(x_mid, top);
            ctx.lineTo(x_mid, y_mid);
            ctx.lineTo(left, y_mid);
            break;

        case 7:
            ctx.moveTo(left, y_mid);
            ctx.lineTo(left + cell_size.x, y_mid);

            ctx.moveTo(x_mid, top);
            ctx.lineTo(x_mid, y_mid - cell_size.y / 9);

            ctx.moveTo(x_mid, y_mid + cell_size.y / 9);
            ctx.lineTo(x_mid, top + cell_size.y);
            break;

        case 8:
            ctx.moveTo(x_mid, top);
            ctx.lineTo(x_mid, top + cell_size.y);

            ctx.moveTo(left, y_mid);
            ctx.lineTo(x_mid - cell_size.x / 9, y_mid);

            ctx.moveTo(x_mid + cell_size.x / 9, y_mid);
            ctx.lineTo(left + cell_size.x, y_mid);
            break;

        case 9:
            ctx.moveTo(left + 1, y_mid)
            ctx.lineTo(x_mid, top + 1)

            ctx.moveTo(x_mid, top + cell_size.y)
            ctx.lineTo(left + cell_size.x, y_mid)
            break;

        case 10:
            ctx.moveTo(x_mid, top + 1)
            ctx.lineTo(left + cell_size.x, y_mid)

            ctx.moveTo(left + 1, y_mid)
            ctx.lineTo(x_mid, top + cell_size.y)
            break;

        default:
            break;

    }

    ctx.stroke();
}

function getKnotShape() {
    let top = grid_height - 1
    let left = grid_width - 1
    let right = 0
    let bottom = 0

    for (let y = 0; y < grid_height; y++) {
        for (let x = 0; x < grid_width; x++) {
            if (grid[y][x] == 0) continue
            left = Math.min(left, x)
            right = Math.max(right, x)

            top = Math.min(top, y)
            bottom = Math.max(bottom, y)
        
        }
    }

    return { top, left, right, bottom }
}

function getKnot() {
    const knotShape = getKnotShape()

    const grid_copy = grid.map(arr => arr.slice());

    return grid_copy.map(arr => arr.slice(knotShape.left, knotShape.right + 1)).slice(knotShape.top, knotShape.bottom + 1)
}

function getNextSymbol(symbol, next=true) {
    switch (symbol) {
        case 0: return next ? 1 : 9

        case 1:
        case 2: return next ? 3 : 0

        case 3:
        case 4:
        case 5:
        case 6: return next ? 7 : 1

        case 7:
        case 8: return next ? 9 : 3

        case 9:
        case 10: return next ? 0 : 7

        default: return 0
    } 
}

function getRotatedSymbol(symbol, clockwise=true) {
    switch (symbol) {
        case 0: return 0

        case 1: return 2
        case 2: return 1

        case 3: return clockwise ? 4 : 5
        case 4: return clockwise ? 6 : 3
        case 5: return clockwise ? 3 : 6
        case 6: return clockwise ? 5 : 4
        
        case 7: return 8
        case 8: return 7

        case 9: return 10
        case 10: return 9
    
        default: return 0
    }
}

function drawKnot() {
    for (let y = 0; y < grid_height; y++) {
        for (let x = 0; x < grid_width; x++) {
            drawSymbol(x, y, grid[y][x])
        }
    }
}

function resetDisplay() {
    ctx.reset()
    grid_ctx.reset()
    drawGrid()
    drawKnot()
}

function setBackgroundColor(color) {
    document.body.style.backgroundColor = color
}

/// ---
drawGrid();

const lastKnot = getCookie("last_knot")
if (lastKnot != "") {
    const knot = JSON.parse(lastKnot)
    const size = [knot.length, knot[0].length]

    const top = Math.floor(grid_height/2 - size[0]/2)
    const left = Math.floor(grid_width/2 - size[1]/2)

    for (let y = 0; y < size[0]; y++) {
        for (let x = 0; x < size[1]; x++) {
            setSymbolAt(left + x, top + y, knot[y][x])
        }
    }
    drawKnot()
}

let mode = "draw"
document.body.style.cursor = draw_cursor

knot_canvas.addEventListener("click", (e) => {
    e.preventDefault()
    const coords = getCoords(e);
    const symbol = getSymbolAt(coords.x, coords.y);
    

    const nextSymbol = (mode == "draw") ? getNextSymbol(symbol):
        (mode == "rotate") ? getRotatedSymbol(symbol) : 
        (mode == "erase") ? 0 : symbol

    setSymbolAt(coords.x, coords.y, nextSymbol)
    drawSymbol(coords.x, coords.y, nextSymbol)

    saveKnot()
})

knot_canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    const coords = getCoords(e);
    const prev_mode = mode


    mode = "erase"
    document.body.style.cursor = cursors[mode]

    drawSymbol(coords.x, coords.y, 0)
    setSymbolAt(coords.x, coords.y, 0)

    mode = prev_mode
    document.body.style.cursor = cursors[mode]

    saveKnot()
})

knot_canvas.addEventListener("wheel", (e) => {
    const coords = getCoords(e);
    const symbol = getSymbolAt(coords.x, coords.y);
    const rotateSymbol = getRotatedSymbol(symbol, e.deltaY < 0)

    setSymbolAt(coords.x, coords.y, rotateSymbol)
    drawSymbol(coords.x, coords.y, rotateSymbol)

    saveKnot()
})

window.addEventListener("keypress", (e) => {
    if (e.key == "c") {
        const knot = getKnot()
        navigator.clipboard.writeText(JSON.stringify(knot))
    }

    if (e.key == "t") {
        theme = theme == themes.dark ? themes.light : themes.dark
        setBackgroundColor(colors[theme].background)
        resetDisplay()
    }

    switch (e.key) {
        case "d":
            mode = "draw"
            break;
        case "r":
            mode = "rotate"
            break;
        case "e":
            mode = "erase"
            break;

        default:
            break;
    }

    document.body.style.cursor = cursors[mode]

})

window.addEventListener("mousemove", (e) => {
    const coords = getCoords(e);
    drawGrid();
    highlightCell(coords.x, coords.y)
})

function saveKnot() {
    const knot = getKnot()
    setCookie("last_knot", JSON.stringify(knot), 365)
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}