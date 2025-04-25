import { useEffect, useState } from "react";
import { useParams } from "react-router";

import api from "../api";
import { HealthProgramDetail } from "../types/healthProgram";
import handleGenericApiErrors from "../utils/errors";

function ProgramDetail() {
  const [programDetail, setProgramDetail] =
    useState<HealthProgramDetail | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const { id } = useParams();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await api.get<HealthProgramDetail>(`program/${id}/detail/`);
        setProgramDetail(res.data);
      } catch (error) {
        setErrMsg(handleGenericApiErrors(error));
      }
    }
    void fetchDetail();
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
        {/* Program Name */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {programDetail?.name}
          </h1>
          <p className="text-gray-600">Program Details</p>
        </div>

        {/* Clients Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clients</h2>

          {programDetail?.clients && programDetail.clients.length === 0 ? (
            <p className="text-gray-500">
              There are no clients enrolled in this program.
            </p>
          ) : (
            <ul className="space-y-3">
              {programDetail?.clients?.map((client) => (
                <li
                  key={client.id}
                  className="p-4 bg-indigo-50 rounded-lg text-indigo-800 shadow-sm"
                >
                  {client.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramDetail;
