import { useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router";

import api from "../api";
import { Client } from "../types/clients";

function ClientSearch() {
  const [searchedClients, setSearchedClients] = useState<Client[]>([]);

  const searchCleints = debounce(async (clientName: string) => {
    try {
      const res = await api.get<Client[]>(`client/search/?name=${clientName}`);
      setSearchedClients(res.data);
    } catch {
      setSearchedClients([]);
    }
  }, 300);

  return (
    <div className="flex flex-col relative grow mb-4">
      <div className="relative">
        {/* search div input tag  */}
        <input
          className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 mt-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          id="search-bar"
          type="search"
          onChange={(e) => {
            void searchCleints(e.target.value);
          }}
          placeholder="Search for a client"
        />
      </div>

      {/* Display searched clients */}

      {searchedClients.length > 0 && (
        <div className="w-full absolute border-2 border-indigo-800 top-12 z-50 mt-2 border-2">
          <ul className="w-full bg-white shadow-lg rounded-md mt-1 z-50">
            {searchedClients.map((client) => (
              <li
                key={client.id}
                className="p-2 hover:bg-gray-200 cursor-pointer z-50"
              >
                <Link to={`../client/${client.id}/detail/`} className="block">
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default ClientSearch;
