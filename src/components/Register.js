import {useState} from "react";
import { useForm } from "react-hook-form";
import {Form,Button} from 'react-bootstrap'
import axios from "axios";
import {useNavigate} from 'react-router-dom'

function Register() {

  let {register,handleSubmit,formState:{errors}}=useForm()
  let navigate=useNavigate()
  let [errMsg,setErrMsg]=useState("")

  const onFormSubmit=async(userObj)=>{
    //make API call by sending userObj to user api
    let res=await axios.post("/user/create-user",userObj)
    if(res.data.message==="User created"){
      navigate("/login")
    }
    else{
      setErrMsg(res.data.message)
    }
    
  }

  return (
    <div className="container">
      <div className="display-2 text-center text-primary">User Registration</div>
      {/* registration form */}
      <>
       
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text"  {...register("username")}/>
          </Form.Group>
          <h4 className="text-danger text-center">{errMsg}</h4>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" {...register("password")}></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register("email")} />
          </Form.Group>
          <Button type="submit" className="btn btn-success">Register</Button>
        </form>
      </>
    </div>
  );
}

export default Register;
