import axios from "axios";
import { Space, Table } from "antd";
import type { TableProps } from "antd";
import Navbar from "../components/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface DataType {
  id: string;
  title: string;
  location: string;
  price_night: number;
}

const HouseProperty = () => {
  
  const queryClient = useQueryClient();
  const token = localStorage.getItem("access-token") || "";

  // Fetch properties
  const retrievePosts = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/v1/propert/my_property/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching properties:", error);
      throw error;
    }
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-property"],
    queryFn: retrievePosts,
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + `/api/v1/propert/delete/?id=${id}`,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-property"]); // Refresh property list after deletion
    },
  });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "id",
      render: (text, record) => <a href={`/detail/${record.id}`}>{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price per night",
      dataIndex: "price_night",
      key: "price_night",
    },
    {
      title: "Action",
      key: "id",
      render: (_, record) => (
        <Space size="middle">
          <a className="text-blue-600 font-bold" href={`/edit-property/${record.id}`}>
            Edit
          </a>
          <button
            className="text-red-600 font-bold"
            onClick={() => deleteMutation.mutate(record.id)}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </Space>
      ),
    },
  ];
  
  if (isLoading) return <p>Loading data....</p>;
  if (error instanceof Error) return <p>Error loading data: {error.message}</p>;
  
  return (
    <>
      <Navbar />
      <Table<DataType> columns={columns} dataSource={data} rowKey="id" />
    </>
  );
};

export default HouseProperty;
