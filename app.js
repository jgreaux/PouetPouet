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
	fillDos -= fillDos > 0 ? 5 : 0
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

//canvas

class Truck {
	constructor(id) {
		this.canvas = document.getElementById(id)
		this.ctx = this.canvas.getContext("2d")
		this.state = {
			charge:{
				height: 100,
				width: 300,
				g: {x:350, y: 150}
			},
			tracking: {
				elmt:"none",
				currentX:0
			}
		}
		this.build_charge()
		this.canvas.addEventListener("mousedown", (e)=> {this.handle_click_down(e, this.canvas)})
		this.canvas.addEventListener("mouseup", (e)=> {this.handle_click_up(e, this.canvas)})
		this.canvas.addEventListener("touchstart", (e)=> {this.handle_click_down(e, this.canvas)})
		this.canvas.addEventListener("touchend", (e)=> {this.handle_click_up(e, this.canvas)})
	}
	
	build_charge(){
		const ctx = this.ctx
		const charge = this.state.charge
		const w = charge.width
		const h = charge.height
		const x = charge.g.x
		const y = charge.g.y
		const rx = x - w / 2
		const ry = y - h / 2
		
		//square charge
		ctx.beginPath()
		ctx.rect(rx, ry, w, h)
		ctx.stroke()
		
		//circle g point
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fillStyle = "black"
		ctx.fill()
		//G
		ctx.font = "10px Arial"
		ctx.fillText("G", x+5, y-5)
		//cursor arrow left
		this.build_cursor_arrow(x-w/2, y, 10)
		//cursor arrow right
		this.build_cursor_arrow(x+w/2, y, 10)
	}

	build_cursor_arrow(x, y, w){
		const ctx = this.ctx
		const left_point_x = x - w/2
		const right_point_x = x + w/2
		const height = w/2
		//left
		ctx.beginPath()
		ctx.moveTo(left_point_x, y)
		ctx.lineTo(left_point_x + w/4, y - height/2)
		ctx.lineTo(left_point_x + w/4, y + height/2)
		ctx.fillStyle = "black"
		ctx.fill()
		//right
		ctx.beginPath()
		ctx.moveTo(right_point_x, y)
		ctx.lineTo(right_point_x - w/4, y - height/2)
		ctx.lineTo(right_point_x - w/4, y + height/2)
		ctx.fillStyle = "black"
		ctx.fill()
		
	}
	
	mouse_track(e, c){
		const x = e.offsetX
		const y = e.offsetY
		if(!c.is_tracking()) return
		c.set_tracking_hpos(x,y)
		
	}
	
	handle_click_down(e, c) {
		const x = e.offsetX
		const y = e.offsetY
		let el = "none"
		if(this.is_left_arrows(x,y)){
			el = "LA"
		}else if (this.is_right_arrows(x,y)){
			el = "RA"
		}else if (this.is_G(x,y)){
			el = "G"
		}
		this.set_tracking_elmt(el)
		this.set_tracking_hpos(x)
		this.update_tracking(this)
		c.addEventListener("mousemove", (e)=> {this.mouse_track(e,this)})
		c.addEventListener("touchmove", (e)=> {this.mouse_track(e,this)})
		
	}
	
	handle_click_up(e, c) {
		this.set_tracking_elmt("none")
		c.removeEventListener("mousemove", (e)=> {this.mouse_track(e,this)})
		c.addEventListener("touchmove", (e)=> {this.mouse_track(e,this)})
	}
	
	set_tracking_elmt(t) {
		this.state.tracking.elmt = t
	}
	
	set_tracking_hpos(x, y) {
		this.state.tracking.currentX = x
	}
	
	get g(){
		return this.state.charge.g
	}
	
	is_tracking() {
		return this.state.tracking.el !== "none"
	}
	
	is_left_arrows(x, y) {
		const marge = 5
		const g = this.state.charge.g
		const w = this.state.charge.width
		const center_arrow = g.x - w/2
		const minX = center_arrow - marge
		const maxX = center_arrow + marge
		const minY = g.y - marge
		const maxY = g.y + marge
		return (x > minX && x < maxX && y > minY && y < maxY)
	}
	
	is_right_arrows(x, y) {
		const marge = 5
		const g = this.state.charge.g
		const w = this.state.charge.width
		const center_arrow = g.x + w/2
		const minX = center_arrow - marge
		const maxX = center_arrow + marge
		const minY = g.y - marge
		const maxY = g.y + marge
		return (x > minX && x < maxX && y > minY && y < maxY)
	}
	
	is_G(x, y) {
		const marge = 5
		const g = this.state.charge.g
		const minX = g.x - marge
		const maxX = g.x + marge
		const minY = g.y - marge
		const maxY = g.y + marge
		return (x > minX && x < maxX && y > minY && y < maxY)
	}
	
	clear_canvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	update_tracking(c) {
		if(c.state.tracking == "none") return
		const tracking = c.state.tracking
		const charge = c.state.charge
		c.clear_canvas()
		switch(tracking.elmt){
			case "LA":
				const right_x = charge.g.x + charge.width / 2
				charge.width = right_x - tracking.currentX
				charge.g.x = tracking.currentX + charge.width / 2
				break
			case "RA":
				const left_x = charge.g.x - charge.width / 2
				charge.width = tracking.currentX - left_x
				charge.g.x = tracking.currentX - charge.width / 2
				break
			case "G":
				charge.g.x = tracking.currentX
				break
			default:
				break
		}
		c.build_charge()
		setTimeout(()=> c.update_tracking(c), 100)
	}
}

const t = new Truck("my_truck")