const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const qr = require("node-qr-image");
const imagekit = require("../../../../utils/imagekit");

module.exports = {
  // uploadImage: async (req, res) => {
  //   const imageURL = `${req.protocol}://${req.get("host")}/images/${
  //     req.file.filename
  //   }`;

  //   return res.status(200).json({
  //     status: "success",
  //     message: "Image uploaded successfully",
  //     data: {
  //       image_url: imageURL,
  //     },
  //   });
  // },

  // uploadVideo: async (req, res) => {
  //   const videoURL = `${req.protocol}://${req.get("host")}/videos/${
  //     req.file.filename
  //   }`;
  //   return res.status(200).json({
  //     status: "success",
  //     message: "Video uploaded successfully",
  //     data: {
  //       video_url: videoURL,
  //     },
  //   });
  // },

  // uploadFile: async (req, res) => {
  //   const fileURL = `${req.protocol}://${req.get("host")}/docs/${
  //     req.file.filename
  //   }`;

  //   return res.status(200).json({
  //     status: "success",
  //     message: "Document uploaded successfully",
  //     data: {
  //       docs_url: fileURL,
  //     },
  //   });
  // },

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

      const text = await prisma.image.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          url: uploadFile.url,
          type: uploadFile.fileType,
          size: uploadFile.size,
          createdAt: new Date(),
        },
      });
      return res.status(200).json({
        status: "success",
        message: "Image uploaded to ImageKit successfully",
        data: { text },
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },

  getImages: async (req, res) => {
    try {
      const images = await prisma.image.findMany({
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
        },
      });
      return res.status(200).json({
        status: "success",
        message: "ImageKit files retrieved successfully",
        data: images,
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },

  getImageById: async (req, res) => {
    try {
      const image = await prisma.image.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (!image) {
        return res.status(404).json({
          status: "ERROR",
          message: "Image not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Image retrieved from ImageKit successfully",
        data: { image },
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },

  updateImage: async (req, res) => {
    try {
      const image = await prisma.image.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!image) {
        return res.status(404).json({
          status: "ERROR",
          message: "Image not found",
        });
      }

      const updatedImage = await prisma.image.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          description: req.body.description,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({
        status: "success",
        message: "ImageKit file updated successfully",
        data: updatedImage,
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const image = await prisma.image.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!image) {
        return res.status(404).json({
          status: "ERROR",
          message: "Image not found",
        });
      }

      await prisma.image.delete({
        where: { id: Number(req.params.id) },
      });

      return res.status(200).json({
        status: "success",
        message: "Image deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  },
};
