import fs from 'fs'
import path from 'path'

import Resume from '../modules/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'

export const uploadResumeImages = async (req,res) => {
    try {
        //configure multer to handle images
        upload.fields([{name: "thumbnail"}, { name: "profileImage"}])
        (req,res, async (err) => {
            if(err) {
                return res.status(400).json({message: "File upload failed, error: err.message"})
            }
            const resumeId = req.params.id;
            const resume = await Resume.findOne({_id:resumeId, userId: req.user._id})

            if(!resume) {
                return res.status(404).json ({message: "Resume not found or unauthorized"})
            }
            //use process cwd to locate uploads folder
            const uploadFolder = path.join(process.cwd(), "uploads")
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.newProfileImage?.[0];

            if(newThumbnail){
                if(resume.thumbnailLink) {
                    const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
                    if(fs.existsSync(oldThumbnail))
                       fs.unlinkSync(oldThumbnail) 
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}` ;

            }
            // Same for profilepreview image

            if(newProfileImage){
                if(resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfile))
                       fs.unlinkSync(oldProfile) 
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}` ;

            }
            await resume.save();
            res.status(200).json ({
                message:"Image uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo.profilePreviewUrl
            })
        })
    } catch (error) {
        console.error('error uploading images:', err);
        res.status(500).json({
            message: "Failed to upload images",
            error:error.message
        })
    }
}