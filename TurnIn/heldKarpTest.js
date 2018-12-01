//Peter Day (W09709121)
//Jordan Ruckle (W08264328)
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

//Returns distance between two cities
function distLookup(city1, city2)
{
	var len = distances.length;
	if (city1 >= len)
	{
		console.log("city1 is out of bounds.");
	}
	else if (city2 >= len)
	{
		console.log("city2 is out of bounds.");
	}
	else
	{
	    return distances[city1][city2];
	}
	return;
}

//Removes 'remove' from cities and returns new array
function subset(cities, remove)
{
	var newArray = [];
	for (var i = 0; i<cities.length; i++)
	{
		newArray[i] = cities[i];
	}
	var index = newArray.indexOf(remove);
	newArray.splice(index, 1);
	return newArray;
}

//Recursive Dynamic Held-Karp implementation
//cities - is list of cities yet not-visited
function heldKarp(cities, start)
{
	//if distance has already been calculated return that
	var key = JSON.stringify(cities);
	if (cache[key] === undefined)
	{
		cache[key] = [];
	}
	if (cache[key][start] !== undefined)
	{
		return cache[key][start];
	}	
	if (cities.length == 2)
	{
		return distLookup(cities[0], cities[1]);
	}
	else
	{
		var result = Infinity;
		//For each city in cities
		for (var i = 0; i < cities.length; i++)
		{
			//unless it is start
			if (cities[i] != start)
			{
				var newSet = subset(cities, start);
				var distSC = distLookup(start, cities[i]);
				result = Math.min(result, heldKarp(newSet, cities[i]) + distSC);
			}
		}
		cache[key][start] = result;
		return result;
	}
}


//Generates list from 0->n
function createCitiesNotVisited(len)
{
	var notVisited = [];
	for (var i = 0; i < len; i++)
	{
		notVisited.push(i);
	}
	return notVisited;
}

//Runs Held-Karp for each starting city
//Keeps track of minimum distance
function heldKarpDriver(cities)
{
	var minDist = Infinity;
	var minStart = undefined;
	for (var i = 0; i<cities.length; i++)
	{
		var dist = heldKarp(cities, i);
		if (dist < minDist)
		{
			minDist = dist;
			minStart = i;
		}
	}
	console.log("Min Dist is ", minDist," starting at city ",minStart);
	return minDist
}

//MAIN----------------------------------------

//Repeats for testing and saving data
var allResults = [];
for (var n = 3;n<9; n+=1)
{
	console.log("start n: ", n);
	var results = [];
	var hKAnswer = [];
	results.push(n); //data size
	//Read in nxn csv data files
	var filename = n + "x" + n + "Data.csv";
	var distances = readFile(filename);
    distances = str2Int(distances);
	var cache = [];
	var initCityList = createCitiesNotVisited(distances.length);
	//Time running of HK Driver and HK
	startTime = new Date();
	hKAnswer = (heldKarpDriver(initCityList));
	stopTime = new Date();
	var runTime = stopTime - startTime;
	results.push(hKAnswer); //minDist
	results.push(runTime); //time hK ran (ms)
	console.log(results);
	allResults.push(results);
	//Save results to file
	//https://stackoverflow.com/questions/17614123/node-js-how-to-write-an-array-to-file
	var fs = require('fs');
	var filename = "heldKarp_" + n + "_Results.csv";
	var file = fs.createWriteStream(filename);
	file.on('error', function(err) { /* error handling */ });
	allResults.forEach(function(v) { file.write(v.join(', ') + '\n'); });
	file.end();
	console.log("n: ", n);

}
