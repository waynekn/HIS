import { useEffect, useState } from "react";
import { Link } from "react-router";

import HealthProgramCreation from "../components/healthProgramCreation";

import api from "../api";
import { healthProgram } from "../types/healthProgram";
import handleGenericApiErrors from "../utils/errors";

function HealthProgramPage() {
  const [programs, setPrograms] = useState<healthProgram[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function fetchHealthPrograms() {
      try {
        const response = await api.get<healthProgram[]>("health-programs/");
        setPrograms(response.data);
      } catch (error) {
        setErrorMsg(handleGenericApiErrors(error));
      }
    }
    void fetchHealthPrograms();
  }, []);

  if (errorMsg) {
    return (
      <p className="bg-red-600 text-white rounded-lg py-4 px-2 mt-3 md:mx-10">
        {errorMsg}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-10 px-4">
      <HealthProgramCreation />

      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto mt-6">
        {programs.length === 0 ? (
          <p className="text-gray-600 text-center">
            You have not created any health programs.
          </p>
        ) : (
          <ul className="space-y-2">
            {programs.map((program) => (
              <li
                key={program.id}
                className="p-3 bg-indigo-50 text-indigo-800 rounded-lg shadow-sm"
              >
                <Link to={`/program/${program.id}/detail/`}>
                  {program.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HealthProgramPage;
