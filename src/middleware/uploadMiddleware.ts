import multer, { FileFilterCallback } from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// Validar tipo de archivos
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg']

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo PDF, JPG o JPEG'))
    }
}

const upload = multer({
    storage, fileFilter, limits: {
        fileSize: 2 * 1024 * 1024
    }
})

export default upload