const gui = (function ()
{
    const tile_size = 100; // what's the size of per tile? will reflect resolution!

    const row_or_col_size = tile_size * game.game_size;
    let canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');

    canvas.width = row_or_col_size;
    canvas.height = row_or_col_size;

    const lines_color = 'black'; // grid border color
    const line_width = '4'; // grid border line width (applied twice in middle border cells)
    const tile_fill = 'gray'; // filled with numbers tiles - what color?
    const fontBase = 500, fontSize = 50;
    const font_ratio = fontSize / fontBase;
    const font_width = canvas.width * font_ratio; // text displayed on grid with number - what size?
    const font = font_width+"px Arial"; // text displayed on grid with number -- what font?
    // noinspection JSSuspiciousNameCombination
    const font_height = ctx.measureText('M').width; // M is the largest single letter, good way to find text height!
    const ratio_fixer_between_letter_and_text = 1.3; // fixes ratio between letter and height.. should be inspected upon text length change
   // const font_color = 'black';


    const WIN_MESSAGE = "You won!"; // win message
    const LOSS_MESSAGE = "You lost!"; // lose message



    /*
        random colors to text subroutine
     */
    const get_random_color = () =>
    {
        const digits_for_hexa = '0123456789ABCDEF'; // all hexa codes for hexa number
        let color = '#';
        for(let i=0; i<6; i++)
        {
            color+= digits_for_hexa[game.random_num(16)]; // 6 digits for color code, 16 "digits" to choose from..
        }
        return color;
    };

    /*
        generates random color for each number representation between level 1 to level n
     */
    let colors = {};
    for(let i=0; i<= game.WINNING_AMOUNT; i++)
    {
        let key =game.MASTER_DEFAULT_VALUE* Math.pow(2,i); // level i value
        colors[key] = get_random_color(); // grabs a color for that
    }

    /*
        direction buttons subroutine
     */

    let directions = { };

    const up_key = 38; // up key configuration
    const down_key = 40; // down key configuration
    const left_key = 37; // left key configuration
    const right_key = 39; // right key configuration

    directions[up_key] = 'up'; // game behvaior! DO NOT CHANGE
    directions[down_key] = 'down'; // game behvaior! DO NOT CHANGE
    directions[left_key] = 'left'; // game behvaior! DO NOT CHANGE
    directions[right_key] = 'right'; // game behvaior! DO NOT CHANGE



    /*
    FPS control mechanism! for terem
     */
    const fps = 60; // we want 60 fps!

    let request_sync_time_for_fps = 1000/fps; // divide our second to 60 "mini" render times

    let now;
    let then = Date.now();
    let delta;

    /*
        starts the draw loop with recall...
        also appends the grid to the body
        and calls for a new game
        assigns key stroke listener
     */

    const start_draw = () =>
    {
        game.new_game();
        document.body.appendChild(canvas);
        document.onkeydown = move;
        draw();
    };

    /*
        on key press, moves if key is on direction configuration, checks and configures win or lose
     */
    const move = (event) =>
    {
        const keycode = event.which || event.keyCode; // case for different browsers
        if(!keycode || !directions[keycode])
        {
            return;
        }
        if(check_win_or_lose()) // for wins sake
            return;
        if(game.is_full())
        {
            game.lost = true;
            check_win_or_lose(); // for lose sake
            return;
        }
        if(!game.move(directions[keycode])) // if the game reported a score should be updated!
        {
            if(game.check_win())
            {
                game.won = true;
                check_win_or_lose(); // insta win tell!
            }
        }
    };

    /*
        if win or lose flag is up, game shouldn't continue, checks that
     */
    const check_win_or_lose = () =>
    {
        if(game.won)
        {
            alert(WIN_MESSAGE);
            return true;
        }
        else if(game.lost)
        {

            alert(LOSS_MESSAGE);
            return true;
        }
        return false;
    };

    /*
 clears screen, we start empty each screen render
  */
    const clear_screen = () =>
    {
        ctx.beginPath();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.stroke();
    };

    /*
        draws the grid (as a whole, function call internal)
     */
    const draw = () =>
    {

        /*
            I mainly did it for terem, but the mechanism is follows
            I save my "last rendered" time
            and if the time difference between NOW and the last I had a call of requestAnimationFrame
            was within the interval needed for my FPS, I will redraw, other case? I won't.
            Shay didn't teach it yet, he taught it to us on advanced part of the course
            but since it was requested, I supported this game with this
            mechanism
         */

        requestAnimationFrame(draw); // request next render time to be called with me
        now = Date.now(); // gets NOW's TIME
        delta = now - then; // gets the difference between the time last call and this call
        // the more "now" is "farther" than "then", the bigger chance for me to render.
        if(delta>request_sync_time_for_fps)
        {
            clear_screen();
            draw_empty_grid();
            fill_tiles();
            fill_text();
            then = now - (delta & request_sync_time_for_fps); // this time fo syncing to be the difference
            // between now and the "how much I approached to the next" render time
            // e.g:
            // lets say my game renders every 5 seconds, and I want it to render every 3 seconds
            // so RequestAnimationFrame calls the first time on 5 second, in that time I had to "draw"
            // because I passed the 3 second limit I gave myself, though, I also passed 2 of the 3 second
            // to the next render (5-3 = 2), so part of my waiting is done, I should mark it..
        }
    };

    /*
        draws empty grid first... with no numbers or panels
     */
    const draw_empty_grid = () =>
    {

        let i,j;
        for(i=0;i<game.game_size;i++)
        {
            for(j=0;j<game.game_size;j++)
            {
                ctx.beginPath();
                // noinspection JSValidateTypes
                ctx.lineWidth = line_width;
                ctx.strokeStyle = lines_color;
                ctx.rect(i*tile_size,j*tile_size,tile_size,tile_size);
                ctx.stroke();
            }
        }
    };

    /*
        fill tiles that has colors
     */

    const fill_tiles = () =>
    {

        for(let i=0; i<game.game_size; i++)
        {
            for(let j=0; j<game.game_size; j++)
            {
                if(game.exists(i,j))
                {
                    ctx.beginPath();
                    ctx.fillStyle = tile_fill;
                    let margin_width = line_width;
                    margin_width/=2;
                    const computed_x = (i*tile_size) + margin_width;
                    const computed_y = (j*tile_size) + margin_width;
                    // noinspection JSCheckFunctionSignatures
                    ctx.fillRect(computed_x,computed_y,tile_size-(2*margin_width),tile_size-(2*margin_width));
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    };

    /*
     draws the text - meaning the numbers, will be done last
  */
    const fill_text = () =>
    {
        for(let i=0; i<game.game_size; i++)
        {
            for(let j=0; j<game.game_size; j++)
            {
                if(game.exists(i,j))
                {
                    ctx.beginPath();
                    const val = game.cells[i][j];
                    ctx.strokeStyle = colors[val];
                    ctx.font = font;
                    const int_line_width = parseInt(line_width);
                    /*
                        X middle
                     */
                    const text_width = ctx.measureText(val).width;
                    const middle_x = (tile_size - text_width)/2;
                    const x = (i*tile_size) + middle_x;//(tile_size/2) - int_line_width;
                    /*
                        Y middle
                     */
                    const middle_y = (tile_size - font_height)/2;
                    const y = (j*tile_size) + ratio_fixer_between_letter_and_text*middle_y ;// middle_y//(tile_size/2) + int_line_width;
                    ctx.strokeText(val, x, y,(tile_size)/2 - 2*int_line_width);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    };



    return{start_game: start_draw}
}());

window.onload = () =>
{
    gui.start_game();
};
