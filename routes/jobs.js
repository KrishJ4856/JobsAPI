const express = require('express')
const {
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    createJob
} = require('../controllers/jobs')

const jobRouter = express.Router()

jobRouter.route('/').get(getAllJobs).post(createJob)
jobRouter.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = jobRouter