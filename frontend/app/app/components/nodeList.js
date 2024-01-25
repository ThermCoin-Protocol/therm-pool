'use client';
import React, { useState, useEffect } from 'react';

export default function NodeList() {
  const [nodes, setNodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true); // State to keep track of whether there's a next page
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchNodes(currentPage);
  }, [currentPage]);

  const fetchNodes = (page) => {
    fetch(`${apiUrl}/pool?page=${page}`, {
      method: 'GET',
      headers: {
        // For ngrok server!
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNodes(data.data);
        setHasNextPage(data.meta.hasNextPage); // Update hasNextPage state based on response
      })
      .catch(err => {
        console.error("Failed to fetch nodes:", err);
        setError(err.message);
      });
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage => currentPage + 1);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-medium leading-9 tracking-wide text-gray-900">
          Node List
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-4 bg-[#f4eee0] p-5 rounded-md border-2 border-gray-600">
          {nodes.map((node, index) => (
            <li key={index} className="flex justify-between p-2 hover:bg-gray-100">
              <span>Node ID: {node.node_id.slice(0, 15)}{node.node_id.length > 15 ? '...' : ''}</span>
              <span>Wallet: {node.wallet_address.slice(0, 15)}{node.wallet_address > 15 ? '...' : ''}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            className={`rounded bg-stone-600 px-4 py-2 text-white hover:bg-stone-500 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <button
            className={`rounded bg-stone-600 px-4 py-2 text-white hover:bg-stone-500 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={!hasNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}