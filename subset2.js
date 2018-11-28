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

//input: distance matrix and route order
//output: distance of the route
function findDistance(routeList)
{
	var len = routeList.length;
	var sum = 0;
	var current = routeList[0];
	var next = routeList[1];
	for (var i = 1; i<len; i++)
	{
		sum += distances[current][next];
		current = routeList[i];
		next = routeList[i+1];
	}
	return sum;
}

function allPermutation(list)
{
	for (var i = 0; i<factorial(list.length); i++)
	{
		var route = kthpermutation(list, i);
		console.log(route);
	}
	return;
}

//returns sum of a list
function sum(list)
{
	var sum = 0;
	for (var i = 0; i<list.length; i++)
	{
		sum += list[i];
	}
	return sum;
}

//returns sorted matrix by sum of rows
function sortData(data)
{
  data.sort(function(a,b){
    return (sum(a)-sum(b))
  });
  return(data);
}

//returns all subsets in binary representation of length len
//that have at least 2 elements (cities)
function binarySubsets(len)
{
	var allSubsets = [];
	for (var i = 2; i< (Math.pow(2, len)); i++)
	{
		allSubsets.push([]);
		var bin = i.toString(2);
		for (var j = 0; j<len; j++)
		{
			if (j < (len-bin.length))
			{
				allSubsets[i-2].push(0);
			}
			else
			{
				allSubsets[i-2].push(parseInt(bin.charAt(j-(len-bin.length))));
			}
		}
	}
	for (var i = 0; i<allSubsets.length; i++)
	{
		var sum = 0;
		for (var j = 0; j<len; j++)
		{
			sum += allSubsets[i][j];
		}
		if (sum < 2)
		{
			allSubsets.splice(i,1);			
		}
	}
	return allSubsets;
}

function choose(n, k)
{
	var num = factorial(n);
	var denom = factorial(k)*factorial(n-k);
	var combos = num/denom;
	return combos;
}

function bottomUp(subsets)
{
	var len = subsets[0].length;
	var advance = 0;
	for (var i = 2; i<=len; i++)
	{
		console.log("START IIIIIIII LOOP");
		var allSubPerms = [];
		var minDist = Infinity;
		var minRoute = [];
		//repeat for all subsets with i cities
		//size of city list increases every choose(len, i) iterations
		for (var j = 0; j<choose(len, i); j++)
		{
			console.log("STARTING JJJJJJJJ LOOP");
			var checkDist = [];
			console.log("i: ", i, "\tj: ",j);
			console.log(subsets[j+advance]);
			//loop over all combos of lists of i cities
			for (var k = 0; k<len; k++)
			{
				//collect cities in subset
				if (subsets[j+advance][k] == 1)
				{
					checkDist.push(k); //checkDist is city route to try
				}
			}
			console.log(checkDist);
			console.log("----------------",checkDist);
			//try all permutations of lists of length i
			for (var k = 0; k<factorial(i); k++)
			{
				allSubPerms.push(kthpermutation(checkDist, k));
				
			}
			//Find distances for all subset permutations and store minimum route
			for (var k = 0; k<allSubPerms.length; k++)
			{
				if(findDistance(allSubPerms[k]) < minDist)
				{
					minDist = findDistance(allSubPerms[k]);
					minRoute = allSubPerms[k];
				}
			}
			
		}
		console.log("min Dist: ", minDist);
	    console.log("min Route: ", minRoute);
		advance += choose(len, i); //advance to next size subset
	}
	
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
  
var leng = distances.length;
var sbsts = binarySubsets(leng);
sortData(sbsts);
bottomUp(sbsts);
