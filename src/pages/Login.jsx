const Login = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div
          className="bg-white p-12 rounded-lg shadow-lg w-[28rem] min-h-[32rem] relative"
          style={{
            boxShadow: "0 0 10px 3px rgba(180, 37, 42, 0.15)",
          }}
        >
          <div className="absolute inset-0 rounded-lg shadow-lg shadow-red-500/20"></div>
          <div className="relative z-10 flex justify-center mb-6">
            {/* Logo */}
            <img src="/header.png" alt="Humic Payroll" className="h-20" />
          </div>
          {/* Form */}
          <form className="relative z-10">
            <div className="mb-4">
              {/* Label untuk input Username */}
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              {/* Input Username */}
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#D9D9D9] h-16 text-lg"
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              {/* Label untuk input Password */}
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              {/* Input Password */}
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#D9D9D9] h-16 text-lg"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-center">
              {/* Tombol Log In */}
              <button
                className="bg-[#B4252A] hover:bg-[#8E1F22] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full h-16"
                type="button"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
