import axios from "axios";
import {
  formContainer,
  inputContainer,
  sectionBorder,
  sectionContainer,
} from "../sharedStyles/form";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Header from "../components/Header";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  async function loginApi(data) {
    try {
      const res = await axios.post(
        "https://backend-shopping-list-app-deployment.onrender.com/login",
        data
      );

      if (res.status !== 200) {
        const message = res.data.message;
        alert(message);
        throw new Error(message);
      }
      const token = res.data.token;
      console.log(token);
      alert("User logged in successfully");
      navigate("/dashboard");

      Cookies.set("authToken", token);
      reset();
    } catch (error) {
      console.error("Error at loginApi:", error);
      alert("An error occurred while logging in.");
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
