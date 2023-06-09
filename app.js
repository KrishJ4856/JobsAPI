require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('./swagger.yaml')

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect')
const authMiddleware = require('./middleware/authentication')

// router
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per minute
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Jobs API. Head over to the <a href="/api-docs">API Documentation (Swagger)</a></h1>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authMiddleware, jobRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('Successfully connected to DB');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
