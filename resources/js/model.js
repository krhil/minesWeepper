
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

Box = function(row, col){
	this.row = row;
	this.col = col;
	this.value = 0;
	this.perimeter = [];
	this.enable = true;
}

Board = function(level){
	this.level = new Level(level);	
	this.boxes = new Array();
	this.build();
	this.TotalSafeBoxes = this.getTotalSafeBoxes();
}

Board.prototype.build = function(){	
	for(var i=0; i<=this.level.rows ; i++){
		this.boxes.push([]);
		for(var j=0; j<=this.level.cols ; j++){
			this.boxes[i][j] = new Box(i,j);
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
		var box = this.get(row, col); //this.boxes[row][col].value;			
		if(box.value !=-1){
			box.value = -1;
			minesRemaining-=1;
		}
	}		
}

Board.prototype.setValues = function(row, col){
	var boxTarget = this.get(row, col);
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


		for(var i=rowFrom; i<=rowTo; i++){
			for(var j=colFrom; j<=colTo; j++){
				var box = this.get(i,j);
				if(box != boxTarget){
					boxTarget.perimeter.push(box);
				}
				if(box.value==-1){
					boxTarget.value+=1;
				}
			}		
		}
	}
}

Board.prototype.getTotalSafeBoxes = function(){
	return ((this.level.rows+1) * (this.level.cols+1)) - (this.level.mines + this.getAllByValue(0).length);
}

Board.prototype.getAll = function(){
	return this.boxes;
}

Board.prototype.getAllByValue = function(value){
	result = new Array();

	for(var i=0;i<this.boxes.length;i++){
		for(var j=0;j<this.boxes[i].length;j++){
			var box = this.get(i,j);
			if(box.value == value){
				result.push(box);
			}
		}
	}
	return result;
}

Board.prototype.get = function(row, col){
	return this.boxes[row][col];
}

Game = function(level){
	this.board = new Board(level);
	this.showHelp = false;	
	this.movesRemaining = this.getTotalSafeBoxes();
	this.activeMines = this.board.level.mines;	
}

Game.prototype.getTotalSafeBoxes = function(){
	var totalBoxes = (this.board.level.rows+1) * (this.board.level.cols+1);
	totalBoxes-= this.board.level.mines;
	totalBoxes-= this.board.getAllByValue(0).length;
	return totalBoxes;
}