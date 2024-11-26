const multer = require('multer')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|CR2|gif|mp4|mov|avi/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(file.originalname.split('.').pop());
  
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  };
 
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 30 * 1024 * 1024 // 30 MB file size limit
    }
  });


const uploadFields = [
    { name: 'pfp', maxCount: 1 },
    { name: 'media', maxCount: 10 }
];

module.exports = {upload, uploadFields}