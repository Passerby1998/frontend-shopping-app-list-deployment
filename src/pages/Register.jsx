import { json, Link } from "react-router-dom";
import Header from "../components/Header";
import {
  formContainer,
  inputContainer,
  sectionBorder,
  sectionContainer,
} from "../sharedStyles/form";
import { useForm } from "react-hook-form";
import { postApi } from "../utils/api";

function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  async function registerApi(data) {
    console.log("Form Data:", data); // Log form data

    try {
      const res = await postApi(
        "https://backend-shopping-list-app-deployment.onrender.com/register",
        data
      );

      if (!res.ok) {
        const serverError = await res.json();
        console.error("Server Error:", serverError);
        const errors = serverError.errors;
        errors.forEach((error) => {
          alert(error.message);
        });
        throw new Error(serverError);
      }

      const resData = await res.json();
      console.log("Response Data:", resData);
      alert("User registered successfully");
      reset();
    } catch (error) {
      console.error("Error at registerApi:", error);
      alert("Registration failed. Please try again.");
    }
  }

  function onSubmit(data) {
    registerApi(data);
  }

  return (
    <div>
      <Header />
      <div style={sectionContainer}>
        <section style={sectionBorder}>
          <h1 style={{ marginBottom: "1rem" }}>Register</h1>
          <form onSubmit={handleSubmit(onSubmit)} style={formContainer}>
            <div style={inputContainer}>
              <label htmlFor="username">Username</label>
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>
            <div style={inputContainer}>
              <label htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, //email regex
                    message: "Invalid email address",
                  },
                })}
                type="email"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div style={inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div style={inputContainer}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
              />
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </div>
            <div>
              <button type="submit" className="primary-black">
                Register
              </button>
              <span>
                {" "}
                or{" "}
                <Link to="/login" className="primary-black">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Register;
