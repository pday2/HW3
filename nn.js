
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

//input:
function returnCities(matrix)
{
	var cities = [];
	for (var i = 0; i<matrix.length; i++)
	{
		cities.push(matrix[i][0]);
	}
	return cities;
}

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
//
function nearNeigh(matrix, start)
{
	var visited = [];
	var solution = [];
	var current = start;
	visited.push(current);
	solution.push([current,0]);
	while (visited.length<matrix.length)
	{
		//console.log("visited: ", visited);
		var min = Infinity;
		var minIndex = current;
		for (var i = 0; i<matrix.length; i++)
		{
			//console.log("i: ",i, "\t\tcurrent: ",current);
			if (matrix[current][i]<min && visited.indexOf(i)==-1)
			{
				min = matrix[current][i];
				minIndex = i;
				//console.log("min: ",min, "\t\tminIndex: ",minIndex);
			}
		}
		current = minIndex;
		var next = [minIndex,min];
		//console.log(next);
		solution.push(next);
		visited.push(minIndex);
	}
	return(solution);
}

//input: distance matrix
//output: a randomized route matrix
function randomSolution(matrix)
{
	var visited = [];
	var solution = [];
	var current = Math.floor(Math.random() * 18);
	visited.push(current);
	solution.push([current,0]);
	while (visited.length<matrix.length)
	{
		for (var i = 0; i<matrix.length; i++)
		{
		    do {
				var rdm = Math.floor(Math.random() * 18);
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
//output: prints stops and distances
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
//notes
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
/* if ((typeof distances[1][0]) == "string")
{
	var cities = returnCities(distances);
	distances = returnDist(distances);
} */
//var answer = randomSolution(distances);
//console.log(answer);
//printCities(answer, cities);

distances = str2Int(distances);
var answer = nearNeigh(distances, 0);
//var answer = randomSolution(distances);
//printAnswer(answer);

//var test = [[0,0], [1,10], [2,20], [3,30], [4,40], [5,50], [6,60], [7,70], [8,80], [9,90]];
twoOptNewRoute(distances, answer);

