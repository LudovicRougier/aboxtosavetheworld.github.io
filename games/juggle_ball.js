
//!!GENERAL GAME PROPRERTY
const game = {
	//GENERAL PROPRETY OF A GAME
	size: {
		width: 600,
		height: 600,
	},
	dev_fps: {
		refreshRate: 100,
		lastShow: null,
		FpsLastLoop: null,
	},
	state: {
		idRunning: true,
	},
	//FUNCTION INITIALISATION OF A GAME
	init: () => {
		//DOM Target for the game
		let gameDOMContainer = document.querySelector('.game__container');
		//Type of container (Canvas or DOM) --> Here Canvas
		let canvasElt = document.createElement("canvas");
		canvasElt.id = "canvas";
		canvasElt.width = game.size.width;
		canvasElt.height = game.size.height;
		canvasElt.classList.add("game");
		//For fullscreen
		// canvasElt.height = window.innerHeight;
		// canvasElt.width = window.innerWidth;
		gameDOMContainer.appendChild(canvasElt);

		//? ***DEV*** Initialisation Variables pour calcul FPS
		// Ajout div pour affichage FPS
		/* let devContainerElt = document.createElement("div");
		devContainerElt.id = "dev-fps__container";
		let devFPSElt = document.createElement("div");
		devFPSElt.id = "dev-fps";
		devContainerElt.appendChild(devFPSElt);
 */
		//? ***DEV*** Fenetre console
		/* let devConsoleELt = document.createElement('p');
		devConsoleELt.id = 'dev-console';
		devContainerElt.appendChild(devConsoleELt);
		document.querySelector('.game__container').appendChild(devContainerElt);
 */
		//Initialisation de la première frame
		/* var dev_fps = game.dev_fps;
		dev_fps.FpsLastLoop = new Date;
		dev_fps.lastShow = new Date; */

		//Initialisation de juggleBall
		juggleBall.init();

	}
}

//!!MATTER INITIALISATION
const matter = {
	get: () => {
		let Engine = Matter.Engine;
		let Render = Matter.Render;
		let World = Matter.World;
		let Bodies = Matter.Bodies;
		let Composites = Matter.Composites;
		let Composite = Matter.Composite;
		let Mouse = Matter.Mouse;
		let MouseConstraint = Matter.MouseConstraint;
		let Collision = Matter.Collision;
		let Body = Matter.Body;
		let Events = Matter.Events;
		let Constraint = Matter.Constraint;
		return { Engine, Render, World, Bodies, Composites, Composite, Mouse, MouseConstraint, Collision, Body, Events, Constraint }
	},
}

//!!CANVAS ANIMATION
const render = () => {
	//? MATTER Update
	const settings = juggleBall.settings;
	const { Engine, Render, World, Bodies, Composites, Composite, Mouse, Events, Collision } = matter.get();
	Engine.update(juggleBall.engine, settings.refreshRate);


	//COLLISIONS 
	let bodies = juggleBall.engine.world.bodies;
	let scoreBall = bodies.find(thisBody => thisBody.label === 'scoreBall');
	let finishLine = bodies.find(thisBody => thisBody.label === 'finishLine');
	Events.on(juggleBall.engine, 'collisionStart', function (event) {
		if (Collision.collides(scoreBall, finishLine)) {
			let cube = document.querySelector('.cube');
			cube.classList.add( 'show-left' );
      cube.classList.remove('show-bottom');
		}
	});
	Matter.Body.setAngularVelocity(juggleBall.engine.world.bodies[1],0);
	Matter.Body.setAngularVelocity(juggleBall.engine.world.bodies[0],0);

	//? ***DEV***FPS Counter
	/* const dev_fps = game.dev_fps
	let thisFrameDate = new Date;
	//Difference entre les deux frame
	let fps = Math.round(1000 / (thisFrameDate - dev_fps.FpsLastLoop));
	dev_fps.FpsLastLoop = thisFrameDate;
	if (dev_fps.FpsLastLoop - dev_fps.lastShow > dev_fps.refreshRate) {
		document.getElementById('dev-fps').innerHTML = fps;
		dev_fps.lastShow = thisFrameDate;
	} */

	//? ***DEV**Console Object READER
	/* let readElt = '';
	const objectArr = Object.entries(Composite.allBodies(juggleBall.engine.world));
	for (let thisRow of objectArr) {
		readElt += `<p>${thisRow}<p>`;
	}
	document.getElementById('dev-console').innerHTML = readElt; */

	//!! CANVAS UPDATE
	//CAN WE DELETE THE DOM CALL AT EACH FRAME?
	const ctx = juggleBall.canvas.getContext('2d');
	//RESET CANVAS
	ctx.clearRect(0, 0, game.size.width, game.size.height);
	ctx.fillStyle = '#25292E';
	ctx.rect(0, 0, game.size.width, game.size.height);
	ctx.fill();

	//CONFIGURE DRAWING

	//START DRAWING
	//MATTER BODIES
	for (let thisBody of juggleBall.engine.world.bodies) {

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = thisBody.render.strokeStyle;
		ctx.fillStyle = thisBody.render.fillStyle;
		ctx.lineWidth = thisBody.render.lineWidth;
		let vertices = thisBody.vertices
		ctx.moveTo(vertices[0].x, vertices[0].y);
		for (let thisVertice of vertices) {
			ctx.lineTo(thisVertice.x, thisVertice.y);
		}
		ctx.lineTo(vertices[0].x, vertices[0].y);
		if (thisBody.render.visible === true) {
			ctx.fill();
			ctx.stroke();
		}
	}
	//MOUSE
	mousePos = juggleBall.mouse.absolute;
	ctx.beginPath();
	ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
	ctx.fillStyle = "#FFF"
	ctx.fill();

	//ASK TO RENDER THE NEXT FRAME
	requestAnimationFrame(render);
}

