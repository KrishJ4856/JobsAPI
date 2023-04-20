const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  const errObject = {
    msg: err.message || 'Something went wrong, Please try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }
  if(err.code && err.code === 11000){
    errObject.msg = `Duplicate Value entered for ${Object.keys(err.keyValue)}. Please choose another value`
    errObject.statusCode = StatusCodes.BAD_REQUEST
  }
  if(err.name === "ValidationError"){
    errObject.msg = Object.values(err.errors).map(item => item.message).join(',')
    errObject.statusCode = StatusCodes.BAD_REQUEST
  }
  if(err.name === "CastError"){
    errObject.msg = `No object found with id: ${err.value}`
    errObject.statusCode = StatusCodes.NOT_FOUND
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  return res.status(errObject.statusCode).json({msg: errObject.msg})
}

module.exports = errorHandlerMiddleware
