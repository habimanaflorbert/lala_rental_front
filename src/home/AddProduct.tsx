
import axios from "axios";
import Navbar from "../components/Navbar"
import { Alert, Button, Form, FormProps, Input, InputNumber } from "antd";
import { useMutation } from "@tanstack/react-query";
import TextArea from "antd/es/input/TextArea";

let errorMessage:string ;
let success:string;
const AddProduct=()=>{
  const tokene= localStorage.getItem("access-token") || '';
  
  type FieldType = {
    title?: string;
    description?: string;
    location?: string;
    price_night?: number;
  };
   // function to be called in useQuery/Mutaion
   const addPost = async (bodyReq: FieldType) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/api/v1/propert/",
        bodyReq,{headers:{
          Authorization: `JWT ${tokene}`,
        },},);
      
      if(response.status===201){
        errorMessage="";
        success="Added successful";
      }
    } catch (error: any) {
      if (error.response.status===400){
        errorMessage = Object.entries( error.response.data)
        .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
        .join("\n");
      }else if(error.response.status===500){
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
  
  
    return (
        <>
 
 <Navbar/>
<div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
 
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
 <h2 className="py-4 font-bold"> Add Product</h2>
 
 {errorMessage && (
      <Alert
        className="my-6 mx-4"
        message={errorMessage}
        type="error"
       
      />
    )}

     {success && (
      <Alert
        className="my-6 mx-4"
        message={success}
        type="success"
       
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
          label="Title"
          name="title"
          
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="location"
          name="location"
          rules={[{ required: true, message: "Please input your Location!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Price Per night"
          name="price_night"
          rules={[{ required: true, message: "Please input your Price!" }]}
        >
          <InputNumber />
        </Form.Item>
        
        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input your description!" }]}
        >
     
        <TextArea rows={4} placeholder="Enter description here "  />
        </Form.Item>

       
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Submit
          </Button>
        </Form.Item>
      </Form>

  </div>
</div>
        
        </>
    )

}
export default AddProduct