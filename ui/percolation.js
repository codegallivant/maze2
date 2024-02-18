class Percolation {
    // creates this.n-by-this.n grid, with all sites initially blocked
    constructor(dim) {
        this.n = dim;
        if (this.n <= 0) {
            console.log("this.n<=0: throw new IllegalArgumentException();");
        }
        var len = this.n**2;
        
        this.value_grid = [];
        for(var i=0;i<len;i++) {
            this.value_grid[i] = 0;
        }
        
        this.id_grid = [];
        for(var i=0;i<len;i++) {
            this.id_grid[i] = i;
        }

        this.sizes = [];
        for(var i=0;i<len;i++) {
            this.sizes[i] = 1;
        }
    }

    get_index(row, col) {
        return ((row-1)*this.n)+col-1;
    }

    validate(row, col) {
        var b = (row < 1) || (col < 1) || (row > this.n) || (col > this.n);
        if (b) {
            console.log("validate row, col: throw new IllegalArgumentException()");
            console.log([row,col]);
            return false;
        }
    }

    // opens the site (row, col) if it is not open already
    open(row, col) {
        this.validate(row, col);
        var index = this.get_index(row, col);
        this.value_grid[index] = 1;
        // Union with adjacent open boxes
        var index2;
        if (row < this.n) {
            if(this.isOpen(row+1, col)) {
                index2 = this.get_index(row+1, col);
                this.union(index, index2);
            }
        }
        if (col < this.n) {
            if(this.isOpen(row, col+1)) {
                index2 = this.get_index(row, col+1);
                this.union(index, index2);
            }
        }
        if (row > 1) {
            if(this.isOpen(row-1, col)) {
                index2 = this.get_index(row-1, col);
                this.union(index, index2);
            }
        }
        if (col > 1) {
            if(this.isOpen(row, col-1)) {
                index2 = this.get_index(row, col-1);
                this.union(index, index2);
            }
        }
    }

    // is the site (row, col) open?
    isOpen(row, col) {
        if(this.validate(row, col) == false) {
            return false;
        }
        var i = this.get_index(row, col);
        return (this.value_grid[i] == 1);
    }

    union(index1, index2) {
        var root1 = this.get_root(index1);
        var root2 = this.get_root(index2);
        if (this.sizes[root1]<this.sizes[root2]) {
            this.id_grid[root1] = root2;
            this.sizes[root2] += this.sizes[root1];
        }
        else {
            this.id_grid[root2] = root1;
            this.sizes[root1] += this.sizes[root2];
        }
    }

    get_root(i) {
        while(this.id_grid[i] != i) {
            this.id_grid[i] = this.id_grid[this.id_grid[i]];
            i = this.id_grid[i];
        }
        return i;
    }
    
    connected(index1, index2) {
        return this.get_root(index1) == this.get_root(index2);
    }

    // is the site (row, col) full?
    isFull(row, col) {
        this.validate(row, col);
        // Check whether root id is in 1st row i.e. between 0 to this.n
        var index = this.get_index(row, col);
        // print(row, col, index, get_root(index))
        if (this.isOpen(row, col)) {
            if(row == 1) {
                return true;
            }
            for(var i = 0; i<this.n ; i++) {
                if(this.connected(index, i) && (index != i)) {
                    return true;
                }
            }
        }
        return false;
    }
       

    // returns the number of open sites
    numberOfOpenSites() {
        var count = 0;
        var s;
        for(var i = 0; i<this.value_grid.length; i++) {
            s = this.value_grid[i];
            if(s == 1) {
                count = count + 1;
            }
        } 
        return count;
    }


    // does the system percolate?
    percolates() {
        // Check whether any elements in the last row are percolable(full)
        for(var i=1;i<this.n+1;i++) {
            if(this.isFull(this.n, i)) {
                return true;
            }
        }
        return false;
    }
}
