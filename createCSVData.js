

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
				matrix[i].push(Math.floor(Math.random() * 100) + 1);
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

for (var i = 3; i<51; i += 1)
{
	var data = createData(i);
	//https://stackoverflow.com/questions/17614123/node-js-how-to-write-an-array-to-file
	var fs = require('fs');
	var filename = i + "x" + i + "Data.csv";
	var file = fs.createWriteStream(filename);
	file.on('error', function(err) { /* error handling */ });
	data.forEach(function(v) { file.write(v.join(', ') + '\n'); });
	file.end();
}


