import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cloudinaryStoragePkg = require('multer-storage-cloudinary');

const CloudinaryStorage = (typeof cloudinaryStoragePkg === 'function') 
    ? cloudinaryStoragePkg 
    : (cloudinaryStoragePkg.CloudinaryStorage || cloudinaryStoragePkg.default?.CloudinaryStorage);

import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  
  params: {
    folder: 'contacts',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export const upload = multer({ storage });