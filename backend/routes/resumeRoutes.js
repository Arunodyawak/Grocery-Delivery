import express from 'express'
import { protect } from  '../middleware/authMiddleware.js'
import { createResume, deleteResume, getResumesById, getUserResumes, updatedResume } from '../controllers/resumeController.js'
import { uploadResumeImages } from '../controllers/uploadimages.js'

const resumeRouter = express.Router()

resumeRouter.post('/',protect,createResume)
resumeRouter.get('/',protect,getUserResumes)
resumeRouter.get('/:id',protect,getResumesById)

resumeRouter.put('/:id', protect,updatedResume)
resumeRouter.put('/:id/upload-images', protect, uploadResumeImages)

resumeRouter.delete('/:id',protect,deleteResume)

export default resumeRouter;