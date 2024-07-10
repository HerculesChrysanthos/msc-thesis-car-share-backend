const ImageKit = require('imagekit');
require('dotenv').config();
const axios = require('axios');

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

async function getImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // const contentType = response.headers['content-type'];
    // console.log('Content-Type:', contentType);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function deleteImageByFileId(fileId) {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: 'https://ik.imagekit.io/carsharerentingapp/',
    });

    return new Promise((resolve, reject) => {
      imagekit.deleteFile(fileId, function (error, result) {
        if (error) {
          console.log('Error:', error);
          reject(error);
        } else {
          console.log('Result:', result);
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  uploadImage,
  getImage,
  deleteImageByFileId,
};
