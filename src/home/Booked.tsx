import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar"
import axios from "axios";
import { Space, Table, TableProps } from "antd";

const Booked=()=>{
    interface DataType {
        id: string;
        property: string;
        property_detail: {
          id: string;
          title: string;
          description: string;
          price_night: number;
          location: string;
          hoster_detail: {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            username: string;
          };
          created_on: string;
        };
        event_date: string;
        booker: string;
        booker_detail: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          username: string;
        };
        status:string;
        created_on: string;
      }
      
      
    const queryClient = useQueryClient();
    const token = localStorage.getItem("access-token") || "";
  
    // Fetch properties
    const retrievePosts = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/v1/booking/booked_order/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );
        console.log(response.data)
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
  
    // Cancel property mutation
    const cancelMutation = useMutation({
      mutationFn: async (id: string) => {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + `/api/v1/booking/cancel_order/?id=${id}`,
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

       // Delete property mutation
       const ConfirmMutation = useMutation({
        mutationFn: async (id: string) => {
          const response = await axios.get(
            import.meta.env.VITE_API_URL + `/api/v1/booking/confirm_order/?id=${id}`,
            {
              headers: { Authorization: `JWT ${token}`},
            }
          );
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries(["confirm-property"]); // Refresh property list after deletion
        },
      });
  
    const columns: TableProps<DataType>["columns"] = [
        {
          title: "Property Name",
          dataIndex: "property_detail",
          key: "property_detail",
          render: (property_detail) => (
            <a href={`/detail/${property_detail.id}`}>{property_detail.title}</a>
          ),
        },
        {
          title: "Location",
          dataIndex: "property_detail",
          key: "location",
          render: (property_detail) => property_detail.location,
        },
        {
          title: "Price Per Night",
          dataIndex: "property_detail",
          key: "price_night",
          render: (property_detail) => `${property_detail.price_night} RWF`,
        },
        {
          title: "Booker",
          dataIndex: "booker_detail",
          key: "booker_detail",
          render: (booker_detail) =>
            `${booker_detail.first_name} ${booker_detail.last_name}`,
        },
        {
          title: "Event Date",
          dataIndex: "event_date",
          key: "event_date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
          },
        {
          title: "Booking Created",
          dataIndex: "created_on",
          key: "created_on",
          render: (created_on) => new Date(created_on).toLocaleString(),
        },
        {
          title: "Action",
          key: "id",
          render: (_, record) => (
            <Space size="middle">
                <button
                className="text-green-600 font-bold"
                onClick={() => ConfirmMutation.mutate(record.id)}
                disabled={ConfirmMutation.isLoading}
              >
                {ConfirmMutation.isLoading ? "Confirming..." : "Confirm"}
              </button>
              

              
              <button
                className="text-red-600 font-bold"
                onClick={() => cancelMutation.mutate(record.id)}
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? "Cancel..." : "Cancel"}
              </button>
            </Space>
          ),
        },
      ];
      
    
    if (isLoading) return <p>Loading data....</p>;
    if (error instanceof Error) return <p>Error loading data: {error.message}</p>;
    
    return(
        <>
     <>
      <Navbar />
      <Table<DataType> columns={columns} dataSource={data} rowKey="id" />
    </>
        </>
    )
}
export default Booked