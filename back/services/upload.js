import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // try this route into the server saving files
        callback(null, './public/sounds/');
    },
    filename: function (req, file, callback) {
       callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage : storage }).fields([
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

    constructor (soundModel) {
        this.soundModel = soundModel
    }

    init (req, res) {
        upload(req, res, async (err) => {
            if(err) {
                return res.status(400).json({err})
            } else {
                const sound = await this.soundModel.create({
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