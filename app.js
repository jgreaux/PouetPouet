const uno = document.getElementById("charge_1")
const dos = document.getElementById("charge_2")
const tres = document.getElementById("charge_3")
const quatro = document.getElementById("charge_4")

let fillUno = 25;
let fillDos = 25;
let fillTres = 25;
let fillQuatro = 25;

function display() {
	uno.style = `height:${fillUno}%`
	dos.style = `height:${fillDos}%`
	tres.style = `height:${fillTres}%`
	quatro.style = `height:${fillQuatro}%`
}

const handleUno = ()=>{
	fillUno += 15
	fillDos -= 5
	fillTres -= 5
	fillQuatro -= 5
	display()
}
const handleDos = ()=>{
	fillUno -= 5
	fillDos += 15
	fillTres -= 5
	fillQuatro -= 5
	display()
}
const handleTres = ()=>{
	fillUno -= 5
	fillDos -= 5
	fillTres += 15
	fillQuatro -= 5
	display()
}
const handleQuatro = ()=>{
	fillUno -= 5
	fillDos -= 5
	fillTres -= 5
	fillQuatro += 15
	display()
}

display()