import Dropdown from "../components/Dropdown";
import Header from "../components/Header";

function Home() {
    return (
        <div className="App">
            {/* Header */}
            < Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Dropdown />
            </div>
        </div>
    );
}

export { Home };
