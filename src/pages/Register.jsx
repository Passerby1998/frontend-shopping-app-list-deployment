import { Link } from "react-router-dom";
import Header from "../components/Header";
import {
  formContainer,
  inputContainer,
  sectionBorder,
  sectionContainer,
} from "../sharedStyles/form";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import axios

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
      // Use axios to send the POST request
      const res = await axios.post(
        "https://backend-shopping-list-app-deployment.onrender.com/register",
        data
      );

      if (res.status >= 200 && res.status < 300) {
        // Successful response
        const resData = res.data;
        console.log("Response Data:", resData);
        alert("User registered successfully");
        reset();
      } else {
        // Handle non-successful status codes
        console.error("Server Error:", res);

        const serverError = res.data || {};
        const errors = serverError.errors || [];
        errors.forEach((error) => {
          alert(error.message || "An error occurred");
        });
        throw new Error(serverError.message || "Unknown server error");
      }
    } catch (error) {
      console.error("Error at registerApi:", error);

      // Axios error handling, display error response if available
      if (error.response) {
        const serverError = error.response.data || {};
        alert(serverError.message || "Registration failed. Please try again.");
      } else {
        alert("Registration failed. Please try again.");
      }
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
