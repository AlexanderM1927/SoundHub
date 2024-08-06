import multer from 'multer'
import path from 'path'

const whitelistAudio = [
    'audio/mp3',
    'audio/mpeg',
    'audio/m4a'
]

const whitelistImage = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

const storage = multer.diskStorage({
    destination: function (_req: any, _file: any, callback: any) {
        // try this route into the server saving files
        callback(null, './public/sounds/');
    },
    filename: function (_req: any, file: any, callback: any) {
       callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage : storage, fileFilter: (_req: any, file: any, cb: any) => {
    if (file.fieldname === 'sound_thumbnail_url' && !whitelistImage.includes(file.mimetype)) {
        return cb(new Error('sound_thumbnail_url debe ser una imagen de tipo ' + whitelistImage.toString()))
    }
    if (file.fieldname === 'sound_file_url' && !whitelistAudio.includes(file.mimetype)) {
        return cb(new Error('sound_file_url debe ser un archivo ' + whitelistAudio.toString()))
    }

    cb(null, true)
} }).fields([
    {
        name: 'sound_file_url',
        maxCount: 1 
    },
    {
        name: 'sound_thumbnail_url',
        maxCount: 1 
    }
])

export class UploadService {
    soundRepository: any

    constructor (soundRepository: any) {
        this.soundRepository = soundRepository
    }

    init (req: any, res: any) {
        upload(req, res, async (error: any) => {
            if(error) {
                res.status(400).json({error: (error as Error).message})
            } else {
                const sound = await this.soundRepository.create({
                    user_id: req.body.user_id,
                    sound_name: req.body.sound_name,
                    sound_file_url: req.files.sound_file_url[0].path,
                    sound_thumbnail_url: req.files.sound_thumbnail_url[0].path
                });
                res.json({
                  error: null,
                  data: sound
                })
              }
        })
    }
}