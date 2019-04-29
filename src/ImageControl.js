export default class ImageControl {

  static resize(resolve, reject, imageUri, maxWidth, maxHeight, onSuccess, onFailed) {
    var image = new Image();
    image.onload = function() {
      var width = image.width,
          height = image.height;
      if(width > maxWidth) {
        width = maxWidth;
        height = Math.round(height * maxWidth / width);
      }
      if(height > maxHeight) {
        width = Math.round(width * maxHeight / height);
        height = maxHeight;
      }

      var canvas = $("<canvas />")
            .attr("width", width)
            .attr("height", height),
          ctxt = canvas[0].getContext("2d");
      ctxt.clearRect(0, 0, width, height);
      ctxt.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

      var dataURL = canvas.get(0).toDataURL("image/jpeg");
      if(onSuccess) {
        onSuccess(resolve, reject, dataURL, image.width, image.height);
      } else {
        return resolve({
          dataURL: dataURL,
          width: image.width,
          height: image.height
        });
      }
    }

    image.src = imageUri;
  }

  static crop(resolve, reject, imageUri, x, y, w, h, onSuccess, onFailed) {
    var image = new Image();
    image.onload = function() {
      var canvas = $("<canvas />")
            .attr("width", w)
            .attr("height", h),
          ctxt = canvas[0].getContext("2d");
      ctxt.clearRect(0, 0, w, h);
      ctxt.drawImage(image, x, y, w, h, 0, 0, w, h);

      var dataURL = canvas.get(0).toDataURL("image/jpeg");
      if(onSuccess) {
        onSuccess(resolve, reject, dataURL);
      } else {
        return resolve(dataURL);
      }
    }
    image.src = imageUri;
  }

}
