const sharp = require('sharp');

async function resizeImage(imageBuffer, dimensions) {
  try {
    const resizedBuffer = await sharp(imageBuffer)
      .resize(dimensions.width, dimensions.height)
      .toBuffer();

    console.log('IMAGE_RESIZED_SUCCESSFULLY');
    return resizedBuffer;
  } catch (error) {
    console.error('IMAGE_RESIZED_ERROR ', error);
    throw error;
  }
}

module.exports = {
  resizeImage,
};
