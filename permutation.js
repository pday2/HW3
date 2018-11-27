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

var arry = [0,1,2,3];
for (var i = 0; i<factorial(arry.length); i++)
{
	console.log(kthpermutation(arry, i));
}