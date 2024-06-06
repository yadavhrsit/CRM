import { Link } from "react-router-dom"; 
const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
