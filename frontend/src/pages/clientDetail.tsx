import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import api from "../api";
import handleGenericApiErrors from "../utils/errors";
import { ClientDetail } from "../types/clients";
import { selectCurrentUser } from "../store/user/user.selector";
import { useSelector } from "react-redux";

function ClientDetailPage() {
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    async function fetchClientDetail() {
      try {
        const res = await api.get<ClientDetail>(`client/${id}/detail/`);
        console.log(res.data);
        setDetail(res.data);
      } catch (error) {
        setErrMsg(handleGenericApiErrors(error));
      }
    }
    void fetchClientDetail();
  }, [id]);

  if (errMsg) {
    return (
      <p className="bg-red-600 text-white rounded-lg py-4 px-2 mt-3 md:mx-10">
        {errMsg}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl mx-auto space-y-6">
        {/* Client Name */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {detail?.client.name}
          </h1>
          <h1 className="text-xl font-bold text-indigo-700 mb-2">
            Doctor: {detail?.doctor}
          </h1>

          {/*Link to enroll the client to new programs */}
          {currentUser.username === detail?.doctor && (
            <div className="mb-2">
              <Link
                to={`../program/${id}/enrollment/`}
                className="text-white bg-indigo-base hover:bg-indigo-secondary font-medium px-4 py-2 
              rounded-xl shadow"
              >
                Add enrollment
              </Link>
            </div>
          )}

          <p className="text-gray-600">Client Details</p>
        </div>

        {/* Programs Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Programs
          </h2>

          {detail?.programs.length === 0 ? (
            <p className="text-gray-500">
              This client is not enrolled in any program.
            </p>
          ) : (
            <ul className="space-y-3">
              {detail?.programs.map((program) => (
                <li
                  key={program.id}
                  className="p-4 bg-indigo-50 rounded-lg text-indigo-800 shadow-sm"
                >
                  <Link to={`../program/${program.id}/detail/`}>
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDetailPage;
