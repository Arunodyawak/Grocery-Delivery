import Resume from '../modules/resumeModel.js'
import fs from 'fs'
import path from 'path';
export const createResume = async (req,res) => {
    try {
        const {title} = req.body;

        //default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
        const newResume = await Resume.create({
            userId:req.user.id,
            title,
            ...defaultResumeData,
            ...req.body
        })
        res.status(201).json(newResume)
    } 
    catch (error) {
        res.status(500).json({message: "Failed to create resume",error: error.message})
    }
}

//get function

export const getUserResumes = async (req,res) => {
    try {
        const resumes = await Resume.find({userId:req.user._id}).sort({
            updatedAt: -1
        });
        res.json(resumes)
    } catch (error) {
        res.status(500).json({message: "Failed to get resume",error: error.message})
    }
}

//get resume by id
export const getResumesById = async (req,res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id})

        if(!resume) {
            return res.status(404).json({message: "Resume not found"})
        }
        res.json(resume)
    } catch (error) {
        res.status(500).json({message: "Failed to get resume",error: error.message})

    }
}

//update resumes
export const updatedResume = async (req,res) => {
    try {
        const resume = await Resume.findOne({
            _id:req.params.id,
            userId: req.user._id
        })
        if(!resume) {
            return res.status(404).json({message: "Resume not found or not aurthrized"})
        }
        //merge update resumes
        Object.assign(resume, req.body)
        //save update resume
        const savedResume = await resume.save();
        res.json(savedResume)
    } catch (error) {
                res.status(500).json({message: "Failed to update resumes",error: error.message})

    }
}

//delete resume
export const deleteResume = async (req,res) => {
    try {
        const resume = await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id
        })
        if (!resume){
            return res.status(404).json({message: "Resume not found or not aurthrized"})

        }
        //create a uploads folder and store the resume there
        const uploadFolder = path.join(process.cwd(), 'uploads')

        //delete thumnail function
        if(resume.thumbnailLink){
            const oldThumbnail = path.join(uploadFolder,path.basename.thumbnailLink)
            if (fs.existsSync(oldThumbnail)){
                fs.unlinkSync(oldThumbnail)
            }
        }
        if(resume.profileInfo?.profilePreviewUrl){
            const oldProfile = path.join(
                uploadFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            )
            if (fs.existsSync(oldProfile)){
                fs.unlinkSync(oldProfile)
            }
        }
        //delete resume doc
        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId:req.user._id
        })
        if (!deleted){
             return res.status(404).json({message: "Resume not found or not aurthrized"})

            }
            res.json({message: "Resume deleted successful"})
    } catch (error) {
            res.status(500).json({message: "Failed to delete resumes",error: error.message})
    
    }
}