import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the resource type and format based on the file
    let format = file.mimetype.split('/')[1];
    let resource_type = 'auto'; // Automatically determine if image, raw, etc.

    // For raw files like pdf and docx, Cloudinary works better if you don't force an image format
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
       format = undefined; // allow cloudinary to keep the original extension
       resource_type = 'raw';
    }

    return {
      folder: 'hr_portal_tasks',
      resource_type: resource_type,
      format: format,
    };
  },
});

export const upload = multer({ storage: storage });
