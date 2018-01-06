class Human // general class (sorta) to hold all obstacles, heroes and score graphical compononets
{
    constructor(x, y,context)
    {
        this.x = x;
        this.y = y;
        this.ctx=context;
        this.currentTick = 0;
        this.max_ticks = 5;
        this.width = 0;
        this.height = 0;
        this.currentFrameX=0;
        this.currentFrameY=0;
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.img = new Image();
        this.img.src = "sprites/guy_walking.png";
        this.width = 1472;//this.img.width;
        this.height = 375;//this.img.height;
        this.ROWS = 1;
        this.COLS = 8;
        this.frameWidth = this.width/this.COLS;
        this.frameHeight = this.height/this.ROWS;
        this.width_on_canvas = 100;
        this.height_on_canvas = 100;
    };

    update()
    {
        this.currentTick++;
        if(this.currentTick === this.max_ticks)
        {
            this.currentTick = 0;
            this.currentFrameX++;
            if(this.currentFrameX === this.COLS)
            {
                this.currentFrameX = 0;
                this.currentFrameY++;
                if(this.currentFrameY === this.ROWS)
                {
                    this.currentFrameY=0;
                }
            }
        }
    };

    draw()
    {

        this.update();
        this.ctx.drawImage(
            this.img // What Image to draw
            , this.currentFrameX * this.frameWidth // the X position of the image that I start to cut from
            , this.currentFrameY * this.frameHeight // the Y position of the image that I start to cut from
            , this.frameWidth // how much I am going to cut on the X position
            , this.frameHeight // how much I am going to cut on the Y position
            , this.x // x position on the CANVAS i am going to place the image
            , this.y // Y position of the CANVAS I am going to place the image
            , this.width_on_canvas // image width
            , this.height_on_canvas // image height
        );

    };


}