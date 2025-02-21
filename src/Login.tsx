import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, FormProps, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const oauthKey = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let errorMessage: string;
const Login = () => {
  const navigate = useNavigate();

  type FieldType = {
    username?: string;
    password?: string;
  };

  // function to be called in useQuery/Mutaion
  const loginRes = async (bodyReq: FieldType) => {
    try {
      const response = await axios.post(apiUrl + "/login/", bodyReq);

      if (response.status === 200) {
        console.log(response.data['access'])
        localStorage.setItem("access-token", response.data["access"]);
        
        return navigate("/home");
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        errorMessage = "login failed";
      } else if (error.response.status === 400) {
        errorMessage = "login failed";
      }
    }
  };
  
  const {
    isPending,
    data: bodyReq,
    mutate,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginRes,
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const handleSuccess = (response: any) => {

    // Send the credential to your backend for verification
    axios
      .post(apiUrl + "/account/google/", {
        access_token: response.credential,
      })
      .then((res) => {
        localStorage.setItem("access-token", res.data["access_token"]);
        return navigate("/home");
        // Save user data (e.g., token) to local storage or state
      })
      .catch((err) => {
        console.error(err.data);
      });
  };

  return (
    <>
      <div className="w-full h-screen flex">
        {/* Left half of the screen - background styling */}
        <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center"></div>

        {/* Right half of the screen - login form */}
        <div className="w-1/2 h-full  flex flex-col p-20 justify-center">

          <div className="w-full flex flex-col max-w-[450px] mx-auto">
            {/* Header section with title and welcome message */}
            <div className="w-full flex flex-col mb-10 text-gray-700">
              <h3 className="text-4xl font-bold mb-2">Login</h3>
              <p className="text-lg mb-4">
                Welcome Back! Please enter your details.
              </p>
            </div>

            {errorMessage && (
      <Alert
        className="my-6 mx-4"
        message={errorMessage}
        type="error"
       
      />
    )}  

            <div className="w-full flex flex-col mb-6">
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={() => console.log("Failed to login....")}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                
                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit" loading={isPending}>
                    Login
                  </Button>
                </Form.Item>
              </Form>

              <GoogleOAuthProvider clientId={oauthKey}>
                <div className="App justify-center items-center w-64 mx-12">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {}}
                    text="signin_with"
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="w-full flex items-center justify-center mt-10">
                <p className="text-sm font-normal text-gray-700">
                  Don't have an account?{" "}
                  <span className="font-semibold text-gray-800 mx-4 cursor-pointer underline">
                    <a href="/signup">Sign Up</a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
