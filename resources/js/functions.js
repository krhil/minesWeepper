window.onload = function(){

	var boardTable  = document.getElementById("board");
	var inputLevel  = document.getElementById("level");
	var chkScan 	= document.getElementById("chkScan");
	var inputMines  = document.getElementById("mines");
	var btnStart    = document.getElementById("btnStart");	
	var divMessage  = document.getElementById("divMessage");
	var lblMessage  = document.getElementById("lblMessage");
	var timerDiv  	= document.getElementById("divTimer");
	var timer;

	var colorValues = { 1:'#0066ff', 2:'#009933', 3:'#ff3300', 4:'#002699', 5:'#cc3300', 6:'#ff6699', 7:'#ffff00' };
	//scan colors
	var scanColors = {safe: "#b1c9ef", mine: "#ffcccc"};

	function buildBoard(game){
		boardTable.innerHTML = "";
		var boxes = game.board.getAll();

		for(var i =0; i<boxes.length ; i++){
			var row = boardTable.insertRow(i);
			row.setAttribute("id",i);
			for(var j =0; j<boxes[i].length ; j++){
				var box = boxes[i][j];
				var cell = row.insertCell(j);
				cell.setAttribute("id",j);

				cell.addEventListener("click", function(){
					selectBox(this, game);
				});		
				cell.addEventListener("contextmenu", function(e){
					e.preventDefault();
					setFlag(this, game);
				},false);

				cell.addEventListener("mousemove", function(){
					scanPerimeter(this, game);
				});
				cell.addEventListener("mouseout", function(){
					hidePerimeter(this, game);
				});		
			}
		}
	}

	function showAllBoxes(game){
		var boxes = game.board.getAll();
		
		for(var i = 0; i < boxes.length; i++) {
			for(var j = 0; j < boxes[i].length; j++) {
				var box = game.board.get(i,j);
				var cell = boardTable.rows[i].cells[j];

				box.enable = false;
				if(box.value != -1){
						cell.className = "over"; 
						cell.innerHTML = box.value > 0 ? box.value : "";
						cell.style.color = colorValues[box.value];
				}else{
					if(cell.className!='flag')
						cell.className = "mine";
				}
			}
		}
	}

	function getSafeBoxes(game, row, col){
		var targetBox = game.board.get(row,col);
		targetBox.enable = false;

		if(targetBox.value !=0){
			boardTable.rows[pRow].cells[pCol].innerHTML = targetBox.value;
			boardTable.rows[pRow].cells[pCol].className = "safe";
			game.movesRemaining-=1;
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
					 	game.movesRemaining-=1;
					 }
					 perimeter[i].enable = false;
				}
				if(perimeter[i].value == 0 && perimeter[i].enable){
					getSafeBoxes(game, pRow, pCol);
				}
			}
		}
	}

	function selectBox(cell, game){
		var row = cell.parentElement.rowIndex;
		var col = cell.getAttribute("id");
		var boxTarget = game.board.get(row,col);

		if(cell.className == "flag"){
			return;
		}
		if(boxTarget.enable){
			switch(boxTarget.value){
				case -1: 
					showAllBoxes(game);
					cell.className = "boom";
					showMessage(2);
					finishGame();
				break;
				case 0: 
					cell.style.color = "#bfbfbf";	
					getSafeBoxes(game, row, col);
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
				showAllBoxes(game);
				inputMines.value = 0;
				showMessage(1);
				finishGame();
			}
		}
	}
	
	function setFlag(cell, game){
		var row = cell.parentElement.rowIndex;
		var col = cell.getAttribute("id");
		var boxTarget = game.board.get(row,col);
		var minesRemaining = parseInt(inputMines.value);

		if(boxTarget.enable){
			if(cell.className != "flag"){
				if(boxTarget.value==-1){
					game.activeMines-=1;
					if(game.activeMines==0){
						showAllBoxes(game);
						showMessage(1);
						finishGame();
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

	function scanPerimeter(cell, game){
		if(game.showHelp){
			var row = cell.parentElement.rowIndex;
			var col = cell.getAttribute("id");
			var targetBox = game.board.get(row,col);
			var perimeter = targetBox.perimeter;
			var color = targetBox.value == -1 ? scanColors.mine : scanColors.safe;
			cell.setAttribute("bgcolor",color);

				for(var i = 0; i< perimeter.length; i++){
					pRow = perimeter[i].row;
					pCol = perimeter[i].col;
					cell = boardTable.rows[pRow].cells[pCol];
					color = game.board.get(pRow, pCol).value == -1 ? scanColors.mine : scanColors.safe;
	 				cell.setAttribute("bgColor", color);
				}	
		}	
	}
	
	function hidePerimeter(cell, game){
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

	function startGame(){
		level = inputLevel.value;
	    game = new Game(level);
	    buildBoard(game);

	    chkScan.addEventListener("change", function(){
			boardTable.style.backgroundColor = this.checked ? "" : "#d9d9d9";
			game.showHelp = chkScan.checked;
		})
		game.showHelp = chkScan.checked;
	   
	    if(!game.showHelp){
	    	boardTable.style.backgroundColor = "#d9d9d9";
	    }

		timer = new Timer();
		timer.start();
		timer.addEventListener('secondsUpdated', function (e) {
		    timerDiv.innerHTML = timer.getTimeValues().toString();
		});

		inputMines.value = game.board.level.mines;
		showMessage(0);
	}

	function finishGame(){
		var finishTime = timerDiv.innerHTML;;
		timer.stop();
		timerDiv.innerHTML = finishTime;
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

	btnStart.addEventListener("click", function(){ startGame() });
	
}