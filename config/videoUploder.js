if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './server.env' })
  }
const  AWS  = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    { v4: uuid } = require('uuid');

    

    // const S3 = new S3Client({
    //   credentials:{
    //     accessKeyId: process.env.AmazonS3_Access_Key_ID,
    //     secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
    //   },
    //   region: process.env.AmazonS3_Region,
    // })

    const s3 = new AWS.S3({
        accessKeyId: process.env.AmazonS3_Access_Key_ID,
        secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
        region: process.env.AmazonS3_Region,
      })
      module.exports.s3 = s3;

      // module.exports.S3 = S3;

   
      
      module.exports.uploadVideo = multer({
        limits: { fileSize: 1000000 * 3000 },
        storage: multerS3({
          s3: s3,
          bucket: `${process.env.AmazonS3_Bucket_Name}/videos`,
          multipart: true,
          // acl: 'public-read',
          metadata: function (req, file, cb) {
            const filePath = `${uuid()}-${file.originalname}`
            cb(null, { fieldName: filePath })
          },
          key: function (req, file, cb) {
            const filePath = `${uuid()}-${file.originalname}`
            cb(null, filePath)
          },
        }),
      })