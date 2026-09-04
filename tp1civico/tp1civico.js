let noelleW = [];
let noelleS = [];
let noelleJ = [];
let noelleD = [];

let maus;
let queso;
let fondo;

let deltaruneF = null;

let frameIndice = 0;   
let ultimoTiempo = 0;    
let velocidadAnimacionMs = 150;

// Posición y límites
let posX = 117;
let posY = 610;

let velocidadMovimiento = 2.0; 
let velocidadRapida = 6.0;    
let limiteArriba = 310; 
let limiteDerecha = 326; 
let limiteIzquierda = 122; 
let limiteAbajo = 610;    

// Variables de Maus
let mausX = 800;
let mausY = 356;
let mausVelocidad = 2.5;
let mausVelocidadEscape = 4.0;
let mausDestinoX = 592;

let quesoX = 536;
let quesoY = 334;

let estadoMaus = "ESPERANDO_SALTO";
let tiempoEsperaMaus = 0;
let duracionPausaMs = 2000; 

let estado = "SUBIR"; 

function preload() {
  // Carga con rutas universales
  cargarAnimacion("data/noelleW", 4, noelleW);
  cargarAnimacion("data/noelleS", 4, noelleS);
  cargarAnimacion("data/noelleJ", 12, noelleJ);
  cargarAnimacion("data/noelleD", 4, noelleD);
  
  maus = loadImage("data/maus.png");
  queso = loadImage("data/cheese.png");
  fondo = loadImage("data/noelleroom.png");
  
  // Callback seguro para la fuente: si no existe, no interrumpe la ejecución
  loadFont("data/deltarune.ttf", 
    (font) => { deltaruneF = font; }, 
    (err) => { console.warn("Fuente no encontrada, usando tipo por defecto."); }
  );
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(0);
  
  if (fondo) {
    image(fondo, -12, -12, 820, 620);
  }
  
  controlarMaus();
  controlarEstado();
}

function cargarAnimacion(prefijo, cantidadFrames, arrayDestino) {
  for (let i = 0; i < cantidadFrames; i++) {
    arrayDestino[i] = loadImage(prefijo + i + ".png");
  }
}

function controlarMaus() {
  switch (estadoMaus) {
    case "ESPERANDO_SALTO":
      if (queso) image(queso, quesoX, quesoY, 60, 75);
      if (estado === "SALTO") {
        estadoMaus = "IR_AL_QUESO";
      }
      break;

    case "IR_AL_QUESO":
      if (queso) image(queso, quesoX, quesoY, 60, 75);
      if (mausX > mausDestinoX) {
        mausX -= mausVelocidad;
      } else {
        estadoMaus = "ESPERAR_TIEMPO";
        tiempoEsperaMaus = millis();
      }
      if (maus) image(maus, mausX, mausY, 60, 40);
      break;

    case "ESPERAR_TIEMPO":
      if (queso) image(queso, quesoX, quesoY, 60, 75);
      if (maus) image(maus, mausX, mausY, 60, 40);
      if (millis() - tiempoEsperaMaus > duracionPausaMs) {
        estadoMaus = "ESCAPAR_CON_QUESO";
      }
      break;

    case "ESCAPAR_CON_QUESO":
      mausX += mausVelocidadEscape;
      quesoX = mausX - 15;

      if (mausX <= width) {
        if (queso) image(queso, quesoX, quesoY, 60, 75);
        if (maus) reproducirInvertidoEstatico(maus, mausX, mausY, 60, 40);
      }
      break;
  }
}

function controlarEstado() {
  switch (estado) {
    case "SUBIR":
      if (posY > limiteArriba) {
        posY -= velocidadMovimiento;
        reproducirAnimacion(noelleW, posX, posY, velocidadAnimacionMs);
      } else {
        cambiarEstado("DERECHA"); 
      }
      break;
      
    case "DERECHA":
      if (posX < limiteDerecha) {
        posX += velocidadMovimiento; 
        reproducirAnimacion(noelleD, posX, posY, velocidadAnimacionMs);
      } else {
        cambiarEstado("SALTO");
      }
      break;
      
    case "SALTO":
      reproducirAnimacion(noelleJ, posX, posY, 100); 
      if (esUltimoFrame(noelleJ, frameIndice)) {
        cambiarEstado("IZQUIERDA");
      }
      break;
      
    case "IZQUIERDA":
      if (posX > limiteIzquierda) {
        posX -= velocidadRapida; 
        reproducirAnimacionInvertida(noelleD, posX, posY, 60); 
      } else {
        cambiarEstado("BAJAR"); 
      }
      break;

    case "BAJAR":
      if (posY < limiteAbajo) {
        posY += velocidadRapida; 
        reproducirAnimacion(noelleS, posX, posY, 60); 
      } else {
        cambiarEstado("DETENIDO");
      }
      break;
      
    case "DETENIDO":
      if (noelleS[0]) {
        image(noelleS[0], posX, posY, 80, 100); 
      }
      
      if (mausX > width) {
        mostrarTextoContinuar();
      }
      break;
  }
}

function mostrarTextoContinuar() {
  if (deltaruneF) {
    textFont(deltaruneF);
  }
  textSize(32);
  textAlign(CENTER, CENTER);
  
  let xCentrado = width / 2;
  let yCentrado = height - 60;
  
  fill(0);
  text("Presionar R para reiniciar", xCentrado + 2, yCentrado + 2);
  
  fill(39, 255, 242);
  text("Presionar R para reiniciar", xCentrado, yCentrado);
}

function reproducirAnimacion(animArray, x, y, intervaloMs) {
  if (!animArray || animArray.length === 0) return;
  
  if (millis() - ultimoTiempo > intervaloMs) {
    frameIndice = (frameIndice + 1) % animArray.length;
    ultimoTiempo = millis();
  }
  
  if (animArray[frameIndice]) {
    image(animArray[frameIndice], x, y, 80, 100);
  }
}

function reproducirAnimacionInvertida(animArray, x, y, intervaloMs) {
  if (!animArray || animArray.length === 0) return;

  if (millis() - ultimoTiempo > intervaloMs) {
    frameIndice = (frameIndice + 1) % animArray.length;
    ultimoTiempo = millis();
  }
  
  if (animArray[frameIndice]) {
    push();
    translate(x + 80, y); 
    scale(-1, 1);         
    image(animArray[frameIndice], 0, 0, 80, 100);
    pop();
  }
}

function reproducirInvertidoEstatico(img, x, y, w, h) {
  push();
  translate(x + w, y);
  scale(-1, 1);
  image(img, 0, 0, w, h);
  pop();
}

function cambiarEstado(nuevoEstado) {
  estado = nuevoEstado;
  frameIndice = 0; 
  ultimoTiempo = millis();
}

function esUltimoFrame(animArray, indiceActual) {
  return indiceActual === animArray.length - 1;
}

function keyPressed() {
  if ((key === 'r' || key === 'R') && estado === "DETENIDO" && mausX > width) {
    posX = 117;
    posY = 610;
    
    mausX = 800;
    quesoX = 536;
    quesoY = 334;
    estadoMaus = "ESPERANDO_SALTO";
    
    cambiarEstado("SUBIR");
  }
}
