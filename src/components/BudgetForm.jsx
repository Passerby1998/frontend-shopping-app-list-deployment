import { useForm } from "react-hook-form";
import { postApiWithToken } from "../utils/api";
import { useState } from "react";
import Cookies from "js-cookie";

function BudgetForm({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const newBudgetFormContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "20%",
    marginBottom: "2rem",
  };

  async function createBudgetApi(data) {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      const serverRes = await postApiWithToken(
        "https://backend-shopping-list-app-deployment.onrender.com/grocerytrip",
        data,
        token
      );

      if (!serverRes.ok) {
        const errorMessage = await serverRes.text();
        alert(`Error: ${errorMessage}`);
        return; // Exit the function if the response is not okay
      }

      const resData = await serverRes.json();
      console.log("Response Data:", resData); // Log the response to understand its structure

      // Access the budget from the 'groceryTrip' object
      if (resData && resData.groceryTrip && resData.groceryTrip.budget) {
        const budget = resData.groceryTrip.budget;
        alert(`New budget created: RM ${budget}`);
        onSuccess();
        reset();
      } else {
        throw new Error(
          'Unexpected response structure: "groceryTrip.budget" not found'
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error creating new budget");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    await createBudgetApi(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={newBudgetFormContainerStyle}>
      <label>Budget (RM)</label>
      <input
        {...register("budget")}
        type="number"
        name="budget"
        placeholder="Enter your budget"
        step="0.01" // Allows decimals to represent currency accurately
      />
      <button className="primary-black" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Budget"}
      </button>
    </form>
  );
}

export default BudgetForm;
