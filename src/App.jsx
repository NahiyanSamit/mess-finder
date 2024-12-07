import { Home } from "./pages/Home";
import { Mess } from "./pages/Mess";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {    
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Mess" element={<Mess />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Search" element={<Search />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
