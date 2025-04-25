import { useEffect, useState } from "react";

import { Client } from "../types/clients";

import api from "../api";
import handleGenericApiErrors from "../utils/errors";
import { healthProgram } from "../types/healthProgram";

function ClientCreationPage() {
  const [clientName, setClientName] = useState("");
  const [programs, setPrograms] = useState<healthProgram[]>([]);
  const [enrollments, setEnrollments] = useState<number[]>([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await api.get<healthProgram[]>("health-programs/");
        setPrograms(res.data);
      } catch (error) {
        setErrMsg(handleGenericApiErrors(error));
      }
    }
    void fetchPrograms();
  }, []);

  async function createClient() {
    try {
      const res = await api.post<Client>("client/create/", {
        name: clientName,
        programs: enrollments,
      });
      console.log(res.data);
      // TODO: redirect to client detail page
    } catch (error) {
      setErrMsg(handleGenericApiErrors(error));
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const enrollmentId = parseInt(value, 10); // Ensure value is treated as a number

    if (checked) {
      setEnrollments((prevEnrollments) => [...prevEnrollments, enrollmentId]);
    } else {
      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((enrollment) => enrollment !== enrollmentId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl mx-auto space-y-6">
        {/* Client Name Input */}
        <div>
          <input
            type="text"
            placeholder="Enter client name"
            required
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errMsg && <p className="text-red-600 text-sm mt-1">{errMsg}</p>}
        </div>

        {/* Create Button */}
        <button
          onClick={createClient}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full"
        >
          Create Client
        </button>

        {/* Program Enrollment Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Register to your health programs
          </h2>

          {programs.length === 0 ? (
            <p className="text-gray-500">You don't have any health programs.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {programs.map((program) => (
                <li key={program.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${program.id}`}
                    name={program.name}
                    value={program.id}
                    onChange={handleCheckboxChange}
                    className="accent-indigo-600"
                  />
                  <label htmlFor={`${program.id}`} className="text-gray-700">
                    {program.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientCreationPage;
