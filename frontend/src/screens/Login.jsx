import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { BASE_URL } from "../constants/api";

function Login() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("saving_up_token", data.token);
        setSuccess("Sign In successful.");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="flex justify-center items-end lg:items-center pb-5 lg:pb-0"
      style={{
        height: "100vh",
        backgroundColor: "#008dff",
        backgroundImage:
          theme === "dark"
            ? "linear-gradient(0deg, #1a202c 0%, #30475e 100%)"
            : "linear-gradient(0deg, #6fb9f2 0%, #4086ea 50%, #044de8 100%)",
      }}
    >
      <div
        className={`w-100 h-[60vh] lg:h-auto ${
          theme === "dark" ? " bg-zinc-600" : "bg-white"
        } px-6 lg:px-20 py-16 rounded-t-xl lg:rounded-xl`}
      >
        <h1
          className={`font-bold ${
            theme === "dark" && " text-white"
          }  text-3xl text-center`}
        >
          Login to Account
        </h1>
        <p
          className={`${
            theme === "dark" ? "text-gray-50" : "text-zinc-600"
          }  text-center my-4 font-semibold`}
        >
          Please enter your email and password to continue
        </p>

        <form
          className="mt-6"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="email"
            className={`${
              theme === "dark" ? "text-gray-50" : "text-zinc-500"
            }  font-semibold text-left text-sm block my-1`}
          >
            Email address:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="johndoe@gmail.com"
            className="block bg-zinc-200 p-2 rounded font-medium"
            style={{ width: "100%" }}
            required
          />
          <label
            htmlFor="password"
            className={`${
              theme === "dark" ? "text-gray-50" : "text-zinc-500"
            }  font-semibold text-left text-sm block mt-4`}
          >
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="********"
              className="block bg-zinc-200 p-2 rounded font-medium"
              style={{ width: "100%" }}
              required
            />
            <button
              type="button"
              className="absolute top-0 right-0 mt-2 mr-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>
          <Link to={"/register"} className="mt-2">
            Not a registered user? Signup
          </Link>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
          <div
            className="flex justify-center mt-8 mx-auto"
            style={{ width: "80%" }}
          >
            <button
              type="submit"
              className="grow rounded-lg bg-blue-500 text-white font-semibold p-2 btn"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
