
const width = 16;
const height = 16;
const cell_size = 24;

var game_wrapper;
var game_canvas;
var game_field;

var field_array;

var steps = 0;


function init() {
    init_vars();
	place_field();
}

function init_vars() {
	game_wrapper = document.getElementById('game-wrapper')
    game_canvas = document.getElementById('game-canvas');
    game_field = document.getElementById('game-field');

    game_canvas.setAttribute("width", width*(cell_size+1)-1);
    game_canvas.setAttribute("height", height*(cell_size+1)-1);

    game_field.style.width = width*(cell_size+1)-1+"px";
    document.getElementById('header').style.width = width*(cell_size+1)-1+"px";
    game_field.style.height = height*(cell_size+1)-1+"px";

    field_array = new Array(height);
    for (var i = 0; i < field_array.length; i++) {
        field_array[i] = new Array(width).fill(0);
    }

    field_array[3][6] = 1;
    field_array[7][1] = 1;
    field_array[10][11] = 1;
    field_array[9][9] = 1;
    field_array[1][3] = 1;
    field_array[12][5] = 1;

    update_field();

	game_field.addEventListener("click", field_click);
	window.addEventListener("resize", place_field);
}

function place_field() {
	w_width = window.innerWidth;
	w_height = window.innerHeight;

	game_wrapper.style.left = parseInt(w_width/2-parseInt(getComputedStyle(game_wrapper).width)/2)+'px';
	game_wrapper.style.top = parseInt(w_height/2-parseInt(getComputedStyle(game_wrapper).height)/2)+'px';
}

function update_field() {
    var context = game_canvas.getContext('2d');
    draw_grid();
    context.lineWidth = 0;

    var blacks = 0;
    var whites = 0;

    for (var i = 0; i < field_array.length; i++) {
        for (var j = 0; j < field_array[i].length; j++) {
            if (field_array[i][j] == 1) {
                context.fillStyle = 'rgb(0, 0, 0)';
                blacks++;
            }
            else {
                context.fillStyle = 'rgb(255, 255, 255)';
                whites++;
            }
            context.fillRect(j*(cell_size+1), i*(cell_size+1), cell_size, cell_size);
        }
    }

    var steps_counter = document.getElementById('steps-counter');
    steps_counter.innerText = "Steps: "+steps;

    var cells_counter = document.getElementById('cells-counter');
    cells_counter.innerText = "Black/white: "+blacks+'/'+whites;

	if (blacks == width*height || whites = width*height)
	{
		alert("You won!");
	}
}

function draw_grid() {
    var context = game_canvas.getContext('2d');
    context.strokeStyle="rgb(160, 160, 160)";
    context.lineWidth = 1;
    for (var i = 1; i < width; i++) {
        context.beginPath();
        context.moveTo(i*(cell_size+1)-0.5, 0);
        context.lineTo(i*(cell_size+1)-0.5, height*(cell_size+1)-1);
        context.stroke();
    }

    for (var i = 1; i < height; i++) {
        context.beginPath();
        context.moveTo(0, i*(cell_size+1)-0.5);
        context.lineTo(width*(cell_size+1)-1, i*(cell_size+1)-0.5);
        context.stroke();
    }

}
function field_click (event) {
    var mouse_pos = get_mouse_pos(event);

    if (mouse_pos.x != -1 && mouse_pos.y != -1) {
        steps++;
        game_step(mouse_pos.y/(cell_size+1), mouse_pos.x/(cell_size+1));
    }
}

//return position of cell in the canvas ex. 0, 24, 48, etc.
function get_mouse_pos(event) {

    var mouse_x = event.clientX - parseInt(game_field.getBoundingClientRect().left);
    var mouse_y = event.clientY - parseInt(game_field.getBoundingClientRect().top);

    //if user clicked on grid
    if ((mouse_x-1)%(cell_size+1) == cell_size || (mouse_y-1)%(cell_size+1) == cell_size) return {x:-1, y:-1};
    return {x: mouse_x-mouse_x%(cell_size+1), y:mouse_y-mouse_y%(cell_size+1)};
}

function game_step(a, b) {
    for (var i = a-1; i <= a+1; i++) {
        for (var j = b-1; j <= b+1; j++) {
            if (i >= 0 && i < field_array.length) {
                if (j >= 0 && j < field_array[i].length) {
                    if (field_array[i][j] == 0) field_array[i][j] = 1;
                    else                        field_array[i][j] = 0;
                }
            }
        }
    }

    update_field()
}



window.addEventListener("load", init);
