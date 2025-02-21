import axios from "axios";
import Navbar from "../components/Navbar";
import Product from "../components/Product";
import { useQuery } from "@tanstack/react-query";
// import GenTypography from "../components/shared/typography";
const Home = () => {
  const tokene= localStorage.getItem("access-token") || ''
  
  
  // function to be called in useQuery/Mutaion
  const retrievePosts = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL+"/api/v1/propert/",
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
  
  
  if (isLoading) return <p>Loading data....</p>;
 
  return (
    <>
      <Navbar  />
      {/* <GenTypography /> */}
      <div className="w-full bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Customers also purchased
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((item: { id: string; title: string; price_night: number; description: string;location:any; }) => (
        <Product
          key={item.id}
          id={item.id}
          title={item.title}
          location={item.location}
          price={item.price_night}
          description={
            item.description.length > 100
              ? item.description.slice(0, 80) + " ..."
              : item.description
          }
        />
      ))}
            
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
