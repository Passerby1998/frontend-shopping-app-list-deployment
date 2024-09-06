import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/Header";
import BudgetForm from "../components/BudgetForm";
import ItemDetailsForm from "../components/ItemDetailsForm";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [budgetList, setBudgetList] = useState([]);
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

      // Fetch budgets using Axios
      const budgetRes = await axios.get(
        "https://backend-shopping-list-app-deployment.onrender.com/grocerytrip",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const budgetData = budgetRes.data;
      console.log("Fetched budget data:", budgetData);

      if (Array.isArray(budgetData.data)) {
        setBudgetList(budgetData.data);
        setBudget(budgetData.data[0] || null);
      } else {
        console.error("Unexpected data structure for budgets:", budgetData);
      }

      // Fetch items using Axios
      const itemsRes = await axios.get(
        "https://backend-shopping-list-app-deployment.onrender.com/items",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const itemsData = itemsRes.data;
      console.log("Fetched items data:", itemsData);
      setItems(itemsData.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
      alert("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItemsAndBudgets();
  }, []);

  useEffect(() => {
    if (budget && items.length > 0) {
      const totalPrice = items.reduce(
        (acc, item) => acc + (item.quantity * item.price_each || 0),
        0
      );

      if (totalPrice > (budget.amount || 500)) {
        setAlertMessage("The total price of items exceeds the budget!");
      } else {
        setAlertMessage("");
      }
    }
  }, [budget, items]);

  async function deleteItem(itemId) {
    const token = Cookies.get("authToken");
    try {
      const response = await axios.delete(
        `https://backend-shopping-list-app-deployment.onrender.com/items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Check if the status code is in the success range (2xx)
      if (response.status >= 200 && response.status < 300) {
        alert("Item deleted successfully.");
        fetchItemsAndBudgets(); // Refresh the list
      } else {
        alert("Failed to delete item. You are not authorized.");
      }
    } catch (error) {
      console.error("Error deleting item", error);
      alert("Failed to delete item.");
    }
  }

  async function saveItemEdits(itemId) {
    const token = Cookies.get("authToken");
    try {
      const response = await axios.put(
        `https://backend-shopping-list-app-deployment.onrender.com/items/${itemId}`,
        editedItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Check if the status code is in the success range (2xx)
      if (response.status >= 200 && response.status < 300) {
        alert("Item updated successfully.");
        setEditMode(null);
        fetchItemsAndBudgets(); // Refresh the list
      } else {
        alert("Failed to update item. You are not authorized.");
      }
    } catch (error) {
      console.error("Error updating item", error);
      alert("Failed to update item.");
    }
  }

  async function saveItemEdits(itemId) {
    const token = Cookies.get("authToken");
    try {
      const response = await axios.put(
        `https://backend-shopping-list-app-deployment.onrender.com/items/${itemId}`,
        editedItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      alert("Failed to update item.");
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
            <BudgetForm onSuccess={fetchItemsAndBudgets} />
          </>
        )}

        {budgetList.length > 1 && (
          <>
            <h2>Create Budget</h2>
            <BudgetForm onSuccess={fetchItemsAndBudgets} />

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
