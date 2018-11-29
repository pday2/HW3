
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
				matrix[i].push(Math.floor(Math.random() * 99) + 1);
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
		if ((minDist/averageDistance > 0.994) && (counter > (40*len)))
		{
			procede = false;
		}
		counter++;
	}
	return minRoute;
}

function reduceDistMatrix(city, distMatrix)
{
	var newMatrix = [];
	for (var i = 0; i<distMatrix.length; i++)
	{
		newMatrix.push([]);
		for (var j = 0; j<distMatrix.length; j++)
		{
			newMatrix[i][j] = distMatrix[i][j];
		}
	}
	newMatrix.splice(city, 1);
	for (var i = 0; i<newMatrix.length; i++)
	{
		newMatrix[i].splice(city, 1);
	}
	return newMatrix;
}

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

//Removes remove from cities and returns new array
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

//cities - not-visited
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

	if (cities.length < 2)
	{
		return;
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



function createCitiesNotVisited(len)
{
	var notVisited = [];
	for (var i = 0; i < len; i++)
	{
		notVisited.push(i);
	}
	return notVisited;
}


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
	// console.log("Min Dist is ", minDist," starting at city ",minStart);
	return minDist
}

// a simple function to start the timer
function startTimer() {
  startTime = new Date();
};

// ends the timer started above
function stopTimer() {
  endTime = new Date();
  var type = "milliseconds";
  var timeDiff = endTime - startTime; // in milliseconds
  // remove milliseconds
  if (timeDiff > 1000)
  {
    timeDiff /= 1000;
    type = "seconds";
  }
  var string = (Math.round(timeDiff) + " " + type);

  // get seconds
  return string;
}

//MAIN----------------------------------------
//var file = "att48_d.csv";
//var file = "18_city.csv";
//var file = "five_d.csv";
//var distances = readFile(file);
//distances = str2Int(distances);
var cache = [];

console.log("\n\n=========================================================");
console.log("To begin, we will try a set of 15 cities with distances varying from 1 to 100");
console.log("We will steadily increase this number over the course of testing");
console.log("The Held Karp function will run, followed by the Stochastic Local Search");
console.log("If all goes according to plan, the SLS function will perform similarly to Held Karp at smaller inputs but will quickly outperform Held Karp at larger inputs");
console.log("=========================================================\n\n");
var distances = createData(15);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 16 cities with distances varying from 1 to 100");
var distances = createData(16);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 17 cities with distances varying from 1 to 100");
var distances = createData(17);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 18 cities with distances varying from 1 to 100");
var distances = createData(18);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 19 cities with distances varying from 1 to 100");
var distances = createData(19);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 20 cities with distances varying from 1 to 100");
var distances = createData(20);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 21 cities with distances varying from 1 to 100");
var distances = createData(21);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("The input is now 22 cities with distances varying from 1 to 100");
var distances = createData(22);
startTimer();
var dist = heldKarpDriver(createCitiesNotVisited(distances.length));
var seconds = stopTimer();
console.log("The minimum distance found using the Held Karp function is: ", dist);
console.log("It took", seconds, "to generate this number")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")
