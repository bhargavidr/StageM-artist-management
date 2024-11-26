const cloudinary = require('../../config/cloudinary')

const mediaUpload = async (req, res, next) => {
    try {
        
        if (req.files?.media){
            const urls = [];
            const files = req.files.media;

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                folder:`media-${req.user.role}`
                });
                urls.push(result.secure_url); 
            }  
            req.media = urls
            // console.log(req.media, 'urls')
            next()
        } else {
            req.media = []
            next()
        }
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Internal error while uploading", error});
    }
  };

  module.exports = mediaUpload
  