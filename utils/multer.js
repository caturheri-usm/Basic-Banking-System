const { on } = require("events");
const multer = require("multer");
const path = require("path");

const filename = (req, file, cb) => {
  const filename = `${Date.now()}${path.extname(file.originalname)}`;
  cb(null, filename);
};

const generateStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename,
  });
};

module.exports = {
  Image: multer({
    storage: generateStorage("./public/images"),
    fileFilter: (req, file, cb) => {
      const allowExt = ["image/jpg", "image/jpeg", "image/png"];

      if (allowExt.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const err = new Error(
          `Extensi file tidak diizinkan! Gunakan ${allowExt.join(
            ", "
          )} untuk mengupload gambar`
        );
        cb(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),

  Video: multer({
    storage: generateStorage("./public/videos"),
    fileFilter: (req, file, cb) => {
      const allowExt = ["video/mp4", "video/x-msvideo", "video/quicktime"];

      if (allowExt.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const err = new Error(
          `Extensi file tidak diizinkan! Gunakan ${allowExt.join(
            ", "
          )} untuk mengupload video`
        );
        cb(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),

  File: multer({
    storage: generateStorage("./public/docs"),
    fileFilter: (req, file, cb) => {
      const allowExt = ["application/pdf"];

      if (allowExt.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const err = new Error(
          `Extensi file tidak diizinkan! Gunakan ${allowExt.join(
            ", "
          )} untuk mengupload dokumen`
        );
        cb(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    },
  }),
};
