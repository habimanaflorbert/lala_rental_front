import React, { useState } from "react";
import { Alert, Button, Form, FormProps, Input, Select, Space } from "antd";
import Navbar from "../components/Navbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import handleLogout from "../components/Authorization/Logout";

type FieldType = {
  first_name?: string;
  last_name?: string;
  roles?: string;
};

const SettingsPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = localStorage.getItem("access-token") || "";
  const navigate = useNavigate();

  // Fetch user data
  const retrievePosts = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/account/user_me/",
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["userData"],
    queryFn: retrievePosts,
  });

  // Update user data
  const addPost = async (bodyReq: FieldType) => {
    try {
      const response = await axios.patch(
        import.meta.env.VITE_API_URL + "/account/",
        bodyReq,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setErrorMessage("");
        handleLogout();
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorMessage(
          Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
            .join("\n")
        );
      } else if (error.response?.status === 500) {
        setErrorMessage("Server error");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const { isPending, mutate } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: addPost,
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  if (isLoading) return <p>Loading data....</p>;

  return (
    <>
      <Navbar />
      <div className="w-full flex">
        {/* Left half of the screen - background styling */}
        <div className="w-6/12 h-full flex flex-col bg-[#282c34] "></div>
        <div className="w-full py-8">
          <h2 className="font-bold text-xl px-4 py-2">Profile Account</h2>
          {errorMessage && (
            <Alert className="my-6 mx-4" message={errorMessage} type="error" />
          )}
          
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              first_name: data.first_name,
              last_name: data.last_name,
              roles: data.roles,
            }}
            onFinish={onFinish}
            onFinishFailed={() => console.log("Failed to post....")}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please input your first name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please input your last name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Role"
              name="roles"
              rules={[{ required: true, message: "Please select an option!" }]}
            >
              <Select
                placeholder="Select an option"
                options={[
                  { value: "HOST", label: "Hoster" },
                  { value: "RENTER", label: "Renter" },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" loading={isPending}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;