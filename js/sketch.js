var timeout;
var fr;
var total = 0;
var img;
var container = document.getElementById('container');
var intensity = 5;
var totalImages = 0;
var workers = [];
var resetInterval;

function preload() {
  img = loadImage("assets/hotslow.png");
  addImage();
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  imageMode(CENTER);
  setupWorkers();
  setupSlider();
  resetInterval = setInterval(resetImages, 10000); // Reset every 10 seconds
}

function draw() {
  fr = frameRate();
  if (fr > 0) {
    total += intensity; // Controlled by slider
  }

  for (var i = 0; i < total; i++){
    var sz = random(1, width / 2); 
    image(img, random(0, width), random(0, height), sz, sz);
  }
}

// Setup Web Workers
function setupWorkers() {
  // Clear existing workers
  workers.forEach(worker => worker.terminate());
  workers = [];

  // Create new workers based on intensity
  for (var i = 0; i < intensity; i++){
    var worker = new Worker('js/worker.js');
    worker.addEventListener('message', function(e){
      worker.postMessage(Math.random() * 10000);
    });
    worker.postMessage(1000);
    workers.push(worker);
  }
}

// Slider Control
function setupSlider() {
  var slider = document.getElementById('intensity-slider');
  var valueDisplay = document.getElementById('intensity-value');
  slider.addEventListener('input', function() {
    intensity = parseInt(slider.value);
    valueDisplay.innerText = intensity;
    setupWorkers(); // Update workers when intensity changes
  });
}

// Image Spam Logic
function addImage(){
  var img = document.createElement('img');
  img.src = "assets/hotslow.png?v=" + Math.random();
  if (totalImages < intensity * 10) { // More images with higher intensity
    document.body.appendChild(img);
    totalImages++;
  }
  setTimeout(addImage, 200 / intensity); // Faster with higher intensity
}

// Reset Images
function resetImages() {
  totalImages = 0;
  var images = document.querySelectorAll('body img');
  images.forEach(img => img.remove());
}

// Intense Mode
document.getElementById('intense').addEventListener('click', function(e){
  e.preventDefault();
  container.style.display = 'none';
  clearTimeout(timeout);
  interval = setTimeout(function(){
    container.style.display = 'block';
  }, 3000);
});
