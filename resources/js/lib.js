
function Box(row, col){

	this.row = row;
	this.col = col;
	this.value = 0;
	this.perimeter = new Array();
	this.loadPerimeter();
}

Box.prototype.loadPerimeter = function(){

	if(this.row == 0){
		if(this.col == 0){
			this.perimeter.push([this.row+1, this.col]);
			this.perimeter.push([this.row+1, this.col+1]);
			this.perimeter.push([this.row, this.col+1]);
		}else if(this.col == 15){
			this.perimeter.push([this.row, this.col-1]);
			this.perimeter.push([this.row+1, this.col-1]);
			this.perimeter.push([this.row+1, this.col]);		
		}else{
			this.perimeter.push([this.row, this.col-1]);
			var i = this.row+1;
			var j = this.col-1;
			while(j<=this.col+1){
				this.perimeter.push([i, j]);
				j++;
			}
			this.perimeter.push([this.row, this.col + 1]);
		}
	}else if(this.row == 15){
		if(this.col == 0){
			this.perimeter.push([this.row-1, this.col]);
			this.perimeter.push([this.row-1, this.col+1]);
			this.perimeter.push([this.row, this.col+1]);
		}else if(this.col == 15){
			this.perimeter.push([this.row, this.col-1]);
			this.perimeter.push([this.row-1, this.col-1]);
			this.perimeter.push([this.row-1, this.col]);			
		}else{
			this.perimeter.push([this.row, this.col-1]);
			this.perimeter.push([this.row, this.col+1]);
			var i = this.row-1;
			var j = this.col-1;
			while(j<=this.col+1){
				this.perimeter.push([i, j]);
				j++;
			}
		}
	}else{
		if(this.col == 0){
			this.perimeter.push([this.row-1, this.col]);
			var i = this.row-1;
			var j = this.col+1;
			while(i<=this.row+1){
				this.perimeter.push([i, j]);
				i++;
			}		
			this.perimeter.push([this.row+1, this.col]);	
		}else if(this.col == 15){
			this.perimeter.push([this.row-1, this.col]);
			var i = this.row-1;
			var j = this.col-1;
			while(i<=this.row+1){
				this.perimeter.push([i, j]);
				i++;
			}				
			this.perimeter.push([this.row+1, this.col]);
		}else{
			var i = this.row-1;
			var j = this.col-1;
			while(i<=this.row+1){
				this.perimeter.push([i, j]);
				i++;
			}
			this.perimeter.push([this.row+1, this.col]);
		    i = this.row+1;
		    j = this.col+1;
			while(i>=this.row-1){
				this.perimeter.push([i, j]);
				i--;
			}
			this.perimeter.push([this.row-1, this.col]);
		}
	}
	


	/*for (var i = 0; i < this.perimeter.length; i++) {
		console.log(this.perimeter[i]);
	}*/
}