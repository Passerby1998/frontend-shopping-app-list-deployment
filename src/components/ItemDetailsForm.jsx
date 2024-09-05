import { useForm } from "react-hook-form";
import { useState } from "react";
import Cookies from "js-cookie";
import { postApiWithToken } from "../utils/api";

function ItemDetailsForm({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const newItemFormContainerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
    width: "100%",
    marginTop: "1rem",
    marginBottom: "2rem",
  };

  async function createItemApi(data) {
    try {
      setLoading(true);
      const token = Cookies.get("authToken");
      const serverRes = await postApiWithToken(
        "https://backend-shopping-list-app-deployment.onrender.com/items",
        data,
        token
      );
      if (!serverRes.ok) {
        alert("You are not authorized to create a new item");
        return;
      }
      const resData = await serverRes.json();
      console.log(resData);
      alert(`New item created: ${resData.data.name}`);
      onSuccess();
      reset();
    } catch (error) {
      console.error(error);
      alert("Error creating new item");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    await createItemApi(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={newItemFormContainerStyle}>
      <label>Name</label>
      <input
        {...register("name")}
        type="text"
        name="name"
        placeholder="Item name"
      />
      <label>Description</label>
      <input
        {...register("description")}
        type="text"
        name="description"
        placeholder="Item description"
      />
      <label>Quantity</label>
      <input
        {...register("quantity")}
        type="number"
        name="quantity"
        placeholder="Item quantity"
      />
      <label>Price Each (RM)</label>
      <input
        {...register("price_each")}
        type="number"
        name="price_each"
        placeholder="Enter price in RM"
        step="0.01" // Allows decimals to represent currency accurately
      />
      <button className="primary-black" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}

export default ItemDetailsForm;
