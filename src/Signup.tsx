import { Alert, Button, Form, FormProps, Input } from "antd";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const oauthKey= import.meta.env.VITE_GOOGLE_CLIENT_ID;


let errorMessage:string ;
const Signup = () => {
  const navigate = useNavigate();
  // types of your form values
  type FieldType = {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    password?: string;
    
  };
  
  // function to be called in useQuery/Mutaion
  const addPost = async (bodyReq: FieldType) => {
    try {
      const response = await axios.post(apiUrl + "/account/", bodyReq);
      
      if(response.status===201){
        
        return navigate("/login");
      }
    } catch (error: any) {
      if (error.response.status===400){
        errorMessage = Object.entries( error.response.data)
        .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
        .join("\n");
      }else if(error.response.status===400){
        errorMessage="server error"
      }
    
    }
  };
  
  
  const {
    isPending,
    data: addPostRes,
    mutate,
  } = useMutation({
    mutationKey: ["posts"],
    mutationFn: addPost,
  });
  
  
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
 
  };
  
  
  const handleSuccess = (response: any) => {
    console.log('Login Success:', response);

    // Send the credential to your backend for verification
    axios.post(apiUrl +'/account/google/', {
      access_token: response.credential,
    })
    .then((res) => {
      localStorage.setItem("access-token", res.data['access_token']);
      return navigate("/home");
      // Save user data (e.g., token) to local storage or state
    })
    .catch((err) => {
      
      console.error(err.data);
    });
  };
 

  return (
    <div className="w-full h-screen flex ">
      {/* Left half of the screen - background styling */}
      <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center"></div>
      <div className="w-1/2 py-8">
      <h2 className="font-bold  text-xl px-4 py-2"> Create account</h2>
      {errorMessage && (
      <Alert
        className="my-6 mx-4"
        message={errorMessage}
        type="error"
       
      />
    )}   
      
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={() => console.log("Failed to post....")}
        autoComplete="off"
      >
         <Form.Item<FieldType>
          label="Firs tName"
          name="first_name"
          
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Account
          </Button>
        </Form.Item>
      </Form>
     
     <GoogleOAuthProvider clientId={oauthKey}>
      <div className="App justify-center items-center w-64 mx-12">
       
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={()=>{}}
          text="signup_with"
        />
      </div>
    </GoogleOAuthProvider> 
     </div>
    </div>
  );
};

export default Signup;
