


/*
    I programmed it in WebStorm, I find it very easy to write complicated function in WebStorm
    it allows me to emulate my JavaScript code on the fly (and while writing)
    whilist giving me auto-complete and smart ident along with other Jetbrains known features
    at the level that barely any other IDE can give.. recommanding it to all the students

    to download it, visit the link https://www.jetbrains.com/student/
    and enlist as student using your JCE email-account
    contact me if you are having trouble, I will gladly support ;)
 */

const game = (function ()
{
    const MASTER_DEFAULT_VALUE = 3; // default base


    const game_size = 4; // grid size as in nXn, while game_size = n
    const init_cells = 2; // how much cells we start with
    const generate_per_turn = 1; // how much cells we generate per turn
    const WINNING_AMOUNT = 10; // 2^11 = 2048
    const start_with_double = 1; // start game with this much cells that has Master_Default_value^2

    let won = false; // win flag
    let lost = false; // lose flag
    const ERROR = -1; // case error, might check globaly

     // I actually mean that it takes 11 "merges" to win, 2^1... as in level
    let cells = new Array(game_size); // the grid array
     // game system array!

    /*
        array game system init subrtouine, gives me an array filled with zeroes of nXn
     */
    let i,j; // iterators
    for(i=0; i<cells.length; i++)
    {
        cells[i] = new Array(game_size);
    }
    for(i=0; i<cells.length; i++)
    {
        for (j = 0; j < cells[i].length; j++)
        {
            cells[i][j] = 0;
        }
    }

    /*
        game board, generates the first cells
     */

    const new_game = () =>
    {
        let i;
        for(i=0; i<init_cells-start_with_double;i++)
            generate_cells(1);
        for(i=0; i<start_with_double;i++)
            generate_cells(1,true);
    };


    /*
        generates n cells if possible, will be runnig for A LOT OF TIME if game_size >> 591 (personally calculated)
        else game flow is fine, there is no check if its impossible to generate a random tile - presumed called by other call to check
     */
    const generate_cells = (amount,init_double) =>
    {
        let i=0;
        while(i<amount)
        {

            let x = random_num(game_size);
            let y = random_num(game_size);
            if(!exists(x,y))
            {
                cells[x][y] = MASTER_DEFAULT_VALUE;
                i++;
                if(init_double)
                {
                    cells[x][y] = MASTER_DEFAULT_VALUE*2;
                }
            }
        }
    };


    /*
        testing utlities for me, Mr chaosruler

    const print_array = () =>
    {
        for(let i=0; i<game_size; i++)
        {
            let str = "";
            for(let j=0; j<game_size;j++)
                str+=cells[i][j] + " ";
            console.log(str);
        }
    };
*/

    /*
        general subroutine to generate number between 0 and lim
     */
    const random_num = (lim) => Math.floor(Math.random()*(lim)); // returns a number between  0 and lim, including both


    /*
        makes a cords json with the following values
     */
    const make_cords = (x,y,val) => {
        return {x:x,y:y,val:val};
    };


    /*
        checks if cords exists in array
     */
    const exists = (x,y) =>
    {
        return cells[x][y] !== 0;
    };

    /*
        move subroutine : algo
        if its full, don't do it
        generate cell (as per turn)
        align those cells to specific pressed direction
        merge them
        and check if we won ;) (possible after merging only..)
     */

    const move = (direction) =>
    {
        if(is_full())
            return false;

        align_cells(direction);
        merge_cells(direction);
        normalize_arr_to_integer();
        if(is_full())
            return false;
        generate_cells(generate_per_turn);
        return !check_win();
    };

    /*
        align cells - done really complicated to use as less lines of codes as possible for quick use on mobile browsers
     */
    const align_cells = (direction, flag) =>
    {
        let i;
        let end;
        let iterator_move_direction;
        /*
            pulls direction, going against the array direction will be calculated as minus and starting from end to start
            whilist going through the array direction will be calculated as plus and starting from start to end
         */
        if(direction === 'up' || direction === 'left')
        {
            iterator_move_direction = 1;
            i=0;
            end=game_size;
        }
        else if(direction === 'down' || direction === 'right')
        {
            iterator_move_direction = -1;
            i=game_size-1;
            end=0;
        }
        /*
            go through the array on the above specified order and check if there are cells to align to that location
         */
        for(;(i<end && (direction === 'up' || direction==='left') ) || (i>= end && (direction==='down' || direction==='right') ); i+=iterator_move_direction)
        {
            let start_iterator;
            if(direction === 'up' || direction === 'left')
            {
                start_iterator = 0;
            }
            else if(direction === 'down' || direction === 'right')
            {
                start_iterator = game_size - 1;
            }
            let cell;
            for( ;(cell=get_next_on_line(i,start_iterator,direction) ) !=null ;start_iterator+=iterator_move_direction)
            {
                /*
                    check the array row or col (depends if going up/down or left/right) and
                    check if there is in an unaligned tile

                    case found:
                 */

                if(direction === 'up' || direction === 'down')
                {
                    // noinspection JSUnresolvedVariable
                    cells[cell.x][get_first_empty(cell.x,direction)] = cell.val;
                }
                else if(direction === 'left' || direction === 'right')
                {

                    // noinspection JSUnresolvedVariable
                    cells[get_first_empty(cell.y,direction)][cell.y] = cell.val;
                }
                /*
                    reinsert with closest empty from the begining!
                 */

            }
        }
        if(flag) // case it was called after merging, than after merging we might have "holes" due to merging
            merge_cells(direction);
            /*
                therefore we should merge cells again to "close" those holes, that merging will call aligning again..
                until job is complete
                REALLY BAD ON COMPUTATION, but we don't care, our array is small
             */
    };


    const get_first_empty = (row_or_col,direction) =>
    {
        let i;
        let iterator_move_direction;
        let end;
        /*
            configures direction to look at, and learning if parameter is row or col
         */
        if(direction === 'up' || direction === 'left')
        {
            iterator_move_direction = 1;
            i=0;
            end=game_size;
        }
        else if(direction === 'down' || direction === 'right')
        {
            iterator_move_direction = -1;
            i=game_size-1;
            end=0;
        }
        for(; (i<end && (direction === 'up' || direction==='left') ) || (i>= end && (direction==='down' || direction==='right') ); i+=iterator_move_direction)
        {
            /*
            looks for the first cell that holds parameter cordinate row_or_col that is empty
             */
            if(direction === 'up' || direction === 'down')
            {
                if(cells[row_or_col][i] === 0)
                    return i;
            }
            else if(direction === 'left' || direction === 'right')
            {
                if(cells[i][row_or_col] === 0)
                    return i;
            }
        }
        return ERROR; // shouldn't happen // after all we are looking for n cells in a row, and we can't get
        // more than n cells, so we can't really go through MORE than n cells if I defined n cells only
        // sounds complicated, but it means I can't pull more than I filled
    };

    const get_next_on_line = (x,y,direction) =>
    {
      let start = y;
      let end;
      let iterator_move_direction;
      /*
      configures direction variables
       */
      if(direction === 'up' || direction === 'left')
      {
          end = game_size;
          iterator_move_direction = 1
      }
      else if(direction === 'down' || direction === 'right')
      {
          end = 0;
          iterator_move_direction = -1;
      }

      /*
        looks at specified direction (up/left is against array direction, down/right is with it)
        and looks if there's a cell that exists there, if a cell exists there, theres a cell in that line and
        in that direction!
       */
      for(j=start; ( j< end && (direction=='up' || direction ==='left') ) || (j>=end && (direction=='down' || direction === 'right') ) ; j+=iterator_move_direction)
      {
          if(exists(x,j))
          {
              let val = cells[x][j];
              cells[x][j] = 0;
              return make_cords(x,j,val);

          }
      }
      return null;
    };

    /*
        subroutine to check if array is full, meaning game is lost
     */
    const is_full = () =>
    {
        let i,j;
        for(i=0; i<game_size; i++)
        {
            for(j=0;j<game_size;j++)
            {
                if(cells[i][j] === 0) // empty cell means there's still more to the game
                    return false;
            }
        }
        lost = true; // if there wasn't even one empty cell.. game is over imo
                    // dead memory therefore will be done in GUI element
                    // some browsers support changing dead memory, popular ones
                    // like chrome doesn't
        return true;
    };

    /*
        merge cells subroutine, try to merge cells in each row, first passing row 0 until n
     */
    const merge_cells = (direction) =>
    {
        for(let i=0; i<game_size; i++)
        {
            let flag = try_to_merge_in_row(i,direction);
            // will be true if we found a cell to merge, false otherwise
            if(flag)
            {
                /*
                    case there is a cell to merge
                 */
                align_cells(direction,flag); // re-align cells!
                return; // we don't need to cotinue merging, merge_cells() will be called again
                        // from align_cells()
            }
        }
    };

    /*
        subroutine that looks for cells to merge in specified row and direction
     */
    const try_to_merge_in_row = (row_or_col,direction) =>
    {
        let start;
        let end;
        let move_by;
        let flag = false;
        if(direction === 'up' || direction === 'left')
        {
            start = game_size-1;
            end = 1;
            move_by = -1;
        }
        else if(direction === 'down' || direction === 'right')
        {
            start = 0;
            end = game_size-2;
            move_by = 1;
        }
        /*
        above configures a direction for the array with variables
         */
        for(; (start>=end && ((direction === 'up' || direction === 'left') ) ) || ( start<=end && (direction === 'down' || direction === 'right')) ;start+=move_by )
        {
            if(direction === 'left' || direction === 'right') // case we are going horizontally
            {
                if(cells[start][row_or_col] === cells[start+move_by][row_or_col] && cells[start][row_or_col]!=0)
                {
                    /*
                        we found a cell to merge, we will clear the "previous in line" one and
                        "up the level" of the "next" one, and raise the flag that we found something to merge
                        therefore we require aligning!
                     */
                    cells[start][row_or_col] = 0;
                    let level = Math.log(cells[start+move_by][row_or_col]/MASTER_DEFAULT_VALUE)/(Math.log(2));
                    cells[start+move_by][row_or_col] = MASTER_DEFAULT_VALUE*Math.pow(2,level+1);
                    flag=true;
                }
            }
            else if(direction === 'up' || direction === 'down') // case we are going vertially
            {
                if(cells[row_or_col][start] === cells[row_or_col][start+move_by] && cells[row_or_col][start]!=0)
                {
                    /*
                        we found a cell to merge, we will clear the "previous in line" one and
                        "up the level" of the "next" one, and raise the flag that we found something to merge
                        therefore we require aligning!
                     */
                    cells[row_or_col][start] = 0;
                    let level = Math.log(cells[row_or_col][start+move_by]/MASTER_DEFAULT_VALUE)/(Math.log(2));
                    cells[row_or_col][start+move_by] = MASTER_DEFAULT_VALUE*Math.pow(2,level+1);
                    flag=true;
                }
            }
        }
        return flag;
    };

    /*
        subroutine to check if game is won
     */
    const check_win = () =>
    {
        for(let i=0; i<game_size; i++)
        {
            for(let j=0; j<game_size;j++)
            {
                /*
                    check for each cell
                 */
                if(cells[i][j] >= MASTER_DEFAULT_VALUE*Math.pow(2,WINNING_AMOUNT))
                {
                    /*
                        if even one of the values is above the maximum level
                     */
                    won = true; // set flag, deadly on some browswers like chrome because of dead memory
                    //therefore done in GUI element as well
                    return true;
                }
            }
        }
        return false;
    };

    /*
        this function was done because changing the base leads to errors on text..
        like 3 becoming 3.00003.....
        this is due to computerized view of integers and data
     */
    const normalize_arr_to_integer = () =>
    {
        for(let i=0; i<game_size; i++)
        {
            for(let j=0;j<game_size;j++)
            {
                cells[i][j] = parseInt(cells[i][j]);
            }
        }
    };

    return{cells,game_size,new_game,exists,move,won,lost,is_full, WINNING_AMOUNT,random_num,check_win,MASTER_DEFAULT_VALUE}

}());
