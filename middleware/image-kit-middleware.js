const ImageKit = require("imagekit");
const AppError = require("../utils/app-error");
const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

const uploadImageKit = (isMultipleFiles, folderName) => {
  return async (req, res, next) => {
    console.log(req.files);
    console.log(req.file);

    if (
      (isMultipleFiles && (!req.files || req.files.length === 0)) ||
      (!isMultipleFiles && !req.file)
    )
      return next();

    const files = isMultipleFiles ? req.files : [req.file];
    console.log(files);
    try {
      const imageKitPromieses = files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.fieldname}`,
          folder: folderName,
        }),
      );
      const results = await Promise.all(imageKitPromieses);
      const imagesUrl = results.map((item) => item.url);
      req.imagesUrl = imagesUrl;
      next();
    } catch (error) {
      throw new AppError(400, `Failed to upload image: ${error.message}`);
    }
  };
};

module.exports = uploadImageKit;
