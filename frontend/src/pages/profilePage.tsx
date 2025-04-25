import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/user/user.selector";

function ProfilePage() {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <div className="min-h-screen">
      <h1>
        Dr <span className="font-bold">{currentUser.username}</span>
      </h1>
      <ul>
        <li>
          <Link to="../client/list/">My Clients</Link>
        </li>
        <li>
          <Link to="../programs/">My Programs</Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfilePage;
