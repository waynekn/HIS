import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/user/user.selector";

function ProfilePage() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl mx-auto space-y-10">
        {/* User Info */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            Dr. {currentUser.username}
          </h1>
          <p className="text-gray-500 text-lg">Welcome to your dashboard</p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="../client/list/"
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold p-6 rounded-lg text-center shadow-sm transition-colors"
          >
            My Clients
          </Link>
          <Link
            to="../programs/"
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold p-6 rounded-lg text-center shadow-sm transition-colors"
          >
            My Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
