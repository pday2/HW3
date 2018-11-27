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
		//console.log("Quotient: ", quotient);
		var remainder = parseInt(k%factorial(i));
		//console.log("Remainder: ", remainder);
		result.push(array[quotient]);
		
		var temp = array[quotient];
		
		array = (array.slice(0,quotient)).concat(array.slice(quotient+1));
		
		k = remainder;
	}
	return result;
}

var arry = [1,2,3,4];
for (var i = 0; i<factorial(arry.length); i++)
{
	console.log(kthpermutation(arry, i));
}