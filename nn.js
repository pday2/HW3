
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

//input: for use with Bundesliga.csv
function returnCities(matrix)
{
	var cities = [];
	for (var i = 0; i<matrix.length; i++)
	{
		cities.push(matrix[i][0]);
	}
	return cities;
}

//input: for use with Bundesliga.csv
function returnDist(matrix)
{
	var distances = [];
	for (var i = 0; i<matrix.length; i++)
	{
		distances.push([0]);
		for (var j = 1; j<matrix.length+1; j++)
		{
			distances[i][j-1] = matrix[i][j];
		}
	}
	return distances;
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
	console.log(vector);
	var sum = 0;
	for (var i = 0; i<vector.length; i++)
	{
		sum += vector[i][1];
		console.log(vector[i][1].toString(), "\t", vector[i][0]);
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
	var diff = ((k+1)-i)/2;
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
function findDistance(matrix, route)
{
	console.log(route);
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
	return newRoute;
}

//input: distance matrix, route matrix with a
//       non-optimized route
//output: optimized route with distances.
//notes... not quite done yet???
function twoOptNewRoute(matrix, route)
{
	console.log("twoOptNewRoute");
	var len = matrix.length;
	var prevRoute = route;
	console.log("length: ", len);
	for (var i = 0; i<len; i++)
	{
		console.log("i: ",i);
		for (var k = len-1; k>(i+1); k--)
		{
			console.log("\tk: ",k);
			var tryThis = twoOptSwap(prevRoute, i, k)
			console.log(tryThis);
			route = findDistance(matrix, tryThis);
			printAnswer(route);
		}
	}
}

//MAIN----------------------------------------
//var file = "Bundesliga.csv";
//var file = "att48_d.csv";
var file = "five_d.csv";
var distances = readFile(file);
console.log(distances);

//This is for Bundesliga.csv - you can igonore or remove
/* if ((typeof distances[1][0]) == "string")
{
	var cities = returnCities(distances);
	distances = returnDist(distances);
} */


distances = str2Int(distances);
var answer = nearNeigh(distances, 0);

//testing randomSolution - looks like it works now!!!
var answer2 = randomSolution(distances, 0);
console.log("Random Solution");
printAnswer(answer2);
console.log();


//var answer = randomSolution(distances);
//printAnswer(answer);

twoOptNewRoute(distances, answer);

