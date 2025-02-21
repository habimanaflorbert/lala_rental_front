import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Alert, Button, DatePicker, Form, FormProps } from "antd";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs"; // Ensure you are using Day.js for Ant Design v4

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("access-token") || "";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Define the type for the request body
  type FieldType = {
    property?: string;
    event_date?: string; // Change Date to string
  };

  // Function to be called in useMutation
  const addBook = async (bodyReq: FieldType) => {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/api/v1/booking/",
      { ...bodyReq, property: id }, // Ensure `property` is set to `id`
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  };

  // useMutation hook
  const { isPending, mutate } = useMutation({
    mutationKey: ["posts"],
    mutationFn: addBook,
    onSuccess: () => {
      setSuccess("Booking added successfully!");
      setErrorMessage("");
    },
    onError: (error: any) => {
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
      setSuccess("");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const formattedValues = {
      ...values,
      event_date: values.event_date ? dayjs(values.event_date).format("YYYY-MM-DD") : "",
    };
    mutate(formattedValues);
  };
  
  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="py-4 font-bold">Booking</h2>

          {errorMessage && (
            <Alert className="my-6 mx-4" message={errorMessage} type="error" />
          )}

          {success && (
            <Alert className="my-6 mx-4" message={success} type="success" />
          )}

          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ property: id }} // Initialize `property` with `id`
            onFinish={onFinish}
            onFinishFailed={() => console.log("Failed to post....")}
            autoComplete="off"
          >
            <Form.Item
              label="Event Date"
              name="event_date"
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
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
  );
};

export default Booking;
