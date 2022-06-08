//create mini exp app/Router
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()
//middleware to parse  body of req
userApp.use(exp.json());

//define routes
//route for GET req for all users
userApp.get("/get-users", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get data
  let users = await userCollectionObject.find().toArray();
  //send res
  response.send({ message: "users data", payload: users });
});

//route for GET req for one user by his id
userApp.get("/get-user/:id", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get url param
  let userId = +request.params.id; // "200"===>200
  //find user by id
  let user = await userCollectionObject.findOne({ id: userId });
  //send res
  response.send({ message: "User data", payload: user });
});

//route for POST req
userApp.post("/create-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;

  //verify existing user
  let userOfDB = await userCollectionObject.findOne({
    username: userObj.username,
  });

  //if user existed
  if (userOfDB !== null) {
    response.send({ message: "User already existed..Choose another username" });
  }
  //if user not existed
  else {
    //hash the password
    let hashedPassword = await bcryptjs.hash(userObj.password, 6);
    //replace plain password with hashed password
    userObj.password = hashedPassword;
    //insert into db
    await userCollectionObject.insertOne(userObj);
    //send res
    response.send({ message: "User created" });
  }
});

//route for PUT req
userApp.put("/update-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;
  //update user by id
  await userCollectionObject.updateOne(
    { username: userObj.username },
    { $set: { ...userObj } }
  );
  //send res
  response.send({ message: "User modied" });
});

//route for DELETE req
userApp.delete("/remove-user/:id", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get url param
  let userId = +request.params.id;
  //delete user
  await userCollectionObject.deleteOne({ id: userId });
  //send res
  response.send({ message: "User removed" });
});

//user login
userApp.post("/login", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");

  //get user cred obj
  const userCredentialsObj = request.body;
  //verify username
  let user = await userCollectionObject.findOne({
    username: userCredentialsObj.username,
  });
  //if user not existed
  if (user === null) {
    response.send({ message: "Invalid user" });
  }
  //if user existed
  else {
    //verify password
    let isTrue = await bcryptjs.compare(
      userCredentialsObj.password,
      user.password
    );
    //if passwords are not matched
    if (isTrue !== true) {
      response.send({ message: "Invalid password" });
    }
    //if passwords are matched
    else {
      //create json web token(jwt)
      let token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, {
        expiresIn: 10,
      });
      //send to ken to client
      response.send({ message: "success", token: token, userObj: user });
    }
  }
});

//create middleare to verify the token
const verifyToken = (request, response, next) => {
  //get token
  let token = request.headers.authorization;
  //if token is not existed
  if (token === undefined) {
    response.send({ message: "Unauthorized access" });
  }
  //if token is exited
  else {
    //verify the token
    try {
      let result = jwt.verify(token, process.env.SECRET_KEY);
      //pass req to next
      next();
    } catch (err) {
      response.send({ message: "Token expired..please relogin" });
    }
  }
};

//protected route
userApp.get("/test", verifyToken, (request, response) => {
  response.send({ message: "This is protected route" });
});

//export userApp
module.exports = userApp;
