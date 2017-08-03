window.onload = function(){
	var boardTable = document.getElementById("board");
	var inputLevel  = document.getElementById("level");
	var inputMines  = document.getElementById("mines");
	var btnStart   = document.getElementById("btnStart");	

	
	Level = function(value){
		switch(value) {
			case "1":
				this.name = "Beginner";
				this.rows= 7;
				this.cols= 7;		
				this.mines = 10;
				break
			case "2":
				this.name = "Intermediate";
				this.rows= 15;
				this.cols= 15;
				this.mines = 40;
				break
			case "3":
				this.name = "Expert";
				this.rows= 29;
				this.cols= 15;
				this.mines = 99;
				break					
		}
	}
	
	Board = function(level){
		this.level = new Level(level);	
		this.boxes = new Array();
		
		this.build();
	}
	
	Board.prototype.build = function(){	
		for(var i=0; i<=this.level.rows ; i++){
			this.boxes.push([]);
			for(var j=0; j<=this.level.cols ; j++){
				this.boxes[i][j]={row:i,col:j,value:0,perimeter: []};
			}
		}	
		
		this.setMines();
		
		for(var k=0; k<=this.level.rows ; k++){
			for(var l=0; l<=this.level.cols; l++){
				this.setValues(k,l);
			}
		}
	}
	
	Board.prototype.setMines = function(){
		var minesRemaining = this.level.mines;
		while(minesRemaining>0){
			var row = Math.floor((Math.random() * this.level.rows));
			var col = Math.floor((Math.random() * this.level.cols));
			var value = this.boxes[row][col].value;			
			if(value !=-1){
				this.boxes[row][col].value = -1;
				minesRemaining-=1;
			}
		}		
	}
	
	Board.prototype.setValues = function(row, col){
		var boxTarget = this.boxes[row][col];
		if(boxTarget.value !== -1){ 
			var rowFrom;
			var rowTo;
			var colFrom;
			var colTo;		
			
			if(row == 0){
				rowFrom = row;
				rowTo = row+1;
			}else if(row == this.level.rows)	{ 
				rowFrom = row-1;
				rowTo = row;
			}else{
				rowFrom = row-1;
				rowTo = row+1;			
			}
			
			if(col == 0){
			    colFrom = col;
				colTo = col+1;				
			}else if(col == this.level.cols){
			    colFrom = col-1;
				colTo = col;				
			}else{
			    colFrom = col-1;
				colTo = col+1;				
			}

			var minesAround = 0;

			for(var i=rowFrom; i<=rowTo; i++){
				for(var j=colFrom; j<=colTo; j++){
					var box = this.boxes[i][j];
					boxTarget.perimeter.push(box);
					if(box.value==-1){
						minesAround +=1;
						boxTarget.value+=1;
					}
				}		
			}
		}
	}
	
	Board.prototype.getAll = function(){
		return this.boxes;
	}
	
	Board.prototype.get = function(row, col){
		return this.boxes[row][col];
	}
	
	Game = function(level){
		this.board = new Board(level);
		this.buildBoard();		
	}
	
	
	Game.prototype.buildBoard = function(){
		var boxes = this.board.getAll();
		
		for(var i =0; i<boxes.length ; i++){
			var row = boardTable.insertRow(i);
			row.setAttribute("id",i);
			for(var j =0; j<boxes[i].length ; j++){
				var box = boxes[i][j];
				var cell = row.insertCell(j);
				cell.setAttribute("id",j);
				if(box.value == -1){
					cell.className = "mine";
				}
				cell.addEventListener("click", function(){
					selectBox(this);
				});			
				
				cell.innerHTML = box.value > 0 ? box.value:"" ;
			}
		}
		
	}
	
	var game;
	
	function selectBox(cell){
		var row = cell.parentElement.rowIndex;
		var col = cell.getAttribute("id");
		var boxTarget = game.board.get(row,col);
		console.log(boxTarget.value);
		switch(boxTarget.value){
			case -1: 
				cell.className = "boom";				
				console.log("BOOM!");
			break;
			case 0: 
				getSafeBoxes(row,col);
				getSafeBoxes(row,col,0);
				console.log("Empty!");				
			break;
			default:
				cell.className = "safe";					
				console.log("Ok! "+boxTarget.value);			
			break;
		}
	}
	
	function getSafeBoxes(row,col, direction=1){
		var targetBox = game.board.get(row,col);
		
		if(direction == 1){
			if(row == 0){
				boardTable.rows[row].cells[col].className = "safe";
			}else if(targetBox.value == 0){
				boardTable.rows[row].cells[col].className = "safe";
				for(var i=col;i>=0;i--){
					if(game.board.get(row, i).value != 0){
						break;
					}	
					getSafeBoxes(row-1,i);
				}
				for(var i=col;i>=0;i--){
					boardTable.rows[row].cells[i].className = "safe";					
					if(game.board.get(row, i).value != 0){
						break;
					}
				}
			}
		}else{
			if(row == game.board.level.rows){
				boardTable.rows[row].cells[col].className = "safe";
			}else if(targetBox.value == 0){
				boardTable.rows[row].cells[col].className = "safe";
				for(var i=col;i<=game.board.level.cols;i++){
					if(game.board.get(row, i).value != 0){
						break;
					}	
					getSafeBoxes(row+1,i);
				}		
				for(var i=col;i<=game.board.level.cols;i++){
					boardTable.rows[row].cells[i].className = "safe";
					if(game.board.get(row, i).value != 0){
						break;
					}
				}				
			}				
		}
	}
	
	btnStart.addEventListener("click", function(){
		boardTable.innerHTML = "";
		level = inputLevel.value;
	    game = new Game(level);
		inputMines.value = game.board.level.mines;
	});
	
}