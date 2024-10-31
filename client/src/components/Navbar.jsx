import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/chat" 
              className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
