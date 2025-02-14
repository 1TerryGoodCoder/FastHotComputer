var timeout;
var fr;
var total = 0;
var img;
var container = document.getElementById('container');

function preload() {
  img = loadImage("assets/hotslow.png");
  addImage();
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  imageMode(CENTER);
}

function draw() {
  fr = frameRate();

  if (fr > 0) {
    total += 5; // Half the rate of image growth
  }

  for (var i = 0; i < total; i++){
    var sz = random(1, width / 2); // Smaller images
    image(img, random(0, width), random(0, height), sz, sz);
  }
}

// Half the workers for less CPU usage
var totalWorkers = 7;
var workers = [];

for (var i = 0; i < totalWorkers; i++){
  var worker = new Worker('js/worker.js');
  worker.addEventListener('message', function(e){
    worker.postMessage(Math.random() * 10000);
  });
  worker.postMessage(1000);
  workers.push(worker);
}

var totalImages = 0;

function addImage(){
  var img = document.createElement('img');
  img.src = "assets/hotslow.png?v=" + Math.random();
  if (totalImages < 50) { // Half the total images
    document.body.appendChild(img);
    totalImages++;
  }
  setTimeout(addImage, 200); // Slower image addition rate
}

document.getElementById('intense').addEventListener('click', function(e){
  e.preventDefault();
  container.style.display = 'none';
  clearTimeout(timeout);
  interval = setTimeout(function(){
    container.style.display = 'block';
  }, 3000);
});
