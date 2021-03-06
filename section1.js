class GameOfLife {
    constructor(height, width, num_seeds) {
        //height,width = int
        this.height = height;
        this.width = width;
        
        //build board, an array of arrays with (height) elements of size (width)
        this.board = [];
        for (var i = 0; i < height; i++) {
            this.board.push(new Array(width).fill(0))
        }
        
        this.seed(num_seeds);
    }
    display() {
        for (var x = 0; x < this.height; x++) {
            console.log(this.board[x].join(' '))
        }
        console.log('')
    }
    seed(numPoints) {
        for (var x = 0; x < numPoints; x++) {
            let i = Math.floor(Math.random() * this.height);
            let j = Math.floor(Math.random() * this.width);
            while (this.board[i][j] == 1) {
                i = Math.floor(Math.random() * this.height);
                j = Math.floor(Math.random() * this.width);
            }
            this.board[i][j] = 1;
        }
    }
    tick() {
        // update every point
        var newBoard = [];
        for (var i = 0; i < this.height; i++) {
            newBoard.push(new Array(this.width).fill(0));
        }
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                newBoard[i][j] = this.updateLifeStatus(i,j);
            }
        }
        this.board = newBoard;
    }
    updateLifeStatus(i,j) { //return live or die, 1 or 0
        //i,j being coordinates of the point which to provide new status of
        var count = 0;
        let adjacent_cells = [[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
        for (var c = 0; c < 8; c++) {
            if (adjacent_cells[c][0] >= 0 && adjacent_cells[c][0] < this.height && adjacent_cells[c][1] >= 0 && adjacent_cells[c][1] < this.width) {
                if (this.board[adjacent_cells[c][0]][adjacent_cells[c][1]] == 1) {
                    count++;
                }
            }                
        }
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (count < 2 || count > 3) {
            return 0; //dead
        }
        else if (count == 3) {
            return 1; //alive
        }
        else { // if count == 2
            return this.board[i][j];
        }
    }
}
$(function() {
    $("#a1").click(function() {
        $("#a1").remove();
        let DIM = 100;
        let game1 = new GameOfLife(DIM, DIM, 1000);
        let game2 = new GameOfLife(DIM, DIM, 1500);
        let game3 = new GameOfLife(DIM, DIM, 2500);
    
        $('#canva1').prop('width', DIM*3);
        $('#canva1').prop('height', DIM*3);
        $('#canva2').prop('width', DIM*3);
        $('#canva2').prop('height', DIM*3);
        $('#canva3').prop('width', DIM*3);
        $('#canva3').prop('height', DIM*3);
        
        let c1 = $('#canva1')[0].getContext("2d");
        let c2 = $('#canva2')[0].getContext("2d");
        let c3 = $('#canva3')[0].getContext("2d");
    
        let running = setInterval(function() {
            c1.clearRect(0,0,$('#canva1')[0].width,$('#canva1')[0].height)
            c2.clearRect(0,0,$('#canva2')[0].width,$('#canva2')[0].height)
            c3.clearRect(0,0,$('#canva3')[0].width,$('#canva3')[0].height)
            for (var i = 0; i < DIM; i++) {
                for (var j = 0; j < DIM; j++) {
                    if (game1.board[i][j] == 1) {
                        c1.fillRect(j*3-2,i*3-2,3,3);
                    }
                    if (game2.board[i][j] == 1) {
                        c2.fillRect(j*3-2,i*3-2,3,3);
                    }
                    if (game3.board[i][j] == 1) {
                        c3.fillRect(j*3-2,i*3-2,3,3);
                    }
                }
            }
            game1.tick();
            game2.tick();
            game3.tick();
        }, 100); //perform every 250ms
    })
});


