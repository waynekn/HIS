import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import api from "../api";
import { healthProgram } from "../types/healthProgram";
import handleGenericApiErrors from "../utils/errors";
function ProgramEnrollment() {
  const { id } = useParams();
  const [programs, setPrograms] = useState<healthProgram[]>([]);
  const [enrollments, setEnrollments] = useState<number[]>([]);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    /*
    Fetches health programs created by the doctor that the specified 
    client (via `id`) has not enrolled in.

    Only the person who registered the client can make this request
    otherwise, a forbidden error will be returned.
    */
    async function fetchNonEnrolledPrograms() {
      try {
        const res = await api.get(`programs/${id}/non-enrollments/`);
        setPrograms(res.data);
      } catch (error) {
        setErrMsg(handleGenericApiErrors(error));
      }
    }
    void fetchNonEnrolledPrograms();
  }, [id]);

  async function createEnrollment() {
    try {
      await api.post(`programs/${id}/enroll/`, {
        programs: enrollments,
      });
      await navigate(`../client/${id}/detail/`);
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
        {programs.length === 0 ? (
          <p className="text-gray-500 text-center">
            This client has been enrolled in all your programs.
          </p>
        ) : (
          <>
            {/* Add Enrollment Button */}
            <div className="flex justify-end">
              <button
                onClick={createEnrollment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Add Enrollment
              </button>
            </div>

            {/* Programs List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {programs.map((program) => (
                <li
                  key={program.id}
                  className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg shadow-sm"
                >
                  <input
                    type="checkbox"
                    id={`${program.id}`}
                    name={program.name}
                    value={program.id}
                    onChange={handleCheckboxChange}
                    className="accent-indigo-600 w-5 h-5"
                  />
                  <label htmlFor={`${program.id}`} className="text-gray-700">
                    {program.name}
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ProgramEnrollment;