//!!JUGGLE BALL GAME 
const juggleBall = {
	engine: null,
	canvas: null,
	mouse: null,
	category: { default: 1, undraggable: 2 },
	settings: {
		matterRefreshRate: 15
	},
	init: () => {
		juggleBall.canvas = document.getElementById('canvas');
		const { Engine, Render, World, Bodies, Composites, Composite, Mouse, MouseConstraint } = matter.get();
		juggleBall.engine = Engine.create();

		//MOUSE CONTROLLER
		juggleBall.mouse = Mouse.create(juggleBall.canvas);
		mouseConstraint = MouseConstraint.create(juggleBall.engine, {
			mouse: juggleBall.mouse,
			constraint: {
				stiffness: 1,
				length: 0,
				angularStiffness: 1,
				render: {
					visible: false
				},
			}
		});
		mouseConstraint.collisionFilter.mask = juggleBall.category.default;
		Composite.add(juggleBall.engine.world, mouseConstraint);

		new Walls();
		new level1();
		//new coffre();


		//WALL

		juggleBall.update();
	},
	update: () => {
		render();
	}
}

class Ball {
	constructor(x, y, radius, option, stroke, fill,lineWidth ) {
		const { Render, World, Bodies, Composites, engine, Engine, Composite } = matter.get();
		const thisCircle = Bodies.circle(x, y, radius, { friction: 0.1 });
		thisCircle.render.fillStyle = fill ? fill : '#F0F';
		thisCircle.render.strokeStyle = stroke ? stroke : '000';
		thisCircle.render.lineWidth = lineWidth  ? lineWidth  : 1;
		if (option) {
			if (option.category === juggleBall.category.undraggable) {
				thisCircle.collisionFilter.category = juggleBall.category.undraggable;
			}
			if (typeof option.label !== 'undefined') {
				thisCircle.label = option.label;
			}
		}
		Composite.add(juggleBall.engine.world, thisCircle);
	}
};

class Walls {
	constructor() {
		const { Render, World, Bodies, Composites, engine, Engine, Composite } = matter.get();
		let maxX = game.size.width * 2;
		let maxY = game.size.height * 2;
		const leftWall = Bodies.rectangle(-50, 0, 100, maxY, { isStatic: true });
		const rightWall = Bodies.rectangle((maxX / 2) + 49, 0, 100, maxY, { isStatic: true });
		const topWall = Bodies.rectangle(0, -50, maxX, 100, { isStatic: true });
		const bottomWall = Bodies.rectangle(0, (maxY / 2) + 49, maxX, 100, { isStatic: true });
		let Walls = [leftWall, rightWall, topWall, bottomWall]
		Walls.forEach(wall => {
			wall.render.strokeStyle = 'rgba(0, 0, 0,0.2)';
			wall.render.fillStyle = 'rgba(0, 0, 0,1)';
		});
		Composite.add(juggleBall.engine.world, Walls);

	}
};

