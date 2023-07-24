if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './server.env' })
  }
const AWS  = require('aws-sdk')
require('aws-sdk/lib/maintenance_mode_message').suppress = true,
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    { v4: uuid } = require('uuid');


    const s3 = new AWS.S3({
        accessKeyId: process.env.AmazonS3_Access_Key_ID,
        secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
        region: process.env.AmazonS3_Region,
      })

      module.exports.getVideo = (key) => {
        const params = {
          Bucket: `${process.env.AmazonS3_Bucket_Name}/videos`,
          Key: key,
        }
        return s3.getObject(params).createReadStream()
      };



      
      