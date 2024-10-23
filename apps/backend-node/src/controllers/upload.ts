import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import { Request } from 'express';

dotenv.config();

if(!process.env.AWS_REGION){
    throw Error("aws credentials not init")
}
if(!process.env.AWS_ACCESS_KEY_ID){
    throw Error("aws credentials not init")
}
if(!process.env.AWS_SECRET_ACCESS_KEY){
    throw Error("aws credentials not init")
}

const s3ClientInfo = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  

const bucketName = process.env.AWS_BUCKET_NAME || 'user-storage-bucket';

const storage = multerS3({
    s3: s3ClientInfo,
    bucket: bucketName,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB file size limit
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/webm'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPEG, MP4, and WebM are allowed.'));
        }
    }
});