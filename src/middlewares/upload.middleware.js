'use strict';

const multer = require('multer');
const sharp = require('sharp');

const { BadRequestError } = require('../core/error.response');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Not an image! Please upload only images'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

// class UploadMiddleware {}

module.exports = { uploadUserPhoto, resizeUserPhoto };
