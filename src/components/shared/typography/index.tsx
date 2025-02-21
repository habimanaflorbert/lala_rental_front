import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";



// function to be called in useQuery/Mutaion
const GenTypography = () => {
  
  
  const retrievePosts = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  };
  // use react queryies (useQuery, useMutation)
  // useQUery: for GET
  // useMutation: for POST, PUT (wrinting)
  const { isLoading, data } = useQuery({
    queryKey: ["posts"],
    queryFn: retrievePosts,
  });
  
  if (isLoading) return <p>Lading data....</p>;

// types of your form values
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

// function to be called in useQuery/Mutaion
const addPost = async (bodyReq: FieldType) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    bodyReq,
    {
      headers: {
        Authorization: `Bearer ${"hjksd"}`,
      },
    }
  );
  return response.data;
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
    console.log("jjj",values)
  };

  // inputs are from antd.design

  return (
    <div>
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
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
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

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GenTypography;
