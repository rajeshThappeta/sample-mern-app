//create express app
const exp=require("express");
const mongoClient=require("mongodb").MongoClient;
const path=require("path")
const app=exp()

require("dotenv").config()

//connecting react build with express server
app.use(exp.static(path.join(__dirname,'./build')))

const dbConnectionString=process.env.DB_URL;

//connect to DB
mongoClient.connect(dbConnectionString)
.then(client=>{
  //create DB object
  const dbObj=client.db("intcdb22db");
  //get collection object
  const userCollectionObject=dbObj.collection("usercollection")
  //share userCollectionObj
  app.set("userCollectionObject",userCollectionObject)

  console.log("Connected to DB successfully")
})
.catch(err=>console.log("err in connecting to DB ",err))



//import userApp&productApp
const userApp=require("./APIS/userApi");
const productApp=require("./APIS/productApi")

//execute routes based on path
app.use("/user",userApp)
app.use("/product",productApp)

//assign port
const port=4000;
app.listen(port,()=>console.log("server on port 4000..."))