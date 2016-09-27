// based on https://codepen.io/Blummed/pen/lCjiu

function createSplash() {
  var canvas = document.getElementById('splashCanvas');
  var ctx = canvas.getContext('2d');
  var imgXCoord = 0;
  var img = new Image();
  img.src= '/assets/404-logo.png';
  img.onload = function() {
    onResize();
    canvas.height = img.height;
    startGlitch();
  };

  window.addEventListener('resize', onResize);

  function onResize() {
    var width = window.innerWidth;
    canvas.width = Math.max(Math.min(width, 600), img.width);
    imgXCoord = (canvas.width/2) - (img.width/2);
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function startGlitch() {
    window.setInterval(function() {
      // Don't always clear the canvas to give a smear/ghost affect
      if (random(0, 1) > 0.1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      glitchImage(1);

      setTimeout(function() {
        var magnitude = random(0, 1) > 0.1 ? 0 : 1;
        glitchImage(magnitude);
      }, random(0, 200));
    }, 500);
  }

  function glitchImage(magnitude) {
    if (magnitude == null) {
      magnitude = 1;
    }
    var amount = random(0, 10);
    var imgWidth = img.width;
    var imgHeight = img.height;

    // Move segments around
    for (var i = 0; i < amount; i++) {
      var shiftX = random(-50 * magnitude, 50 * magnitude);
      var shiftY = random(-10 * magnitude, 10 * magnitude);
      var shiftStartY = random(0, imgHeight);
      var spliceWidth = imgWidth - shiftX;
      var spliceHeight = (imgHeight/3) + random(-imgHeight/3, imgHeight/3) * magnitude;

      if (random(0, 1) > 0.3) {
        // remove the segment being shifted
        ctx.clearRect(0, shiftStartY, canvas.width, spliceHeight);
      }

      //  redraw the segment, shifted
      ctx.drawImage(img,
        0, shiftStartY, spliceWidth, spliceHeight,
        imgXCoord + shiftX, shiftStartY + shiftY, spliceWidth * random(0.9, 1.1), spliceHeight);
    }

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var length = imageData.data.length;
    var rFactor, gFactor, bFactor, aFactor;
    var lastColorSwitch = 0;
    var colorSwitchSize = random(length/10, length);

    // Colour-shift the image
    var j = 0;
    while (j < length) {
      // switch to a different colour every so often
      if (lastColorSwitch == 0 || (j - lastColorSwitch > colorSwitchSize && Math.random() > 0.5)) {
        rFactor = random(0, 1);
        gFactor = random(0, 1);
        bFactor = random(0.5, 1.2);
        aFactor = random(0.2, 0.5);

        if (random(0, 1) > 0.1) {
          aFactor = random(0.8, 1);
        }

        lastColorSwitch = j + 1;
      }

      imageData.data[j++] *= rFactor;
      imageData.data[j++] *= gFactor;
      imageData.data[j++] *= bFactor;
      imageData.data[j++] *= aFactor;
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

document.addEventListener('DOMContentLoaded', createSplash);
