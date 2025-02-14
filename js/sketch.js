var timeout;
var fr;
var total = 0;
var img;
var container = document.getElementById('container');
var intensity = 1; // Default to 1 if no saved value
var totalImages = 0;
var workers = [];
var resetInterval;
var imageElements = []; // Track all created images

function preload() {
  img = loadImage("assets/hotslow.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  imageMode(CENTER);
  loadSavedIntensity();
  setupWorkers();
  setupSlider();
  resetInterval = setInterval(resetImages, 2000 * intensity); // Reset every 10 seconds
}

function draw() {
  fr = frameRate();
  if (fr > 0) {
    total += intensity;
  }

  for (var i = 0; i < total; i++) {
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
  for (var i = 0; i < intensity; i++) {
    var worker = new Worker('js/worker.js');
    worker.addEventListener('message', function(e) {
      worker.postMessage(Math.random() * 10000);
    });
    worker.postMessage(1000);
    workers.push(worker);
  }
}

// Slider Control with Saving to localStorage
function setupSlider() {
  var slider = document.getElementById('intensity-slider');
  var valueDisplay = document.getElementById('intensity-value');

  // Load saved value or set to 1 if none exists
  var savedIntensity = localStorage.getItem('intensity');
  if (savedIntensity) {
    intensity = parseInt(savedIntensity);
    slider.value = intensity;
    valueDisplay.innerText = intensity;
  } else {
    slider.value = 1;
    valueDisplay.innerText = 1;
  }

  slider.addEventListener('input', function() {
    intensity = parseInt(slider.value);
    valueDisplay.innerText = intensity;
    localStorage.setItem('intensity', intensity); // Save to localStorage
    setupWorkers(); // Update workers when intensity changes
  });
}

// Load Saved Intensity
function loadSavedIntensity() {
  var savedIntensity = localStorage.getItem('intensity');
  if (savedIntensity) {
    intensity = parseInt(savedIntensity);
  } else {
    intensity = 1;
  }
}

// Image Spam Logic
function addImage() {
  var img = document.createElement('img');
  img.src = "assets/hotslow.png?v=" + Math.random();
  img.className = "spam-image"; // Class for easy removal
  imageElements.push(img); // Track this image

  // Cap the number of images based on intensity
  var maxImages = intensity * 10; 

  if (totalImages < maxImages) { 
    document.body.appendChild(img);
    totalImages++;
  }
  setTimeout(addImage, 1000 / intensity);
}

addImage(); // Start the image spam

// Reset Images with Page Refresh
function resetImages() {
  totalImages = 0;
  imageElements.forEach(img => {
    img.remove();
  });
  imageElements = []; // Clear the tracked images
  location.reload(); // Forcefully refresh the page
}

// Intense Mode
document.getElementById('intense').addEventListener('click', function(e) {
  e.preventDefault();
  container.style.display = 'none';
  clearTimeout(timeout);
  interval = setTimeout(function() {
    container.style.display = 'block';
  }, 3000);
});
