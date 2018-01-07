const game = function()
{
    /*
        Canvas init
     */
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const animation_object = new Human(canvas.width/2,canvas.height/2,ctx);

    /*
   FPS control mechanism! for omri terem
    */
    const fps = 60; // we want 60 fps!

    let request_sync_time_for_fps = 1000/fps; // divide our second to 60 "mini" render times

    let now;
    let then = Date.now();
    let delta;

    const initModule = () =>
    {
        document.body.appendChild(canvas);
        document.onkeydown = move;
        draw();
    };

    /*
        Keyboard control
     */
    const movement_percentage = 0.25;
    const directions = { };

    const up_key = 38; // up key configuration
    const down_key = 40; // down key configuration
    const left_key = 37; // left key configuration
    const right_key = 39; // right key configuration

    const up= 'up'; // game behvaior! DO NOT CHANGE
    const down = 'down'; // game behvaior! DO NOT CHANGE
    const left = 'left'; // game behvaior! DO NOT CHANGE
    const right = 'right'; // game behvaior! DO NOT CHANGE

    directions[up_key] = up;
    directions[down_key] = down;
    directions[left_key] = left;
    directions[right_key] = right;

    /*
        on key press, moves if key is on direction configuration, checks and configures win or lose
     */
    const move = (event) =>
    {
        const keycode = event.which || event.keyCode; // case for different browsers
        if(!keycode || !directions[keycode])
        {
            // noinspection UnnecessaryReturnStatementJS
            return;
        }
        const direction = directions[keycode];
        switch(direction)
        {
            case up:
                    if(animation_object.y - canvas.height*movement_percentage > animation_object.height_on_canvas)
                    {
                        animation_object.y = animation_object.y - canvas.height*movement_percentage;
                    }
                    break;
            case down:
                    if(animation_object.y + canvas.height*movement_percentage < canvas.height - animation_object.height_on_canvas)
                    {
                        animation_object.y = animation_object.y + canvas.height*movement_percentage;
                    }
                    break;
            case left:
                    if(animation_object.x - canvas.width*movement_percentage > animation_object.width_on_canvas)
                    {
                        animation_object.x = animation_object.x - canvas.width*movement_percentage;
                    }
                    break;
            case right:
                    if(animation_object.x + canvas.width*movement_percentage < canvas.width - animation_object.width_on_canvas)
                    {
                        animation_object.x = animation_object.x + canvas.width*movement_percentage;
                    }
                    break;
        }

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
            /*
                IN HERE THE ACTUAL DRAW FUNCTION HAPPENS
             */
            clear_screen();
            animation_object.draw();
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
        clears entire canvas
     */
    const clear_screen = () =>
    {
        ctx.beginPath();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.stroke();
    };
    return {initModule};
}();


$( document ).ready(function()
{
    game.initModule();
});