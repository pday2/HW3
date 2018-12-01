//Peter Day (W09709121)
//Jordan Ruckle
//HW3 - Travelling Salesman
//11/30/2018
//COSC 3020

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
function SLS(matrix, route, percent=0.980)
{
	var procede = true;
	var counter = 0;
	var minDist = Infinity;
	var newRouting = route;
	var tryRoute = route;
	var len = route.length;
	var ttlDistance = 0;
	var averageDistance;
	//loop until stopping criteria are met
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
		//Both - minimum must be 98.0% of average of minimums
		//     - gives minimum time to stop changing
		//     - converging on an appropriate answer
		//And  - must run at least 40*(number of cities) times
		//     - with testing, this turned out to be a decent
		//     - number to avoid quitting to soon
		if ((minDist/averageDistance > percent) && (counter > (40*len)))
		{
			procede = false;
		}
		//cap repeats at 100,000*(number of cities)
		if (counter > 100000*len)
		{
			procede = false;
		}
		counter++;
	}
	var returnResults = [];
	returnResults.push(counter);
	returnResults.push(minDist);
	return returnResults;
}


//MAIN----------------------------------------

var allResults = [];

//Repeats for testing and saving data
for (var n = 3;n<11; n+=1)
{
	for (var i = 0; i< 1; i++)
	{
		console.log("start n: ", n);
		var results = [];
		var slsAnswer = [];
		results.push(n); //data size
		results.push(i); //repeat
		//Read in nxn csv data files
		var filename = n + "x" + n + "Data.csv";
		var distances = readFile(filename);
		distances = str2Int(distances);
		var answer = randomSolution(distances); //starting with random solution
		//Time running of SLS/Two Opt Swap
		startTime = new Date();
		slsAnswer = (SLS(distances, answer, 0.980));
		stopTime = new Date();
	    var runTime = stopTime - startTime;
		results.push(slsAnswer[0]); //counter
		results.push(slsAnswer[1]); //minDist
		results.push(runTime); //time SLS ran (ms)
		console.log(results);
		allResults.push(results);
		//Save results to file
		//https://stackoverflow.com/questions/17614123/node-js-how-to-write-an-array-to-file
		var fs = require('fs');
		var filename = "TwoOptby500_" + n + "_Results.csv";
		var file = fs.createWriteStream(filename);
		file.on('error', function(err) { /* error handling */ });
		allResults.forEach(function(v) { file.write(v.join(', ') + '\n'); });
		file.end();
		console.log("n: ", n);
	}
}
