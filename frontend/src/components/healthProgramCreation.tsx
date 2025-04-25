import { useState } from "react";

import api from "../api";
import handleGenericApiErrors from "../utils/errors";
import { healthProgram } from "../types/healthProgram";

function HealthProgramCreation() {
  const [programName, setProgramName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  async function createProgram() {
    try {
      await api.post<healthProgram>("health-program/create/", {
        name: programName,
      });
      // Force a full page reload to trigger the useEffect in the parent component
      // to retrieve programs again
      location.reload();
    } catch (error) {
      setErrMsg(handleGenericApiErrors(error));
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-6 w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter name of health program"
        onChange={(e) => setProgramName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
      />
      {errMsg && <p className="text-red-600 text-sm mb-2">{errMsg}</p>}
      <button
        onClick={createProgram}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full"
      >
        Create
      </button>
    </div>
  );
}

export default HealthProgramCreation;
