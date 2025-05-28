const cell_size = { x: 50, y: 50 };

const canvas = document.querySelector(".grid");
const ctx = canvas.getContext("2d");

const window_width = window.innerWidth;
const window_height = window.innerHeight;
canvas.width = window_width;
canvas.height = window_height;

const grid_height = Math.floor(window_height / cell_size.y);
const grid_width = Math.floor(window_width / cell_size.x);

const grid = Array(grid_height).fill(0).map(() => Array(grid_width).fill(0));

function drawGrid() {
    ctx.strokeStyle = "#333355";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (var x = 1; x < canvas.width; x += cell_size.x) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window_height);
    }
    
    for (var y = 1; y < canvas.height; y += cell_size.y) {
        ctx.moveTo(0, y);
        ctx.lineTo(window_width, y);
    }
    ctx.stroke();
}


drawGrid();

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

    ctx.clearRect(left, top, cell_size.x, cell_size.y);

    drawGrid();
}

function draw_symbol(x, y, code) {
    const top = y * cell_size.y;
    const left = x * cell_size.x;

    const x_mid = left + cell_size.x / 2;
    const y_mid = top + cell_size.y / 2;

    clearCell(x, y);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
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

    return {
        top,
        left,
        right,
        bottom
    }

}

function getKnot() {
    const knotShape = getKnotShape()

    const grid_copy = grid.map(arr => arr.slice());

    return grid_copy.map(arr => arr.slice(knotShape.left, knotShape.right + 1)).slice(knotShape.top, knotShape.bottom + 1)
}

let mode = "draw"

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

        case 3: return clockwise ? 4 : 6
        case 4: return clockwise ? 5 : 3
        case 5: return clockwise ? 6 : 4
        case 6: return clockwise ? 3 : 5
        
        case 7: return 8
        case 8: return 7

        case 9: return 10
        case 10: return 9
    
        default: return 0
    }
}

canvas.addEventListener("click", (e) => {
    e.preventDefault()
    const coords = getCoords(e);
    const symbol = getSymbolAt(coords.x, coords.y);
    

    const next_symbol = (mode == "draw") ? getNextSymbol(symbol):
        (mode == "rotate") ? getRotatedSymbol(symbol) : 
        (mode == "erase") ? 0 : symbol

    setSymbolAt(coords.x, coords.y, next_symbol)
    draw_symbol(coords.x, coords.y, next_symbol)

})

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    const coords = getCoords(e);
    const symbol = getSymbolAt(coords.x, coords.y);

    const next_symbol = (mode == "draw") ? getNextSymbol(symbol, false):
        (mode == "rotate") ? getRotatedSymbol(symbol, false) : 
        (mode == "erase") ? 0 : symbol

    draw_symbol(coords.x, coords.y, next_symbol)
    setSymbolAt(coords.x, coords.y, next_symbol)

})

window.addEventListener("keypress", (e) => {
    if (e.key == "c") {
        const knot = getKnot()
        navigator.clipboard.writeText(JSON.stringify(knot))
    }

    switch (e.key) {
        case "d":
            mode = "draw"
            document.body.style.cursor = "crosshair"
            break;
        case "r":
            mode = "rotate"
            document.body.style.cursor = "url(\"data:image/svg+xml,%3Csvg fill='%23000000' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='26px' height='36px' viewBox='-13 -4.49 51.06 41.06' xml:space='preserve' stroke='%23000000' stroke-width='' transform='rotate(0)'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round' stroke='%23ffffff' stroke-width='5'%3E%3Cg%3E%3Cpath d='M32.076,15.138l-7.152,9.341l-7.152-9.341h4.666c-0.451-4.397-4.178-7.842-8.695-7.842C8.922,7.296,5,11.218,5,16.038 c0,4.82,3.922,8.742,8.742,8.742c1.381,0,2.5,1.119,2.5,2.5s-1.119,2.5-2.5,2.5C6.166,29.78,0,23.615,0,16.038 S6.166,2.296,13.742,2.296c7.273,0,13.23,5.686,13.697,12.842H32.076z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cg%3E%3Cpath d='M32.076,15.138l-7.152,9.341l-7.152-9.341h4.666c-0.451-4.397-4.178-7.842-8.695-7.842C8.922,7.296,5,11.218,5,16.038 c0,4.82,3.922,8.742,8.742,8.742c1.381,0,2.5,1.119,2.5,2.5s-1.119,2.5-2.5,2.5C6.166,29.78,0,23.615,0,16.038 S6.166,2.296,13.742,2.296c7.273,0,13.23,5.686,13.697,12.842H32.076z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") 16 16, auto"
            break;
        case "e":
            mode = "erase"
            document.body.style.cursor = "url(\"data:image/svg+xml,%3Csvg width='26px' height='36px' viewBox='-1.44 -1.44 18.88 18.88' xmlns='http://www.w3.org/2000/svg' fill='%23000000' class='bi bi-eraser' stroke='%23000000' stroke-width='1.04'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round' stroke='%23ffffff' stroke-width='2.2399999999999998'%3E%3Cpath d='M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z'%3E%3C/path%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 16 16, auto"
            break;
        
        default:
            break;
    }


})