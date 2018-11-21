
//File must be in same dir as js program
function readFile(file)
{
	var textByLine = [];
	const fs = require("fs");
	var filename = "./" + file;
	const fd = fs.openSync(file, 'r');
	var txt = fs.readFileSync(file).toString('utf-8');
	var textByLine = txt.split("\n");
	//make 2D array, by splitting csv at commas
	//also remove \r from each line
	for (var i = 0; i<textByLine.length; i++)
	{
		textByLine[i] = textByLine[i].replace("\r", "");
		textByLine[i] = textByLine[i].split(",");
	}
	textByLine.splice((textByLine.length-1),1);
	fs.closeSync(fd);
	return textByLine;
}


//input: matrix of strings as read in from csv
//output: matrix of integers
function str2Int(matrix)
{
	for (var i = 0; i<matrix.length; i++)
	{
		for (var j = 0; j<matrix.length; j++)
		{
			matrix[i][j] = parseInt(matrix[i][j]);
		}
	}
	return matrix;
}

//Creates an nxn symmetrix matrix with 0 on diagonal
//Input: matrix size
//Output: nxn TSP approved matrix
function createData(n)
{
	var matrix = [];
	for (var i = 0; i<n; i++)
	{
		matrix.push([]);
		for (var j = 0; j<n; j++)
		{
			if (i==j)
			{
				matrix[i].push(0);
			}
			else
			{
				matrix[i].push(Math.floor(Math.random() * n) + 17);
			}
		}
	}
	for (var i = 0; i<n; i++)
	{
		for (var j = 0; j<n; j++)
		{
			matrix[i][j] = matrix[j][i];
		}
	}
	return matrix;
}

//input: distance matrix and starting point
//output: a route solution
//        solution[i][0] = 'city'
//		  solution[i][1] = distance from last city
function nearNeigh(matrix, start)
{
	var visited = [];
	var solution = [];
	var current = start;
	//update list of visited cities with the start city
	visited.push(current);
	//update solution with start city and distance 0
	solution.push([current,0]);
	//loop while # of visited cities is less than 
	//total number of cities
	while (visited.length<matrix.length)
	{
		//initialize minimum to infinity
		var min = Infinity;
		//initialize minIndex to current city 
		//- just a random choice could be anything
		var minIndex = current;
		//loop over all cities current
		for (var i = 0; i<matrix.length; i++)
		{
			//if distance to city i is less than min and i has not
			//been visited then update min distance from current
			if (matrix[current][i]<min && visited.indexOf(i)==-1)
			{
				min = matrix[current][i];
				minIndex = i;
				//console.log("min: ",min, "\t\tminIndex: ",minIndex);
			}
		}
		//update current to the closest city to previous current that 
		//hadn't been visited as found by previous loop
		current = minIndex;
		//put min city index and min distance into array next
		var next = [minIndex,min];
		//push this pair onto solution
		solution.push(next);
		//push min city index onto list of visited cities
		visited.push(minIndex);
	}
	return(solution);
}

//input: distance matrix
//output: a randomized route matrix
//note: fixed - problem was with my implementation of Math.random
function randomSolution(matrix)
{
	var visited = [];
	var solution = [];
	var len = matrix.length;
	var current = Math.floor(Math.random() * len);
	visited.push(current);
	solution.push([current,0]);
	while (visited.length<matrix.length)
	{
		for (var i = 0; i<matrix.length; i++)
		{
		    do {
				var rdm = Math.floor(Math.random() * len);
			}
			while (visited.indexOf(rdm)!=-1);
		}
		var next = [rdm,matrix[current][rdm]];
		current = rdm;
		solution.push(next);
		visited.push(rdm);
	}
	return(solution);
}

//input: route matrix and vector of city names
//       for use with Bundesliga.csv
//output: prints cities and distances and sum total
function printCities(vector, cities)
{
	var sum = 0;
	for (var i = 0; i<vector.length; i++)
	{
		sum += vector[i][1];
		console.log(vector[i][1].toString(), "\t", cities[vector[i][0]]);
	}
	console.log("Total Distance: ",sum);
}

