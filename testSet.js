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
		if ((minDist/averageDistance > 0.995) && (counter > (40*len)))
		{
			procede = false;
		}
		counter++;
	}
	return minRoute;
}

// a simple function to start the timer
function startTimer()
{
  startTime = new Date();
};

// ends the timer started above
function stopTimer()
{
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



console.log("===The input is 15 cities===")
console.log("1st iteration")
var distances = createData(15);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("===The input is 16 cities===")
console.log("1st iteration")
var distances = createData(16);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("===The input is 17 cities===")
console.log("1st iteration")
var distances = createData(17);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("===The input is 18 cities===")
console.log("1st iteration")
var distances = createData(18);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("===The input is 19 cities===")
console.log("1st iteration")
var distances = createData(19);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("===The input is 20 cities===")
console.log("1st iteration")
var distances = createData(20);
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("2nd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("3rd iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("4th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")



console.log("5th iteration")
var answer = randomSolution(distances);
startTimer();
console.log("The minimum distance found using the SLS function is: ", totalDistance(SLS(distances, answer)));
var seconds = stopTimer();
console.log("It took", seconds, "to generate this number\n")

//15 cities
//1st iteration: 16700 seconds
//2nd iteration: 6249 seconds
//3rd iteration: 5452 seconds

