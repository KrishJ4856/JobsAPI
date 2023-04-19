# Silly Errors I Made While Coding:

1. Forgot the difference between Atlas Login password and Atlas User password
2. Forgot adding the Mongoose Model Name in mongoose.model(), like this: mongoose.model(UserSchema) ---> mongoose.model('User', UserSchema)
3. Forgot that The errors/index.js exports an object,and to import a specific error class, I need to wrap it inside a {}, like this: {BadRequestError}