//input: route
//output: prints cities and distances
function printAnswer(vector)
{
	//console.log("pA: ",vector);
	var sum = 0;
	for (var i = 0; i<vector.length; i++)
	{
		sum += vector[i][1];
		console.log("dist ",vector[i][1].toString(), "\tto city ", vector[i][0]);
	}
	console.log("Total Distance: ",sum);
}

//input: route matrix
//output: sum of distances
function totalDistance(vector)
{
	var sum = 0;
	for (var i = 0; i<vector.length; i++)
	{
		sum += vector[i][1];
	}
	return sum;
}

//input: route and swap indices
//output: swapped route
function twoOptSwap(route, i, k)
{
	var diff = ((k)-i)/2;
	//console.log("i: ", i, "\tk: ", k, "\tlenRoute: ", route.length, "\tdiff: ",diff);
	//make sure i & k values are valid
	if (diff>(route.length)/2)
	{
		console.log("difference between k and i is larger than array size.");
		return
	}
	diff = Math.floor(diff);
	var add = 0;
	for (var index = i; index<(i+diff); index++)
	{
		var temp = route[index];
		route[index] = route[k-add];
		route[k-add] = temp;
		add++
	}
	return route;
}

//input: distance matrix and route order
//output: distance of the route
function findDistances(matrix, route)
{
	// [i][0] - city number
	// [i][1] - distance
	//console.log(route);
	var previous = route[0][0];
	var current = route[0][0];
	var newRoute = [];
	newRoute.push([current,0]);
	for (var i = 1; i<route.length; i++)
	{
		current = route[i][0]
		//push current city index and distance from current to previous
		newRoute.push([current, matrix[current][previous]]);
		previous = current;
	}
	//console.log("fd nr: ",newRoute);
	return newRoute;
}

//Stochastic Local Search
//Tries random swaps on route until it converges on an answer
//Input: distance matrix and a starting route
//Output: locally optimized route
function SLS(matrix, route)
{
	var procede = true;
	var counter = 0;
	var minDist = Infinity;
	var newRouting = route;
	var tryRoute = route;
	var len = route.length;
	var ttlDistance = 0;
	var averageDistance;
	//loop until stopping criteria is met
	while (procede)
	{
		var i = Math.floor(Math.random() * (len-2) + 0);
        var k = Math.floor((Math.random() * (len-i-2) + (2+i)));
		//newRouting - new order of city, distances not updated
		newRouting = twoOptSwap(newRouting, i, k);
		//console.log("SLS nR: ",newRouting);
		//tryRoute - new order with updated distances
		var tryRoute = findDistances(matrix, newRouting);
		//total distance of tour
		var sumDistance = totalDistance(tryRoute);
		//Update minRoute if new dist < minimum distance
		if (sumDistance < minDist)
		{
			minDist = sumDistance;
			minRoute = tryRoute;
		}
		//Find average of all minimum distances
	    ttlDistance += minDist;
		averageDistance = ttlDistance/(counter+1);
		//Stopping Criteria
		//Both - minimum must be 98.5% of average of minimums
		//     - gives minimum time to stop changing
		//     - converging on an appropriate answer
		//And  - must run at least 40*(number of cities) times
		//     - with testing, this turned out to be a decent
		//     - number to avoid quitting to soon
		if ((minDist/averageDistance > 0.985) && (counter > (40*len)))
		{
			procede = false;
		}
		counter++;
	}
	console.log("COUNTER: ", counter);
	console.log("AVERAGE DISTANCE: ", averageDistance);
	return minRoute;
}

//MAIN----------------------------------------
//var file = "att48_d.csv";
//var file = "18_city.csv";
var file = "five_d.csv";
var distances = readFile(file);
distances = str2Int(distances);
//var answer1 = nearNeigh(distances, 0);

//testing randomSolution - looks like it works now!!!
//var answer2 = randomSolution(distances);
//console.log("Min Dist: ",totalDistance(SLS(distances, answer2)));

//Using function generated data for larger matrices
var genMatrix = createData(1000);
var answer3 = randomSolution(genMatrix);
console.log("Min Dist: ",totalDistance(SLS(genMatrix, answer3)));

