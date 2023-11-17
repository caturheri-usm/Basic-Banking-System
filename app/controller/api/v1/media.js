const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const qr = require("node-qr-image");
const imagekit = require("../../../../utils/imagekit");

module.exports = {
  uploadImage: async (req, res) => {
    const imageURL = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: "true",
      message: "success",
      data: {
        image_url: imageURL,
      },
    });
  },

  uploadVideo: async (req, res) => {
    const videoURL = `${req.protocol}://${req.get("host")}/videos/${
      req.file.filename
    }`;
    return res.status(200).json({
      status: "true",
      message: "success",
      data: {
        video_url: videoURL,
      },
    });
  },

  uploadFile: async (req, res) => {
    const fileURL = `${req.protocol}://${req.get("host")}/files/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: "true",
      message: "success",
      data: {
        file_url: fileURL,
      },
    });
  },

  generateQRCode: async (req, res) => {
    const { text } = req.body;
    const qrCode = qr.image(text, { type: "png" });
    res.setHeader("Content-type", "image/png");
    qrCode.pipe(res);
  },

  uploadImageKit: async (req, res) => {
    try {
      const stringFile = req.file.buffer.toString("base64");
      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });
      return res.status(200).json({
        status: "OK",
        message: "success",
        data: {
          name: uploadFile.name,
          url: uploadFile.url,
          type: uploadFile.fileType,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },
};