class level1 {
	constructor() {
		const { Render, World, Bodies, Composites, engine, Engine, Composite, Body, Events, Constraint } = matter.get();

		const leftStarter = Bodies.circle(45, 525, 5, { isStatic: true });
		const rightStarter = Bodies.circle(85, 525, 5, { isStatic: true });

		Composite.add(juggleBall.engine.world, [leftStarter, rightStarter]);
		//Bowl
		const leftWall = Bodies.rectangle(400, 130, 5, 30, { isStatic: true , render: {fillStyle : '#FFF'}, angle: 15 });
		const leftWall2 = Bodies.rectangle(400, 105, 5, 30, { isStatic: true , render: {fillStyle : '#FFF'}, angle: 4 });
		const rightWall = Bodies.rectangle(495, 100, 5, 90, { isStatic: true ,render: {fillStyle : '#FFF'},angle:0 });
		const bottomWall = Bodies.rectangle(450, 150, 90, 15, { isStatic: true,render: {fillStyle : '#FFF'}  });
		const finishLine = Bodies.rectangle(450, 143, 30, 2, { isStatic: true, label: 'finishLine' });
		finishLine.render.visible = false;
		Composite.add(juggleBall.engine.world, [leftWall, rightWall, bottomWall, finishLine,leftWall2]);

		new Ball(65, 480, 30, { category: juggleBall.category.undraggable, label: "scoreBall" }, "#FFF", "rgba(0,0,0,0)",3);
		new Ball(300, 400, 30, { label: "playerBall" },"rgba(0,0,0,0)", "#FFF",3);
		console.log(juggleBall.engine.world.bodies);
	}
};

class coffre {
	constructor() {
		let centerX = game.size.width / 2;
		let centerY = game.size.height / 2;
		let offsetHoraire = 175;
		let barre = 600;
		const { Render, World, Bodies, Composites, engine, Engine, Composite, Body, Events, Constraint } = matter.get();

		// var car = Composite.create({ label: 'Car' }),
		// body = Bodies.rectangle(xx, yy, width, height, { 
		// 		collisionFilter: {
		// 				group: group
		// 		},
		// 		chamfer: {
		// 				radius: height * 0.5
		// 		},
		// 		density: 0.0002
		// });
		let group = Body.nextGroup(true);
		let porte = Composite.create({ label: 'porte' });
		let cercleHoraire = Bodies.circle(centerX, centerY, 250, { isStatic: true ,collisionFilter: { group: group } });
		cercleHoraire.render.fillStyle = 'rgba(100,100,100,0.8)';
		let barre1Horaire = Bodies.rectangle((centerX - offsetHoraire), (centerY + offsetHoraire) - (barre / 2), 15, barre, { collisionFilter: { group: group } });
		
		let axe1 = Constraint.create({
			bodyB: cercleHoraire,
			bodyA: barre1Horaire,
			pointA: {x:0,y:300}
		});
		Composite.addBody(porte, cercleHoraire);
		Composite.addBody(porte, barre1Horaire);
		Composite.addConstraint(porte, axe1);
		// let central = Constraint.create({
		// 	bodyB : cercleHoraire,
		// 	pointB:{x:10,y:10},
		// 	bodyA : juggleBall.engine.world,
		// 	pointA:{x:10,y:10},
		// });
		// Composite.addBody(juggleBall.engine.world,cercleHoraire);
		// Composite.addConstraint(juggleBall.engine.world,central);
		Composite.add(juggleBall.engine.world, [porte,cercleHoraire,barre1Horaire]);
		console.log(juggleBall.engine.world, porte);
		// const cercleAntiHoraire = Bodies.circle(game.size.width/2, game.size.height/2, 275, { isStatic : true});
		// cercleAntiHoraire.render.fillStyle = 'rgba(100,100,100,0.8)';

		// Composite.add(juggleBall.engine.world, [cercleHoraire,cercleAntiHoraire,barre1Horaire]);
	}



}










//! BOUCLE PRINCIPALE
game.init();
