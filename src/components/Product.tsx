interface ProdProps {
  id: string;
  title: string;
  price: number;
  location: string;  // Fix: Change type from number to string
  description: string;
}

const Product: React.FC<ProdProps> = ({ id, title, price, description, location }) => {
  return (
    <div className="group relative border-2 rounded-xl p-4">
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-bold">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <p className="text-sm font-serif py-2 text-gray-900">{location}</p>
          <p className="text-sm font-mono text-gray-900">{price} RWF / per night</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        <a
          href={`/booking/${id}`}
          className="w-full flex justify-center items-center rounded-md border-2 border-blue-600 px-6 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
        >
          Book Now
        </a>
        <a
          href={`/detail/${id}`}
          className="w-full flex justify-center items-center rounded-md border-2 border-green-600 px-6 py-1 font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
        >
          View Property
        </a>
      </div>
    </div>
  );
};

export default Product;
