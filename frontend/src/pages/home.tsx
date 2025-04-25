import { Link, Outlet } from "react-router";

function HomePage() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col items-center justify-center p-6 relative">
      {/* Sign In / Sign Up Links */}
      <div className="absolute top-4 right-6 space-x-4">
        <Link
          to="login"
          className="text-indigo-base font-medium hover:underline"
        >
          Sign In
        </Link>
        <Link
          to="signup"
          className="text-white bg-indigo-base hover:bg-indigo-secondary font-medium px-4 py-2 rounded-xl shadow"
        >
          Sign Up
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-indigo-base mb-6">
          CEMA HEALTH INFORMATION SYSTEM
        </h1>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Features</h3>
        <ul className="text-left text-gray-700 space-y-3 list-disc list-inside">
          <li>Creating a health program</li>
          <li>Register a new client</li>
          <li>Enroll a client in one or more programs</li>
          <li>Search and view a client&apos;s profile</li>
        </ul>
      </div>

      <Outlet />
    </div>
  );
}

export default HomePage;
