window.onload = function(){
	
	var boardTable = document.getElementById("board");
	var btnRestart = document.getElementById("btnRestart");

	btnRestart.addEventListener("click", function(){
		boardTable.innerHTML = "";
		game = new Game("Intermediate");
	});

	function Box(row, col, value){

		this.row = row;
		this.col = col;
		this.value = value;
	}

	function Level(name = "Beginner"){
		this.name = name; //typeof name == 'undefined' ? "Beginner" : name;
		if(this.name == "Beginner"){
			this.board = {
				rows: 7,
				cols: 7
			},
			this.mines = 10;
		}else if(this.name == "Intermediate"){
			this.board = {
				rows: 15,
				cols: 15
			},
			this.mines = 40;
		}else{
			this.board = {
				rows: 15,
				cols: 29
			},
			this.mines = 99;
		}
	}

	function Game(level){
		this.level = new Level(level);
		this.boardElements = new Array();
		this.boxes = new Array();
		this.buildBoard();
		this.setMines();
		//this.setNumbers();
	};
    
    Game.prototype.buildBoard = function(){
    	for(var r = 0; r <= this.level.board.rows; r++ ){
			var row = boardTable.insertRow(r);
			this.boardElements[r] = new Array();
			row.setAttribute('id', r);
			

			for(var c = 0; c <= this.level.board.cols ; c++){
				this.boardElements[r][c] = 0;
				var col = row.insertCell(c);
				col.addEventListener("click", function(){
					clickEvent(this);
				})
				col.addEventListener("contextmenu", function(ev){
					console.log(ev);	
					rightClickEvent(this, ev);
					return false;
				}, false)
				col.setAttribute('id',c);
				//col.innerHTML = r +"."+ c;
			}
		}
    }	

	Game.prototype.getPerimeter = function(row, col){
		var perimeter = new Array();
		if(row == 0){
			if(col == 0){
				perimeter.push(new Box(row+1, col,this.boardElements[row+1][col]));
				perimeter.push(new Box(row+1, col+1, this.boardElements[row+1][col+1]));
				perimeter.push(new Box(row, col+1, this.boardElements[row][col+1]));
			}else if(col == this.level.board.cols){
				perimeter.push(new Box(row, col-1,this.boardElements[row][col]));
				perimeter.push(new Box(row+1, col-1,this.boardElements[row+1][col-1]));
				perimeter.push(new Box(row+1, col,this.boardElements[row+1][col]));		
			}else{
				perimeter.push(new Box(row, col-1, this.boardElements[row][col-1]));
				var i = row+1;
				var j = col-1;
				while(j<=col+1){
					perimeter.push(new Box(i, j,this.boardElements[i][j]));
					j++;
				}
				perimeter.push(new Box(row, col + 1,this.boardElements[row][col+1]));
			}
		}else if(row == this.level.board.rows){
			if(col == 0){
				perimeter.push(new Box(row-1, col, this.boardElements[row-1][col]));
				perimeter.push(new Box(row-1, col+1, this.boardElements[row-1][col+1]));
				perimeter.push(new Box(row, col+1, this.boardElements[row][col+1]));
			}else if(col == this.level.board.cols){
				perimeter.push(new Box(row, col-1, this.boardElements[row][col-1]));
				perimeter.push(new Box(row-1, col-1, this.boardElements[row-1][col-1]));
				perimeter.push(new Box(row-1, col, this.boardElements[row-1][col]));			
			}else{
				perimeter.push(new Box(row, col-1, this.boardElements[row][col-1]));
				perimeter.push(new Box(row, col+1, this.boardElements[row][col+1]));
				var i = row-1;
				var j = col-1;
				while(j<=col+1){
					perimeter.push(new Box(i, j, this.boardElements[i][j]));
					j++;
				}
			}
		}else{
			if(col == 0){
				perimeter.push(new Box(row-1, col, this.boardElements[row-1][col]));
				var i = row-1;
				var j = col+1;
				while(i<=row+1){
					perimeter.push(new Box(i, j, this.boardElements[i][j]));
					i++;
				}		
				perimeter.push(new Box(row+1, col, this.boardElements[row+1][col]));	
			}else if(col == this.level.board.cols){
				perimeter.push(new Box(row-1, col, this.boardElements[row-1][col]));	
				var i = row-1;
				var j = col-1;
				while(i<=row+1){
					perimeter.push(new Box(i, j, this.boardElements[i][j]));
					i++;
				}				
				perimeter.push(new Box(row+1, col, this.boardElements[row+1][col]));
			}else{
				var i = row-1;
				var j = col-1;
				while(i<=row+1){
					perimeter.push(new Box(i, j, this.boardElements[i][j]));
					i++;
				}
				perimeter.push(new Box(row+1, col, this.boardElements[row+1][col]));
			    i = row+1;
			    j = col+1;
				while(i>=row-1){
					perimeter.push(new Box(i, j, this.boardElements[i][j]));
					i--;
				}
				perimeter.push(new Box(row-1, col, this.boardElements[row-1][col]));
			}
		}
		
		// for (var i = 0; i < perimeter.length; i++) {
		// 	console.log(perimeter[i]);
		// }
		return perimeter;
	}

    Game.prototype.setMines = function() {
    	var minesRemaining = this.level.mines;
    	while(minesRemaining > 0){
    		var x = Math.floor((Math.random() * this.level.board.rows));	
    		var y = Math.floor((Math.random() * this.level.board.cols));

    		var cell = boardTable.rows[x].cells[y];
    		
    		if(this.boardElements[x][y] != -1){
    			this.boardElements[x][y] = -1;
    			minesRemaining -= 1;
    		}
    	}
    }

    Game.prototype.getMines = function(){
    	console.log("Bombs \n");
    	for (var i = 0; i < this.level.board.rows; i++) {
    		for (var j = 0; j < this.level.board.cols; j++) {
    			if(this.boardElements[i][j] == -1){
    				console.log(i + "," + j + "=> " + this.boardElements[i][j]);
    			}
    		}
    	}
    }

    Game.prototype.getMinesAround = function(row, col){
    	var minesAround = 0;

    		if(row == this.boardElements.length -1){
    			var fromRow;
		    	var toCol;

    			if(col == 0){
    				fromRow = row - 1;
    			    toCol = col + 1;
		    		for (var i = fromRow; i <=row; i++) {
		    			for (var j = col; j <= toCol; j++) {
		    				minesAround += this.boardElements[i][j] == -1 ? 1 : 0;
		    			}
		    		}
		    	}else if(col == this.boardElements[0].length){
    				fromRow = row - 1;
    			    var fromCol = col - 1;
		    		for (var i = fromRow; i <=row; i++) {
		    			for (var j = fromCol; j <= col; j++) {
		    				minesAround += this.boardElements[i][j] == -1 ? 1 : 0;
		    			}
		    		}
		    	}else{
		    		fromRow = row - 1;
		    		var fromCol = col - 1;
		    		for (var i = fromRow; i <= row; i++) {
		    			for (j = fromCol; j <= col; j++) {
		    				minesAround += this.boardElements[i][j] == -1 ? 1 : 0;
		    			}
		    		}	    		
		    	}
    		}else if(row == 0){
	    		if(col == 0){
		    		for (var k = 0; k <=1; k++) {
		    			for (var l = 0; l <= 1; l++) {
		    				minesAround += this.boardElements[k][l] == -1 ? 1 : 0;
		    			}
		    		}
		    	}else{
		    		var from = col - 1;
		    		var to = col + 1;
		    		
		    		for (var i = 0; i <=1; i++) {
		    			for (j = from; j <= to; j++) {
		    				minesAround += this.boardElements[i][j] == -1 ? 1 : 0;
		    			}
		    		}	    		
		    	}
	    	}else{
	    		var fromRow = row - 1;
	    		var toRow = row + 1;
	    		var fromCol = col - 1;
	    		var toCol = col + 1;
	    		
	    		for (var i = fromRow; i <= toRow; i++) {
	    			for (j = fromCol; j <= toCol; j++) {
	    				minesAround += this.boardElements[i][j] == -1 ? 1 : 0;
	    			}
	    		}	 
	    	}
	    
	    //console.log(row+","+ col + "->" + "mines=" + minesAround);
    	return minesAround;
    }

    Game.prototype.setNumbers = function(){
    	for (var i = 0; i <= this.level.board.rows; i++) {
    		for (var j = 0; j <= this.level.board.cols; j++) {
    			if(this.boardElements[i][j] != -1){
    				var value = this.getMinesAround(i,j);
    				this.boardElements[i][j] = value;//this.getMinesAround(i,j);
    				//boardTable.rows[i].cells[j].innerHTML = value;
    			}
    		}
    	}
    }


    Game.prototype.setSafesAround = function(row, col){
    	var minesAround = 0;

    		if(row == this.boardElements.length -1){
    			var fromRow;
		    	var toCol;
		    	var content = this.boardElements[row][col];
    			var cell = boardTable.rows[row].cells[col];
    			if(col == 0){
    				fromRow = row - 1;
    			    toCol = col + 1;
		    		for (var i = fromRow; i <=row; i++) {
		    			for (var j = col; j <= toCol; j++) {
		    				content = this.boardElements[i][j];
		    				cell = boardTable.rows[i].cells[j];
		    				if(content != -1){
		    					cell.className = "safe";
		    					cell.innerHTML = content ==  0 ? " " : content;
		    				}
		    			}
		    		}
		    	}else if(col == this.boardElements[0].length){
    				fromRow = row - 1;
    			    var fromCol = col - 1;
		    		for (var i = fromRow; i <=row; i++) {
		    			for (var j = fromCol; j <= col; j++) {
		    				content = this.boardElements[i][j];
		    				cell = boardTable.rows[i].cells[j];	
		    				if(content != -1){
		    					cell.className = "safe";
		    					cell.innerHTML = content ==  0 ? " " : content;
		    				}		    					    				
		    			}
		    		}
		    	}else{
		    		fromRow = row - 1;
		    		var fromCol = col - 1;
		    		for (var i = fromRow; i <= row; i++) {
		    			for (j = fromCol; j <= col; j++) {
		    				content = this.boardElements[i][j];
		    				cell = boardTable.rows[i].cells[j];	
		    				if(content != -1){
		    					cell.className = "safe";
		    					cell.innerHTML = content ==  0 ? " " : content;
		    				}
		    			}
		    		}	    		
		    	}
    		}else if(row == 0){
	    		if(col == 0){
		    		for (var k = 0; k <=1; k++) {
		    			for (var l = 0; l <= 1; l++) {
		    				content = this.boardElements[i][j];
		    				cell = boardTable.rows[i].cells[j];	
		    				if(content != -1){
		    					cell.className = "safe";
		    					cell.innerHTML = content ==  0 ? " " : content;
		    				}
		    			}
		    		}
		    	}else{
		    		var from = col - 1;
		    		var to = col + 1;
		    		
		    		for (var i = 0; i <=1; i++) {
		    			for (j = from; j <= to; j++) {
		    				content = this.boardElements[i][j];
		    				cell = boardTable.rows[i].cells[j];	
		    				if(content != -1){
		    					cell.className = "safe";
		    					cell.innerHTML = content ==  0 ? " " : content;
		    				}
		    			}
		    		}	    		
		    	}
	    	}else{
	    		var fromRow = row > 0 ? row - 1 : row;
	    		var toRow = row < this.level.board.rows ? row + 1 : row;
	    		var fromCol = col > 0 ? col - 1 : col ;
	    		var toCol = col < this.level.board.rows ? col+1 : col;
	    		console.log(row +","+ col);
	    		for (var i = fromRow; i <= toRow; i++) {
	    			for (j = fromCol; j <= toCol; j++) {
	    				content = this.boardElements[i][j];
	    				cell = boardTable.rows[i].cells[j];	
	    				if(content != -1){
	    					cell.className = "safe";
	    					cell.innerHTML = content ==  0 ? " " : content;
	    				}
	    			}
	    		}	 
	    	}
    }


    Game.prototype.showSafesSquares = function(row, col){
    	var content = this.boardElements[row][col];
    	var cell = boardTable.rows[row].cells[col];
    	if(content == 0){  		
    		//if(row == 0){

				var i = row;
				var j = col;
				if(i > 0){
					while(i <= this.level.board.rows){
					    cell = boardTable.rows[i].cells[col];
					    content = this.boardElements[i][col];
						if(content != -1){
							/*cell.className = "safe";
							cell.innerHTML = content ==  0 ? " " : content;*/
							if(content != 0){
								cell.className = "safe";
								break;
							}
							this.setSafesAround(i,col);
						}
						i++;					
					}

					i = row;
					
						while(i > 0){
							cell = boardTable.rows[i].cells[col];
					   		content = this.boardElements[i][col];
							if(content != -1){
								/*cell.className = "safe";
								cell.innerHTML = content ==  0 ? " " : content;*/
								if(content != 0){
									cell.className = "safe";
									break;
								}
							}
							this.setSafesAround(i,col);
							i--;					
						}
				}

				if(j > 0){
					while(j <= this.level.board.cols){
					    cell = boardTable.rows[row].cells[j];
					    content = this.boardElements[row][j];
						if(content != -1){
							/*cell.className = "safe";
							cell.innerHTML = content ==  0 ? " " : content;*/
							if(content != 0){
								cell.className = "safe";
								break;
							}
						}
						this.setSafesAround(row,j);	
						j++;
					}				    		
    		
					j = col;
					
					while(j > 0){
						cell = boardTable.rows[row].cells[j];
				   		content = this.boardElements[row][j];
						if(content != -1){
							/*cell.className = "safe";
							cell.innerHTML = content ==  0 ? " " : content;*/
							if(content != 0){
							    cell.className = "safe";
								break;
							}
						}
						this.setSafesAround(row,j);
						j--;					
					}
				}
    		//}
    	}else{
			cell.className = "safe";
			//cell.innerHTML = content;
    	}
    }

    Game.prototype.setValue = function(row, col){
		if(this.boardElements[row][col] != -1){
			perimeter = game.getPerimeter(row,col);
			var mines = 0;
			for (var k = 0; k < perimeter.length; k++) {
			 	mines += perimeter[k].value == -1 ? 1: 0;
			 }
			 this.boardElements[row][col] = mines;
		}
	}

	Game.prototype.showSafePerimeter = function(row, col){
		perimeter = game.getPerimeter(row,col);
		for (var k = 0; k < perimeter.length; k++) {
			var pRow = perimeter[k].row;
			var pCol = perimeter[k].col;
			valueJ = perimeter[k].value;
		 	if(valueJ != -1){
		 		boardTable.rows[pRow].cells[pCol].className = "safe";
				boardTable.rows[pRow].cells[pCol].innerHTML = valueJ > 0 ? valueJ : "";
		 	}
		 }
	}

	Game.prototype.verticalScanner = function(row, j, find="number"){
		alert(find);
		var finalRow;
		for(var i = row; i>=0; i--){
			var valueJ = this.boardElements[i][j];		
			
			boardTable.rows[i].cells[j].className = "safe";
			boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";		
			
			if(find == "number"){
				if(valueJ >0){
				   boardTable.rows[i].cells[j].className = "safe";
				   boardTable.rows[i].cells[j].innerHTML = valueJ 
					break;
				}			
			}else{
				alert("Here!");
				if(valueJ == -1){
				   boardTable.rows[i].cells[j].className = "safe";
				   boardTable.rows[i].cells[j].innerHTML = valueJ 
					break;
				}						
			}			
		}	
		for(var i = row; i<=this.level.board.rows; i++){
			var valueJ = this.boardElements[i][j];						

			if(find == "number"){
				boardTable.rows[i].cells[j].className = "safe";
				boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";					
				if(valueJ >0){
				   boardTable.rows[i].cells[j].className = "safe";
				   boardTable.rows[i].cells[j].innerHTML = valueJ 
					break;
				}			
			}else{
				if(valueJ == -1){ 
					break;
				}						
			}
		}
	}

	Game.prototype.getSafesSquares = function(row, col){

		var value = this.boardElements[row][col];

		if(value > 0){
			boardTable.rows[row].cells[col].className = "safe";
			boardTable.rows[row].cells[col].innerHTML = value;
		}else if(value == 0){
			for(var j = col; j>=0 ; j--){
				alert("column: " + j);
				var finalUpRow;
				var finalDownRow;
				var value = this.boardElements[row][j];
				if(value !=0){
					alert(finalUpRow);
					for(var k = row; k >= finalUpRow; k--){
						valueJ = this.boardElements[k][j];
						boardTable.rows[k].cells[j].className = "safe";
						boardTable.rows[k].cells[j].innerHTML = valueJ >0 ? valueJ: "";
					}
					for(var k = row; k <= finalDownRow; k++){
						valueJ = this.boardElements[k][j];
						boardTable.rows[k].cells[j].className = "safe";
						boardTable.rows[k].cells[j].innerHTML = valueJ >0 ? valueJ: "";
					}					
					break;
				}				
					for(var i = row; i>=0; i--){
						alert("row: " + i);
						var valueJ = this.boardElements[i][j];		
						
						boardTable.rows[i].cells[j].className = "safe";
						boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";		
						finalUpRow = i;
						if(valueJ >0){
							boardTable.rows[i].cells[j].className = "safe";
						   boardTable.rows[i].cells[j].innerHTML = valueJ 
							break;
						}					
							
					}	

					for(var i = row; i<=this.level.board.rows; i++){
						var valueJ = this.boardElements[i][j];

						boardTable.rows[i].cells[j].className = "safe";
						boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";
						finalDownRow = i;							
						if(valueJ >0){		
							boardTable.rows[i].cells[j].className = "safe";
						   boardTable.rows[i].cells[j].innerHTML = valueJ 																		
							break;
						}	
					}

			}

		/*	for(var j = col; j<=this.level.board.cols ; j++){
				var value = this.boardElements[row][j];
					for(var i = row; i>=0; i--){
						var valueJ = this.boardElements[i][j];		

						boardTable.rows[i].cells[j].className = "safe";
						boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";		
						if(valueJ !=0){
							boardTable.rows[i].cells[j].className = "safe";
						   boardTable.rows[i].cells[j].innerHTML = valueJ 			
							break;
						}						
					}	
					for(var i = row; i<=this.level.board.rows; i++){
						var valueJ = this.boardElements[i][j];
						
						boardTable.rows[i].cells[j].className = "safe";
						boardTable.rows[i].cells[j].innerHTML = valueJ > 0 ? valueJ: "";							
						if(valueJ !=0){		
							boardTable.rows[i].cells[j].className = "safe";
						   boardTable.rows[i].cells[j].innerHTML = valueJ 																		
							break;
						}	
					}

					if(value !=0){	
						break;
					}

			}			*/
		}
	}


	Game.prototype.other = function(row, col){
		var value = this.boardElements[row][col];

		if(value > 0){
			boardTable.rows[row].cells[col].className = "safe";
			boardTable.rows[row].cells[col].innerHTML = value;
		}else if(value == 0){
			var j = col;

			while(j>=0){
					leftValue = this.boardElements[row][j-2];
					boardTable.rows[row].cells[j].className = "safe";
					this.showSafePerimeter(row,j);	
					alert(leftValue);
					if(leftValue !=0){
						//this.showSafePerimeter(row,j-2);
						alert("Break loop!");
						break;
					}				
			
					/*var i = row;
					while(i>=0){
						var valueJ = this.boardElements[i][j];
						if(i-3 < 0){
							this.showSafePerimeter(0,j);
							break;
						}
						this.showSafePerimeter(i,j);	
						i-=3;
						if(valueJ !=0){
							break;
						}						
					}	*/
					/*while(i<= this.level.board.rows){
					if(i+3 > this.level.board.rows){
						this.showSafePerimeter(this.level.board.rows,j);
						break;
					}
						this.showSafePerimeter(i,j);	
						i+=3;
						if(valueJ !=0){
							break;
						}						
					}*/
				j-=3;
			}

			/*while(j<=this.level.board.cols){
				var i = row;
				while(i>=0){
					if(i-3 < 0){
						this.showSafePerimeter(0,j);
						break;
						}
					this.showSafePerimeter(i,j);	
					i-=3;
					if(valueJ !=0){
						break;
					}						
				}	
				while(i<= this.level.board.rows){
					if(i+3 > this.level.board.rows){
						this.showSafePerimeter(this.level.board.rows,j);
						break;
					}
					this.showSafePerimeter(i,j);	
					i+=3;
					if(valueJ !=0){
						break;
					}						
				}

				if(value !=0){	
					break;
				}

				j+=3;
			}*/
		}
	}	

	var game = new Game("Beginner");
	
	for(var i = 0; i <= game.level.board.rows; i++){
		for (var j = 0; j <= game.level.board.cols; j++) {
			game.setValue(i,j);
			value = game.boardElements[i][j];
			boardTable.rows[i].cells[j].className = value == -1 ? "mine":""; 
			//boardTable.rows[i].cells[j].innerHTML = value;
		}
	}

	function clickEvent(col){
		var content = game.boardElements[col.parentElement.id][col.id];
		if(col.className != "flag"){
			if(content == -1){
				col.className = "boom";
			}else /*if(col.className!= "safe")*/{
				var row = parseInt(col.parentNode.rowIndex);
				var j = parseInt(col.id);
				
				//game.other(row,j);
				game.getSafesSquares(row,j);
				//col.className = "safe";
				// col.innerHTML = content ==  0 ? " " : content;
			}
		}
	}

	function rightClickEvent(col, ev){
		ev.preventDefault();
		if(col.className == "flag"){
			col.className = "";
		}else if(col.className != "safe"){
			col.className = "flag";
		}
		return false;
	}
}