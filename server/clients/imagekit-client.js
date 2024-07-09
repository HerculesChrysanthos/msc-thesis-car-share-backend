const ImageKit = require('imagekit');
require('dotenv').config();

async function uploadImage(buffer, name) {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: 'https://ik.imagekit.io/carsharerentingapp/',
    });

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: name,
          useUniqueFileName: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  uploadImage,
};
