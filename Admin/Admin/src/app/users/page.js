'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/getall");
      const filtered = response.data.filter((u) => u && typeof u === "object" && u.username);
      setData(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const currentUsers = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="overflow-x-auto p-4 pt-2">
      <h1 className="mb-4 text-2xl font-bold">User List</h1>
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Username</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {currentUsers.map((user, index) => (
            <tr key={user.id || index} className="border-t">
              <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className="px-4 py-3">{user.username}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination with Arrows */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
        >
          &#8592;
        </button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`rounded px-4 py-2 ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Users;


