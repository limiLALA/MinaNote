// hasOwnProperty

var obj1 = {
	a: 1,
	b: 2
}

var obj2 = Object.create(obj1);

obj2.c = 3;
obj2.d = 4;

for (let i in obj2) {
	if (obj2.hasOwnProperty(i)) {
		document.body.innerHTML += (i + ': ' + obj2[i] + '<br>');
	}
}
