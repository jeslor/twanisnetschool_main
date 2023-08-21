if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '/server.env' })
  }

  const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3"),
  AWS  = require('aws-sdk');
     
    const S3 = new S3Client({
        credentials:{
          accessKeyId: process.env.AmazonS3_Access_Key_ID,
          secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
        },
        region: process.env.AmazonS3_Bucket_Region,
  })


  const s3 = new AWS.S3({
    accessKeyId: process.env.AmazonS3_Access_Key_ID,
    secretAccessKey: process.env.AmazonS3_Secret_Access_Key,
    region: process.env.AmazonS3_Region,
  })

    module.exports.S3 = S3;
    module.exports.s3 = s3;
    module.exports.GetObjectCommand = GetObjectCommand;



