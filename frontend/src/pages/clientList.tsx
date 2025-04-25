import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Client } from "../types/clients";
import api from "../api";
import handleGenericApiErrors from "../utils/errors";

function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await api.get<Client[]>("client/list/");
        setClients(res.data);
      } catch (error) {
        setErrMsg(handleGenericApiErrors(error));
      }
    }
    void fetchClients();
  }, []);

  if (errMsg) {
    return (
      <p className="bg-red-600 text-white rounded-lg py-4 px-2 mt-3 md:mx-10">
        {errMsg}
      </p>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Your clients
        </h1>

        {clients.length === 0 ? (
          <p className="text-gray-600 text-center">
            You don't have any clients.
          </p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li
                key={client.id}
                className="bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-lg p-4 shadow-sm"
              >
                <Link
                  to={`../${client.id}/${client.name}`}
                  className="text-indigo-700 font-medium hover:underline"
                >
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClientListPage;
