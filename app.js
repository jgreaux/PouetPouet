class Truck {
	constructor(id) {
		this.canvas = document.getElementById(id)
		this.ctx = this.canvas.getContext("2d")
		this.state = {
			truck:{
				cabin:{
					height:200,
					width: 160
				},
				wheels: {
					d: 40,
					pos_av: 100,
					pos_ar: 400,
					y:250
				},
				bed:{
					length:300,
					start: 190,
					y: 195,
					height: 10
				}
			},
			charge:{
				height: 100,
				width: 300,
				g: {x:340, y: 130}
			},
			tracking: {
				elmt:"none",
				currentX:0
			}
		}
		this.build_truck()
		this.build_charge()
		this.canvas.addEventListener("mousedown", (e)=> {this.handle_click_down(e)})
		this.canvas.addEventListener("mouseup", (e)=> {this.handle_click_up(e)})
		this.canvas.addEventListener("touchstart", (e)=> {this.handle_touch_start(e)})
		this.canvas.addEventListener("touchend", (e)=> {this.handle_touch_end(e)})
	}
	
	build_truck(){
		const ctx = this.ctx
		//wheels
		const wheels = this.state.truck.wheels
		//av
		ctx.beginPath();
		ctx.arc(wheels.pos_av, wheels.y, wheels.d, 0, 2 * Math.PI)
		ctx.fillStyle = "black"
		ctx.fill()
		ctx.beginPath();
		ctx.arc(wheels.pos_av, wheels.y, wheels.d/3, 0, 2 * Math.PI)
		ctx.fillStyle = "white"
		ctx.fill()
		//arc
		ctx.beginPath();
		ctx.arc(wheels.pos_ar, wheels.y, wheels.d, 0, 2 * Math.PI)
		ctx.fillStyle = "black"
		ctx.fill()
		ctx.beginPath();
		ctx.arc(wheels.pos_ar, wheels.y, wheels.d/3, 0, 2 * Math.PI)
		ctx.fillStyle = "white"
		ctx.fill()
		//bed
		const bed = this.state.truck.bed
		ctx.beginPath()
		ctx.rect(bed.start, bed.y, bed.length, bed.height)
		ctx.stroke()
		//cabin
		const cabin = this.state.truck.cabin
		ctx.beginPath()
		//around the wheel
		ctx.arc(wheels.pos_av , wheels.y, wheels.d + 5, Math.PI, 2 * Math.PI)
		//bottom back of the cabin
		ctx.lineTo(wheels.pos_av + cabin.width/2, wheels.y)
		//back of the cabin
		ctx.lineTo(wheels.pos_av + cabin.width/2, wheels.y - cabin.height)
		//roof of the cabin
		ctx.quadraticCurveTo(60, 40, wheels.pos_av - cabin.width/2.5, wheels.y - cabin.height)
		//windshield
		ctx.quadraticCurveTo(70, 40, wheels.pos_av - cabin.width/2, wheels.y - cabin.height/2)
		ctx.quadraticCurveTo(30, 60, wheels.pos_av - cabin.width/2.5, wheels.y - cabin.height)
		//front of the cabin
		ctx.moveTo(wheels.pos_av - cabin.width/2, wheels.y - cabin.height/2)
		ctx.lineTo(wheels.pos_av - cabin.width/2, wheels.y)
		//bottom front of the cabin
		ctx.lineTo(wheels.pos_av - wheels.d - 5, wheels.y)
		//door
		ctx.moveTo(wheels.pos_av - wheels.d - 10, wheels.y - wheels.d - 10)
		ctx.quadraticCurveTo(60, 200, wheels.pos_av + wheels.d + 10, wheels.y - wheels.d - 10)
		ctx.quadraticCurveTo(160, 100,wheels.pos_av + wheels.d + 10, wheels.y - cabin.height * 0.9)
		ctx.quadraticCurveTo(140, 75, wheels.pos_av - wheels.d * 0.7, wheels.y - cabin.height * 0.9)
		ctx.quadraticCurveTo(40, 110, wheels.pos_av - wheels.d - 10, wheels.y - wheels.d - 10)
		//window
		ctx.moveTo(wheels.pos_av - wheels.d * 0.5, wheels.y - cabin.height * 0.85)
		ctx.quadraticCurveTo(70, 100, wheels.pos_av - wheels.d, wheels.y - cabin.height * 0.5)
		ctx.quadraticCurveTo(100, 140,wheels.pos_av + wheels.d + 10, wheels.y - cabin.height * 0.5)
		ctx.quadraticCurveTo(150, 80, wheels.pos_av + wheels.d + 10, wheels.y - cabin.height * 0.85)
		ctx.quadraticCurveTo(100, 90, wheels.pos_av - wheels.d * 0.5, wheels.y - cabin.height * 0.85)
		//end
		ctx.stroke()
		this.build_charge()
		this.build_segments()
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
	
	build_segments() {
		const ctx = this.ctx
		const wheels = this.state.truck.wheels
		const g = this.state.charge.g
		const line_dash = [5, 5]
		//Y
		const dist_Y = 80
		ctx.beginPath()
		ctx.setLineDash(line_dash)
		ctx.moveTo(wheels.pos_ar, wheels.y)
		ctx.lineTo(wheels.pos_ar, wheels.y + dist_Y)
		ctx.moveTo(g.x, g.y)
		ctx.lineTo(g.x, wheels.y + dist_Y)
		ctx.stroke()
		ctx.beginPath()
		ctx.setLineDash([0, 0])
		ctx.moveTo(g.x, wheels.y + dist_Y)
		ctx.lineTo(wheels.pos_ar, wheels.y + dist_Y);
		ctx.stroke()
		ctx.font = "10px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("Y", g.x + (wheels.pos_ar - g.x)/2, wheels.y + dist_Y - 5)
		//Lc
		const dist_lc = 110
		const bed = this.state.truck.bed
		ctx.beginPath()
		ctx.setLineDash(line_dash)
		ctx.moveTo(bed.start, bed.y)
		ctx.lineTo(bed.start, wheels.y + dist_lc)
		ctx.moveTo(bed.start + bed.length, bed.y)
		ctx.lineTo(bed.start + bed.length, wheels.y + dist_lc)
		ctx.stroke()
		ctx.beginPath()
		ctx.setLineDash([0, 0])
		ctx.moveTo(bed.start, wheels.y + dist_lc)
		ctx.lineTo(bed.start + bed.length, wheels.y + dist_lc);
		ctx.stroke()
		ctx.font = "10px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("Lc", bed.start + bed.length/2, wheels.y + dist_lc - 5)
		//F'
		const dist_f = 130
		ctx.beginPath()
		ctx.setLineDash(line_dash)
		ctx.moveTo(wheels.pos_av, wheels.y)
		ctx.lineTo(wheels.pos_av, wheels.y + dist_f)
		ctx.moveTo(wheels.pos_ar, wheels.y)
		ctx.lineTo(wheels.pos_ar, wheels.y + dist_f)
		ctx.stroke()
		ctx.beginPath()
		ctx.setLineDash([0, 0])
		ctx.moveTo(wheels.pos_av, wheels.y + dist_f)
		ctx.lineTo(wheels.pos_ar, wheels.y + dist_f);
		ctx.stroke()
		ctx.font = "10px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("F'", wheels.pos_av + (wheels.pos_ar - wheels.pos_av)/2, wheels.y + dist_f - 5)
		//L
		const dist_l = 160
		const cabin = this.state.truck.cabin
		ctx.beginPath()
		ctx.setLineDash(line_dash)
		ctx.moveTo(wheels.pos_av - cabin.width/2, wheels.y)
		ctx.lineTo(wheels.pos_av - cabin.width/2, wheels.y + dist_l)
		ctx.moveTo(bed.start + bed.length, bed.y)
		ctx.lineTo(bed.start + bed.length, wheels.y + dist_l)
		ctx.stroke()
		ctx.beginPath()
		ctx.setLineDash([0, 0])
		ctx.moveTo(wheels.pos_av - cabin.width/2, wheels.y + dist_l)
		ctx.lineTo(bed.start + bed.length, wheels.y + dist_l);
		ctx.stroke()
		ctx.font = "10px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("L", wheels.pos_av + (wheels.pos_ar - wheels.pos_av)/2, wheels.y + dist_l - 5)
	}
	
	mouse_track(e, c){
		const x = e.offsetX
		const y = e.offsetY
		if(!c.is_tracking()) return
		c.set_tracking_hpos(x,y)
		
	}
	
	touch_track(e, c){
		const rec = e.target.getBoundingClientRect()
		const touch = e.touches[0]
		const x = touch.pageX - rec.left
		const y = touch.pageY - rec.top
		if(!c.is_tracking()) return
		c.set_tracking_hpos(x,y)
		
	}
	
	handle_click_down(e) {
		const c = e.target
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
	}
	
	handle_touch_start(e) {
		const c = e.target
		const rec = c.getBoundingClientRect()
		const touch = e.touches[0]
		const x = touch.pageX - rec.left
		const y = touch.pageY - rec.top
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
		c.addEventListener("touchmove", (e)=> {this.touch_track(e,this)})
		
	}
	
	handle_click_up(e) {
		const c = e.target
		this.set_tracking_elmt("none")
		c.removeEventListener("mousemove", (e)=> {this.mouse_track(e,this)})
	}
	
	handle_touch_end(e) {
		const c = e.target
		c.addEventListener("touchmove", (e)=> {this.touch_track(e,this)})
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
		const marge = 10
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
		const marge = 10
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
		const marge = 10
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
		c.build_truck()
		setTimeout(()=> c.update_tracking(c), 100)
	}
}

const t = new Truck("my_truck")