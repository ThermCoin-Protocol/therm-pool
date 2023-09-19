import Background from "./background.js"

export default function Home() {
  
  return (
    <>
      <Background>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-40 w-auto animate-spin-slow"
              src="VerginaSun.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-4xl font-medium leading-9 tracking-wide text-gray-900">
              Join the ThermCoin Mining Pool
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-[#f4eee0] p-5 rounded-md border-2 border-gray-600">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="node-id" className="block text-sm font-light leading-6 text-gray-900">
                  Node-ID
                </label>
                <div className="mt-2">
                  <input
                    id="node-id"
                    name="node-id"
                    type="node-id"
                    autoComplete="node-id"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="wallet-address" className="block text-sm font-light leading-6 text-gray-900">
                    Wallet Address
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="wallet-address"
                    name="wallet-address"
                    type="wallet-address"
                    autoComplete="wallet-address"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 bg-stone-100 pl-2"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-stone-600 px-3 py-1.5 text-sm font-semibold leading-6 text-stone-100 shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 "
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
        </Background>
      </>
  )
}
