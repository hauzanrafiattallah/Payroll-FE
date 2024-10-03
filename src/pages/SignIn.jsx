const SignIn = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div
          className="bg-white p-6 md:p-8 lg:p-12 rounded-lg shadow-lg w-[90%] sm:w-[24rem] md:w-[30rem] lg:w-[30rem] min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem] relative"
          style={{
            boxShadow: "0 0 10px 3px rgba(180, 37, 42, 0.15)",
          }}
        >
          <div className="absolute inset-0 rounded-lg shadow-lg shadow-red-500/20"></div>
          <div className="relative z-10 flex justify-center mb-4">
            {/* Logo */}
            <img
              src="/header.png"
              alt="Humic Payroll"
              className="h-16 sm:h-18 lg:h-24"
            />
          </div>
          {/* Form */}
          <form className="relative z-10">
            <div className="mb-3">
              {/* Label untuk input Username */}
              <label
                className="block mb-1 text-sm font-bold text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              {/* Input Username */}
              <input
                className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline md:h-14 md:text-lg"
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-5">
              {/* Label untuk input Password */}
              <label
                className="block mb-1 text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              {/* Input Password */}
              <input
                className="w-full h-12 px-4 py-2 text-base leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline md:h-14 md:text-lg"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-center">
              {/* Tombol Sign In */}
              <button
                className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-7 h-12 md:h-14"
                type="button"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
