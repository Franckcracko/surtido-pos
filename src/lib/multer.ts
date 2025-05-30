import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/');
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });
