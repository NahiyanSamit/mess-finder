import { Home } from "./pages/Home";
import { Mess } from "./pages/Mess";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fetchData } from "./api/api"; // Import API function

function App() {
    useEffect(() => {
        // Example of a global Axios API call (can be used for global state or logging)
        fetchData()
            .then((response) => {
                console.log("Fetched data in App:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []); // Runs only once when the app loads

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Mess/:id" element={<Mess />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Search" element={<Search />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
