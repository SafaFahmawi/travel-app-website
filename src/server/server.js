import app from "./app.js"; // Use ES module import

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
