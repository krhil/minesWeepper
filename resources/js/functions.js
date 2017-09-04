window.onload = function(){

	var boardTable  = document.getElementById("board");
	var inputLevel  = document.getElementById("level");
	var inputMines  = document.getElementById("mines");
	var btnStart    = document.getElementById("btnStart");	
	var divMessage  = document.getElementById("divMessage");
	var lblMessage  = document.getElementById("lblMessage");

	var colorValues = {
					    1:'#0066ff',
					    2:'#009933',
				   	    3:'#ff3300',
					    4:'#002699',
				   	    5:'#cc3300',
					    6:'#ff6699',
					    7:'#ffff00'
					  };

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
				this.boxes[i][j]={row:i,col:j,value:0,perimeter: [], enable: true};
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


			for(var i=rowFrom; i<=rowTo; i++){
				for(var j=colFrom; j<=colTo; j++){
					var box = this.boxes[i][j];
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
	
	Board.prototype.getAll = function(){
		return this.boxes;
	}

	Board.prototype.getAllByValue = function(value){
		result = new Array();

		for(var i=0;i<this.boxes.length;i++){
			for(var j=0;j<this.boxes[i].length;j++){
				
				if(this.boxes[i][j].value == value){
					result.push(this.boxes[i][j]);
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
		this.movesRemaining = this.getTotalSafBoxes();
		this.activeMines = this.board.level.mines;
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

				//cell.innerHTML = box.value > 0 ? box.value:"" ;
				/*if(box.value == -1){
					cell.className = "mine";
				}*/

				cell.addEventListener("click", function(){
					selectBox(this);
				});		
				cell.addEventListener("contextmenu", function(e){
					e.preventDefault();
					setFlag(this);
				},false);

				cell.addEventListener("mousemove", function(){
					scanPerimeter(this);
				});
				cell.addEventListener("mouseout", function(){
					hidePerimeter(this);
				});		
			}
		}
	}
	
	Game.prototype.getTotalSafBoxes = function(){
		var totalBoxes = (this.board.level.rows+1) * (this.board.level.cols+1);
		totalBoxes-= this.board.level.mines;
		totalBoxes-= this.board.getAllByValue(0).length;
		return totalBoxes;
	}

	Game.prototype.getSafeBoxes = function(row, col){
		var targetBox = this.board.get(row,col);
		targetBox.enable = false;

		if(targetBox.value !=0){
			boardTable.rows[pRow].cells[pCol].innerHTML = targetBox.value;
			boardTable.rows[pRow].cells[pCol].className = "safe";
			this.movesRemaining-=1;
		}else{
			var perimeter = targetBox.perimeter;
			for(var i = 0; i< perimeter.length; i++){
				pRow = perimeter[i].row;
				pCol = perimeter[i].col;

				cell = boardTable.rows[pRow].cells[pCol];
				cell.innerHTML = perimeter[i].value >0 ? perimeter[i].value : "";
				cell.style.color = colorValues[perimeter[i].value];
				cell.className = "safe";
				cell.setAttribute("disabled",true);
				
				if(perimeter[i].value != 0){
					 if(perimeter[i].enable){
					 	this.movesRemaining-=1;
					 }
					 perimeter[i].enable = false;
				}
				if(perimeter[i].value == 0 && perimeter[i].enable){
					this.getSafeBoxes(pRow, pCol);
				}
			}
		}
	}

	Game.prototype.showAllBoxes = function(){
		var boxes = this.board.getAll();
		
		for(var i = 0; i < boxes.length; i++) {
			for(var j = 0; j < boxes[i].length; j++) {
				var box = this.board.get(i,j);
				var cell = boardTable.rows[i].cells[j];

				box.enable = false;
				if(box.value != -1){
					//if(cell.innerHTML===''){
						cell.className = "over"; 
						cell.innerHTML = box.value > 0 ? box.value : "";
						cell.style.color = colorValues[box.value];
					//}
				}else{
					if(cell.className!='flag')
						cell.className = "mine";
				}
			}
		}
	}

	Game.prototype.showAllMines = function(){
		var mines = this.board.getAllByValue(-1);
		
		for (var i = 0; i < mines.length; i++) {
			var mRow = mines[i].row;
			var mCol = mines[i].col;
			boardTable.rows[mRow].cells[mCol].className = "mine"; 	
		}
	}

	var game;
	
	function selectBox(cell){
		var row = cell.parentElement.rowIndex;
		var col = cell.getAttribute("id");
		var boxTarget = game.board.get(row,col);

		if(cell.className == "flag"){
			return;
		}
		if(boxTarget.enable){
			switch(boxTarget.value){
				case -1: 
					game.showAllBoxes();
					cell.className = "boom";
					showMessage(2);
				break;
				case 0: 	
					game.getSafeBoxes(row, col);
				break;
				default:
					boxTarget.enable = false;
					cell.className = "safe";
					cell.style.color = colorValues[boxTarget.value];			
					cell.innerHTML = boxTarget.value;	
					game.movesRemaining-=1;
				break;
			}
			if(game.movesRemaining==0){
				showMessage(1);
			}
		}
	}
	
	function setFlag(cell){
		var row = cell.parentElement.rowIndex;
		var col = cell.getAttribute("id");
		var boxTarget = game.board.get(row,col);
		var minesRemaining = parseInt(inputMines.value);

			if(boxTarget.enable){
				if(cell.className != "flag"){
					if(boxTarget.value==-1){
						game.activeMines-=1;
						if(game.activeMines==0){
							game.showAllBoxes();
							showMessage(1);
						}
					}
					if(minesRemaining>0){
						cell.className = "flag";
						inputMines.value = minesRemaining -1
					}
				}else{
					if(boxTarget.value==-1){
						game.activeMines+=1;
					}
					cell.className = "";
					inputMines.value = minesRemaining +=1;

				}
			}		
	}

	function scanPerimeter(cell){
		if(game.showHelp){
			var row = cell.parentElement.rowIndex;
			var col = cell.getAttribute("id");
			var targetBox = game.board.get(row,col);
			var perimeter = targetBox.perimeter;
			var color = targetBox.value == -1 ? "#ffcccc" : "#b1c9ef";
			cell.setAttribute("bgcolor",color);

				for(var i = 0; i< perimeter.length; i++){
					pRow = perimeter[i].row;
					pCol = perimeter[i].col;
					cell = boardTable.rows[pRow].cells[pCol];
					color = game.board.get(pRow, pCol).value == -1 ? "#ffcccc" : "#b1c9ef";
	 				cell.setAttribute("bgColor", color);
				}	
		}	
	}
	
	function hidePerimeter(cell){
		if(game.showHelp){
			var row = cell.parentElement.rowIndex;
			var col = cell.getAttribute("id");
			var targetBox = game.board.get(row,col);
			var perimeter = targetBox.perimeter;
			cell.setAttribute("bgColor", "");
				for(var i = 0; i< perimeter.length; i++){
					pRow = perimeter[i].row;
					pCol = perimeter[i].col;
					cell = boardTable.rows[pRow].cells[pCol];
					cell.setAttribute("bgColor", "");
				}
		}		
	}	

	function showMessage(value){
		switch (value)
		{
			case 1:
				divMessage.className = "alert alert-success";
				lblMessage.innerHTML = "you win this time!";
				break;
			case 2:
				divMessage.className = "alert alert-danger";
				lblMessage.innerHTML = "Boom!!!";
				break;
			default:
				divMessage.className = "";
				lblMessage.innerHTML = "";
				break;			
		}
	}

	btnStart.addEventListener("click", function(){
		boardTable.innerHTML = "";
		level = inputLevel.value;
	    game = new Game(level);

	    game.showHelp = false;
	    if(!game.showHelp){
	    	boardTable.style.backgroundColor = "#d9d9d9";
	    }

		inputMines.value = game.board.level.mines;
		showMessage(0);
	});
	
}