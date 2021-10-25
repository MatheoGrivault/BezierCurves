let points = [];
let initTime;
let draggedPoint = -1;

let pointRadius = 10;
let fSlider;
let ilCheck;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i<random(2,4); i++){
    points.push(createVector(random(0, width), random(0, height)));
  }
  
  initTime = millis();
  fSlider = createSlider(1, 30, 3);
  fSlider.position(65, height-25);
  ilCheck = createCheckbox("", true);
  ilCheck.position(380, height-24);
}


function draw() {
  background(0);

  let t = (sin(2*PI*fSlider.value()/10*(millis()-initTime)/1000)+1)/2;
  
  beginShape();
  for(let i = 0; i<t; i+=0.01){
    let p = calculatePointAtT(i);
    vertex(p.x, p.y);
  }
  let p = calculatePointAtT(t, ilCheck.checked());
  vertex(p.x, p.y);
  stroke(255);
  strokeWeight(5);
  noFill();
  endShape();
  
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  text("Frequency", 5, height-20);
  text(fSlider.value()/10, 200, height-20);
  text("Show intermediate lines", 250, height-20);
}

function calculatePointAtT(t, draw=false){
  let tempPoints = [];
  arrayCopy(points, tempPoints);
  while(tempPoints.length > 1){
    let nPoints = tempPoints.length;
    for(let i = 0; i<nPoints-1; i++){
      let p = tempPoints[i];
      let p2 = tempPoints[i+1];
      
      if(draw){
        stroke(128);
        strokeWeight(3);
        line(p.x, p.y, p2.x, p2.y);
        
        stroke(255);
        strokeWeight(pointRadius);
        point(p.x, p.y); 
        point(p2.x, p2.y);
      }

      tempPoints.push(p5.Vector.lerp(p, p2, t));
    }
    tempPoints.splice(0, nPoints);
  }
  
  if(draw){
    point(tempPoints[0].x, tempPoints[0].y); 
  }
  return tempPoints[0];
}

function mousePressed(){
 for(let i = 0; i<points.length; i++){
   if(p5.Vector.sub(points[i], createVector(mouseX, mouseY)).mag() < pointRadius){
     draggedPoint = i;
   }
 }
}

function mouseReleased(){
 draggedPoint = -1; 
}

function mouseDragged(){
  if(draggedPoint > -1){
    points[draggedPoint] = createVector(mouseX, mouseY);
  }
}

function doubleClicked(){
 for(let i = 0; i<points.length; i++){
   if(p5.Vector.sub(points[i], createVector(mouseX, mouseY)).mag() < pointRadius){
     points.splice(i, 1);
     return;
   }
 }
 
 points.push(createVector(mouseX, mouseY));
}
