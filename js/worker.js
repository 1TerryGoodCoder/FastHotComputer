// Worker performs lightweight calculations
onmessage = function(e) {
  let sum = 0;
  for (let i = 0; i < e.data; i++) {
    sum += Math.sqrt(i);
  }
  postMessage(sum);
};
