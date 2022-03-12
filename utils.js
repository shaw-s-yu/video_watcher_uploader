export const getFileExtensionFromFileName = (name) =>
  /(?:\.([^.]+))?$/.exec(name)[1];

export function isFileImage(filename) {
  var ext = getFileExtensionFromFileName(filename);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "gif":
    case "bmp":
    case "png":
      //etc
      return true;
  }
  return false;
}

export function isFileVideo(filename) {
  var ext = getFileExtensionFromFileName(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
      // etc
      return true;
  }
  return false;
}
