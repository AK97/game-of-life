class SpeciesGame {
    constructor(height, width, num_seeds) {
        //height,width = int
        //num_seeds = array of how many initial num_seeds, length being number of species
        this.height = height;
        this.width = width;
        this.num_species = num_seeds.length;
        
        //build board, an array of arrays with (height) elements of size (width)
        this.board = [];
        for (var i = 0; i < height; i++) {
            this.board.push(new Array(width).fill(0))
        }
        for (var species = 1; species < this.num_species+1; species++) {
            this.seed(num_seeds[species-1], species)
        }
    }
    display() {
        for (var x = 0; x < this.height; x++) {
            console.log(this.board[x].join(' '))
        }
        console.log('')
    }
    seed(numPoints, species) {
        //species just being an int that represents it. ≥1
        for (var x = 0; x < numPoints; x++) {
            let i = Math.floor(Math.random() * this.height);
            let j = Math.floor(Math.random() * this.width);
            while (this.board[i][j] != 0) {
                i = Math.floor(Math.random() * this.height);
                j = Math.floor(Math.random() * this.width);
            }
            this.board[i][j] = species;
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
    updateLifeStatus(i, j) { //return live or die, 1 or 0
        //i,j being coordinates of the point which to provide new status of
        let self_species = this.board[i][j];
        //initialize the count at 0 of each
        var count = {}; //looks like {1:0, 2:0,...}
        var total = 0;
        for (var n = 1; n < this.num_species+1; n++) {
            count[n] = 0;
        }
        let adjacent_cells = [[i-1,j-1],[i-1,j],[i-1,j+1],[i,j-1],[i,j+1],[i+1,j-1],[i+1,j],[i+1,j+1]];
        for (var c = 0; c < 8; c++) {
            if (adjacent_cells[c][0] >= 0 && adjacent_cells[c][0] < this.height && adjacent_cells[c][1] >= 0 && adjacent_cells[c][1] < this.width) {
                let neighbor_species = this.board[adjacent_cells[c][0]][adjacent_cells[c][1]];
                if (neighbor_species != 0) { //we're not tracking dead spaces
                    count[neighbor_species]++;
                    total++;
                }
            }                
        }
        //overpopulation/crowding or underpopulation
        if (total < 2 || total > 4) {
            return 0; //dead
        }
        //consumption and reproduction
        else if (Object.values(count).includes(4)) { //surrounded only by 4 of a single species
                return Object.keys(count).find(key => count[key] === 4); //alive as a member of that species
                //return 0;
        }
        else if (total == 3 && Object.values(count).includes(3)) { //surrounded only by 3 of a single species
            return Object.keys(count).find(key => count[key] === 3); //alive as a member of that species
        }
        // else if (total > 2 && Object.values(count).includes(2)) { //surrounded by 2 of one and ≤2 of atleast one other. competition going on
        //     return 0;
        // }
        // }
        //hostility / aggression / killing
        // else if (count[self_species] < 2 && Object.values(count).includes(2)) { //surrounded by 2 of a diff species and only 1 of itself or another
        //     return 0; //dead
        // }
        else { //surrounded by 1 1 1.
            return self_species; //stalemate. war. death.
        }
    }
}

$(function() {
    $("#c1").click(function() {
        $("#c1").remove();
        let DIM = 100;
        let game1 = new SpeciesGame(DIM, DIM, [300,300]);
        let game2 = new SpeciesGame(DIM, DIM, [600,600]);
        let game3 = new SpeciesGame(DIM, DIM, [500,500,500]);

        game1.display();

        $('#canvc1').prop('width', DIM*3);
        $('#canvc1').prop('height', DIM*3);
        $('#canvc2').prop('width', DIM*3);
        $('#canvc2').prop('height', DIM*3);
        $('#canvc3').prop('width', DIM*3);
        $('#canvc3').prop('height', DIM*3);
        
        let c1 = $('#canvc1')[0].getContext("2d");
        let c2 = $('#canvc2')[0].getContext("2d");
        let c3 = $('#canvc3')[0].getContext("2d");

        let fillStyles = ['','blue', 'red', 'yellow', 'green', 'purple']

        let running = setInterval(function() {
            c1.clearRect(0,0,$('#canvc1')[0].width,$('#canvc1')[0].height)
            c2.clearRect(0,0,$('#canvc2')[0].width,$('#canvc2')[0].height)
            c3.clearRect(0,0,$('#canvc3')[0].width,$('#canvc3')[0].height)
            for (var i = 0; i < DIM; i++) {
                for (var j = 0; j < DIM; j++) {
                    if (game1.board[i][j] != 0) {
                        c1.fillStyle = fillStyles[game1.board[i][j]];
                        c1.fillRect(j*3-2,i*3-2,3,3);
                    }
                    if (game2.board[i][j] != 0) {
                        c2.fillStyle = fillStyles[game2.board[i][j]];
                        c2.fillRect(j*3-2,i*3-2,3,3);
                    }
                    if (game3.board[i][j] != 0) {
                        c3.fillStyle = fillStyles[game3.board[i][j]];
                        c3.fillRect(j*3-2,i*3-2,3,3);
                    }
                }
            }
            game1.tick();
            game2.tick();
            game3.tick();
        }, 200); //perform every 250ms
    })
});
