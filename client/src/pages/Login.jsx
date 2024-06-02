import { useState } from "react";
import Logo from "../assets/Logo.svg";
import hidePasswordIcon from "../assets/hide-password.svg";
import headerImage from "../assets/login-bg-1.svg";
import { useLoginUserService } from "../service/auth.service";
import HashLoader from "react-spinners/HashLoader";

const Login = () => {
  const { loginUserService, loader, error } = useLoginUserService();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    let data = {
      email: email,
      password: password,
    };
    await loginUserService(data);
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="h-1/3 md:h-2/3">
        <img
          src={headerImage}
          alt="headerImage"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 top-5 md:top-20 xl:top-12 flex flex-col items-center gap-5 z-10">
        <img src={Logo} className="lg:h-15" alt="logo" />
        <div className="text-xl text-white lg:text-2xl">
          Online Project Management
        </div>
      </div>
      <div className="absolute inset-x-0 md:top-1/3 flex items-center justify-center z-20 flex-col">
        <div className="bg-white p-8 md:p-10 lg:rounded-lg lg:shadow-lg w-full max-w-sm">
          {!loader && <h2 className="text-2xl mb-6">Login to get started</h2>}
          {loader ? (
            <div className="flex justify-center items-center">
              <HashLoader
                color={"#0455A0"}
                loading={loader}
                size={50} // Adjust the size as needed
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={hidePasswordIcon}
                      alt="toggle password visibility"
                    />
                  </button>
                </div>
              </div>
              <div className="mb-6 text-right">
                <a href="#" className="text-blue-600">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#044E92] text-white py-2 rounded-3xl hover:bg-[#0474DA] transition-colors"
              >
                Login
              </button>
            </form>
          )}
        </div>
        {error && (
          <div className="text-red-500 text-md text-center mt-20">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
