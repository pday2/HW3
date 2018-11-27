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

function factorial(n)
{
	var result = 1;
	for (var i = 1; i<=n; i++)
	{
		result *= i;
	}
	return result;
}

//http://keithschwarz.com/talks/slides/fun-with-number-systems.pdf
function kthpermutation(array, k)
{
	var result = [];
	for (var i = array.length-1; i>=0; i--)
	{
		var quotient = parseInt(k/factorial(i));
		var remainder = parseInt(k%factorial(i));
		result.push(array[quotient]);
		array = (array.slice(0,quotient)).concat(array.slice(quotient+1));
		k = remainder;
	}
	return result;
}

function allPermutations(list)
{
	var distList = [];
	for (var i = 0; i<factorial(list.length); i++)
	{
		var route = kthpermutation(list, i);
		console.log(route);
		var sum  = sumDistances(distances, route);
		console.log("SUM: ", sum);
		distList.push(sum);
	}
	return distList;
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

//input: distance matrix and route order
//output: distance of the route
function sumDistances(distMatrix, routeList)
{
	var len = routeList.length;
	var sum = 0;
	var current = routeList[0];
	var next = routeList[1];
	for (var i = 1; i<len; i++)
	{
		console.log("Current: ", current, "\tNext: ", next);
		sum += distMatrix[current][next];
		current = routeList[i];
		next = routeList[i+1];
	}
	console.log("sum: ", sum);
	return sum;
}



//MAIN----------------------------------------------

//var file = "five_d.csv";
//var distances = readFile(file);
//distances = str2Int(distances);
var three = [ [0, 3, 5],
              [3, 0, 7],
			  [5, 7, 0] ];
var four = [ [0, 3, 5, 7],
             [3, 0, 9, 13],
			 [5, 9, 0, 15],
			 [7, 13, 15, 0] ];
//var distances = four;
var distances = [ [ 0, 3, 4, 2, 7 ],
  [ 3, 0, 4, 6, 3 ],
  [ 4, 4, 0, 5, 8 ],
  [ 2, 6, 5, 0, 6 ],
  [ 7, 3, 8, 6, 0 ] ];

var arry = createCitiesNotVisited(distances.length)
var distanceList = allPermutations(arry);
console.log(distanceList);
console.log("MIN: ", Math.min(...distanceList));