import { useEffect, useState } from "react";
import {
  deleteApiWithToken,
  getApiWithToken,
  putApiWithToken,
} from "../utils/api";
import Cookies from "js-cookie";
import Header from "../components/Header";
import BudgetForm from "../components/BudgetForm";
import ItemDetailsForm from "../components/ItemDetailsForm";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [budgetList, setBudgetList] = useState([]); // Initialize as empty array
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  async function fetchItemsAndBudgets() {
    try {
      setIsLoading(true);
      const token = Cookies.get("authToken");

      // Fetch budgets #called but not fetchable
      const budgetRes = await getApiWithToken(
        "https://backend-shopping-list-app-deployment.onrender.com/grocerytrip",
        token
      );
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        console.log("Fetched budget data:", budgetData); // Debugging line

        // Ensure the data is in the expected format
        if (Array.isArray(budgetData.data)) {
          setBudgetList(budgetData.data); // Assume data is directly an array
          setBudget(budgetData.data[0] || null); // Use the first element of the array if available
        } else {
          console.error("Unexpected data structure:", budgetData);
        }
      } else {
        alert("You are not authorized to view the budget");
      }

      // Fetch items
      const itemsRes = await getApiWithToken(
        "https://backend-shopping-list-app-deployment.onrender.com/items",
        token
      );
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        console.log("Fetched items data:", itemsData); // Debugging line
        setItems(itemsData.data || []); // Ensure itemsData.data is always an array
      } else {
        alert("You are not authorized to view the items");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItemsAndBudgets();
  }, []);

  useEffect(() => {
    // Calculate total price and check if it exceeds the budget
    if (budget && items.length > 0) {
      const totalPrice = items.reduce(
        (acc, item) => acc + (item.quantity * item.price_each || 0),
        0
      );

      if (totalPrice > (budget.amount || 500)) {
        //amount budget fixed to 500
        setAlertMessage("The total price of items exceeds the budget!");
      } else {
        setAlertMessage(""); // Clear the alert if the price is within the budget
      }
    }
  }, [budget, items]);

  async function deleteItem(itemId) {
    const token = Cookies.get("authToken");
    try {
      const response = await deleteApiWithToken(
        `https://backend-shopping-list-app-deployment.onrender.com/items/${itemId}`,
        token
      );
      if (response.ok) {
        alert("Item deleted successfully.");
        fetchItemsAndBudgets(); // Refresh the list
      } else {
        alert("Failed to delete item. You are not authorized.");
      }
    } catch (error) {
      console.error("Error deleting item", error);
    }
  }

  async function saveItemEdits(itemId) {
    const token = Cookies.get("authToken");
    try {
      const response = await putApiWithToken(
        `https://backend-shopping-list-app-deployment.onrender.com/items/${itemId}`,
        editedItem,
        token
      );
      if (response.ok) {
        alert("Item updated successfully.");
        setEditMode(null);
        fetchItemsAndBudgets(); // Refresh the list
      } else {
        alert("Failed to update item. You are not authorized.");
      }
    } catch (error) {
      console.error("Error updating item", error);
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending";
      return { key, direction };
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = sortedItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>Dashboard</h1>

        {!budget && (
          <>
            <h2>Create Budget</h2>
            <BudgetForm
              onSuccess={() => {
                fetchItemsAndBudgets();
              }}
            />
          </>
        )}

        {budgetList.length > 1 && ( // Render ItemDetailsForm if more than one budget exists
          <>
            <h2>Create Budget</h2>
            <BudgetForm
              onSuccess={() => {
                fetchItemsAndBudgets();
              }}
            />

            <h2 style={{ marginTop: "1rem" }}>Create Item</h2>
            <ItemDetailsForm onSuccess={fetchItemsAndBudgets} />

            <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {alertMessage && <p style={{ color: "red" }}>{alertMessage}</p>}

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>
                      Name{" "}
                      {sortConfig.key === "name"
                        ? sortConfig.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => handleSort("description")}>
                      Description{" "}
                      {sortConfig.key === "description"
                        ? sortConfig.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => handleSort("quantity")}>
                      Quantity{" "}
                      {sortConfig.key === "quantity"
                        ? sortConfig.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => handleSort("price_each")}>
                      Price Each (RM){" "}
                      {sortConfig.key === "price_each"
                        ? sortConfig.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th>Price Total (RM)</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {editMode === item.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editedItem.name || item.name}
                            onChange={handleEditChange}
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>
                        {editMode === item.id ? (
                          <input
                            type="text"
                            name="description"
                            value={editedItem.description || item.description}
                            onChange={handleEditChange}
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td>
                        {editMode === item.id ? (
                          <input
                            type="number"
                            name="quantity"
                            value={editedItem.quantity || item.quantity}
                            onChange={handleEditChange}
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td>
                        {editMode === item.id ? (
                          <input
                            type="number"
                            name="price_each"
                            value={editedItem.price_each || item.price_each}
                            onChange={handleEditChange}
                          />
                        ) : (
                          `RM ${
                            item.price_each ? item.price_each.toFixed(2) : "N/A"
                          }`
                        )}
                      </td>
                      <td>
                        RM{" "}
                        {item.quantity && item.price_each
                          ? (item.quantity * item.price_each).toFixed(2)
                          : "N/A"}
                      </td>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {editMode === item.id ? (
                          <button onClick={() => saveItemEdits(item.id)}>
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditMode(item.id);
                              setEditedItem(item);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => deleteItem(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
