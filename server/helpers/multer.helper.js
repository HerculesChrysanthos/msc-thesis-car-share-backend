const multer = require('multer');

// Define the storage
const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: 'uploads/', // Specify the directory where files will be saved
//   filename: (req, file, callback) => {
//     callback(null, file.originalname); // Use the original filename for the saved file
//   },
// });

function fileFilter(req, file, callback) {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = new Error(
      'Invalid file type. Only JPEG and PNG images are allowed.'
    );
    error.status = 415;
    return callback(error);
  }
}

function prepareImages(maxImages) {
  const maxFileSize = 2 * 1024 * 1024; // 2 MB

  return (req, res, next) => {
    multer({
      limits: {
        fileSize: maxFileSize,
      },
      storage,
      fileFilter,
    }).array('image', maxImages)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          err.message = 'File limit of 1 image has exceeded.';
          err.status = 400;
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
          err.message = 'File size exceeds the limit of 2 MB.';
          err.status = 400;
        }
        return next(err);
      }

      next();
    });
  };
}

module.exports = {
  prepareImages,
};
