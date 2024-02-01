"use client";
import { useState } from "react";

export default function Register() {
  const [nodeId, setNodeId] = useState("");
  const [nodeIdValid, setNodeIdValid] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressValid, setWalletAddressValid] = useState(true);
  const [password, setPassword] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


  const nodeIdRegex = /^enode:\/\/[0-9a-fA-F]{128}@(\d{1,3}\.){3}\d{1,3}:\d{1,5}\?discport=\d{1,5}$/;

  const handleNodeIdChange = (event) => {
    const value = event.target.value;
    const isValid = nodeIdRegex.test(value);
    setNodeIdValid(isValid);
    if (isValid) {
      setNodeId(value);
    }
  };

  const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  const handleWalletAddressChange = (event) => {
    const value = event.target.value;
    const isValid = walletAddressRegex.test(value);
    setWalletAddressValid(isValid);
    if (isValid) {
      setWalletAddress(value);
    }
  };


  const handleRegisterNode = async (event) => {
    event.preventDefault();
    const payload = { nodeId, walletAddress };
    try {
      const response = await fetch(`${apiUrl}/pool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.message === "Miner added successfully") {
        alert("Miner added successfully");
      } else {
        alert("Error adding miner");
      }
    } catch (err) {
      console.error("Error registering node:", err.message);
    }
  };

  const handleChangeWallet = async (event) => {
    event.preventDefault();
    const payload = { nodeId, walletAddress };
    try {
      const response = await fetch(`${apiUrl}/pool/${nodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.message === "Miner updated successfully") {
        alert("Miner updated successfully");
      } else {
        alert("Error adding miner");
      }
    } catch (err) {
      console.error("Error changing wallet:", err);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto animate-spin-slow"
            src="VerginaSun.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-4xl font-medium leading-9 tracking-wide text-gray-900">
            Join the ThermCoin Mining Pool
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-[#f4eee0] p-5 rounded-md border-2 border-gray-600">
          <form className="space-y-3" action="#" method="POST">
            <div>
              <label
                htmlFor="node-id"
                className="block text-sm font-light leading-6 text-gray-900"
              >
                Node-ID
              </label>
              <div className="mt-2">
                <input
                  id="node-id"
                  name="node-id"
                  type="text"
                  autoComplete="off"
                  placeholder="enode://..."
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  onChange={handleNodeIdChange}
                />
              </div>
              {!nodeIdValid && (
                <p className="text-red-500 text-xs italic">Please enter a valid node ID.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="wallet-address"
                  className="block text-sm font-light leading-6 text-gray-900"
                >
                  Wallet Address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="wallet-address"
                  name="wallet-address"
                  type="text"
                  autoComplete="off"
                  placeholder="0x..."
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  onChange={handleWalletAddressChange}
                />
              </div>
              {!walletAddressValid && (
                <p className="text-red-500 text-xs italic">Please enter a valid wallet address.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-light leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  placeholder="..."
                  disabled
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-light leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirm password"
                  name="confirm password"
                  type="assword"
                  autoComplete="password"
                  placeholder="..."
                  disabled
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row">
              <button
                type="submit"
                className={`flex w-full mx-1 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-stone-100 shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 ${!walletAddressValid || !nodeIdValid ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-600'
                  }`}
                onClick={handleRegisterNode}
                disabled={!walletAddressValid || !nodeIdValid}
              >
                Register Node
              </button>
              <button
                type="button"
                className={`flex w-full mx-1 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-stone-100 shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 ${true ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-600'
                  }`}
                onClick={handleChangeWallet}
                disabled
              >
                Change Wallet
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
