import {
  formContainer,
  inputContainer,
  sectionBorder,
  sectionContainer,
} from "../sharedStyles/form";
import { postApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Header from "../components/Header";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  async function loginApi(data) {
    try {
      const res = await postApi(
        "https://backend-shopping-list-app-deployment.onrender.com/login",
        data
      );

      console.log("Full Response:", res); // Log the full response for debugging

      // Handle response directly
      if (res.status !== 200) {
        const message = res.data.message || "An error occurred";
        alert(message);
        throw new Error(message);
      }

      const token = res.data.token;
      console.log("Token:", token);
      alert("User logged in successfully");
      navigate("/dashboard");

      Cookies.set("authToken", token);
      reset();
    } catch (error) {
      console.error(
        "Error at loginApi:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to log in. Please try again.");
    }
  }

  function onSubmit(data) {
    loginApi(data);
  }
  return (
    <div>
      <Header />
      <div style={sectionContainer}>
        <section style={sectionBorder}>
          <h1 style={{ marginBottom: "1rem" }}>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} style={formContainer}>
            <div style={inputContainer}>
              <label htmlFor="email">Email</label>
              <input {...register("email")} type="email" id="email" />
            </div>
            <div style={inputContainer}>
              <label htmlFor="password">Password</label>
              <input {...register("password")} type="password" id="password" />
            </div>
            <div>
              <button className="primary-black" type="submit">
                Login
              </button>
              console.log(button)
              <span>
                {" "}
                or{" "}
                <Link to="/register" className="primary-black">
                  Register
                </Link>
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
