const API_URL = "/api/keywords";

const keywordForm = document.getElementById("keywordForm");
const keywordInput = document.getElementById("keywordInput");
const channelIdInput = document.getElementById("channelIdInput");  // Define the input for channelId
const keywordList = document.getElementById("keywordList");
const themeToggle = document.getElementById("themeToggle");

// Toggle Dark Theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Fetch and display keywords
async function fetchKeywords() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const keywords = await response.json();
      keywordList.innerHTML = "";
      keywords.forEach((keyword) => {
        const li = document.createElement("li");
        li.innerHTML = `${keyword.text}&nbsp;&nbsp;&nbsp;&nbsp;${keyword.alertCount}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "DELETE";
        deleteButton.classList.add("remove-btn");
        deleteButton.onclick = () => deleteKeyword(keyword._id);

        li.appendChild(deleteButton);
        keywordList.appendChild(li);
      });
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    console.error(`Error fetching keywords: ${err.message}`);
  }
}

// Add a new keyword
async function addKeyword(event) {
  event.preventDefault();

  const channelId = channelIdInput.value.trim();  // Get channelId from the input
  const text = keywordInput.value.trim();

  // Ensure both Channel ID and Keyword are provided
  if (!channelId || !text) {
    return alert("Please enter both Channel ID and Keyword!");
  }

  const submitButton = keywordForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId, text }), // Send both channelId and text
    });

    if (response.status === 201) {
      // Clear input fields after successful addition
      channelIdInput.value = '';
      keywordInput.value = '';
      fetchKeywords(); // Reload keywords
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  } catch (err) {
    console.error('Error adding keyword:', err.message);
  } finally {
    submitButton.disabled = false;
  }
}

// Delete a keyword
async function deleteKeyword(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });  // Corrected URL format
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    fetchKeywords();
  } catch (err) {
    console.error(`Error deleting keyword: ${err.message}`);
  }
}

// Initial fetch
fetchKeywords();

// Event listener for adding a keyword
keywordForm.addEventListener("submit", addKeyword);
