import { useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Detail=()=>{
    const { id } = useParams();
    const tokene= localStorage.getItem("access-token") || ''
  
  
    // function to be called in useQuery/Mutaion
    const retrievePosts = async () => {
      const response = await axios.get(
        import.meta.env.VITE_API_URL+`/api/v1/propert/details/?id=${id}`,
        {headers:{
          Authorization: `JWT ${tokene}`,
        },}
      );
      return response.data;
    };
    
    const { isLoading, data } = useQuery({
      queryKey: ["posts"],
      queryFn: retrievePosts,
    });
    
    
    if (isLoading) return <p>Loading data ....</p>;
   

    return (
        <>
        <Navbar />
        <div className="  mx-12 px-8 py-4 bg-white rounded-lg shadow-md">


    <div className="mt-2">
        <h3 className="text-xl font-bold text-gray-700"  role="link">{data.title}

        </h3>
        <p className="mt-2 text-gray-600 ">{data.description}</p>
    </div>
    <p className="mt-2 text-gray-600 font-semibold">Location: {data.location}</p>
    <h3 className="font-bold text-gray-700 cursor-pointer py-2"  role="link">Hoster : {data.hoster_detail.first_name} {data.hoster_detail.last_name} </h3>
    <p className=" text-gray-600 font-bold">{data.price_night} FRW Per night</p>

    <div className="flex items-center justify-between mt-4">
    <a href={`/booking/${id}`} className="w-full justify-center items-center rounded-md border-2 border-blue-600 px-6 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white">Book Now</a>

    </div>
</div>
        </>
    )
}
export default Detail