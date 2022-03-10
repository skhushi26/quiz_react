import logo from "./logo.svg";
import "./App.css";
import Registration from "./components/Registration";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routing from "./routing/Routing";
import AppContextProvider from "./contexts/appContext";
import Logout from "./utils/Logout";

function App() {
  return (
    <AppContextProvider>
      <div className="content d-flex justify-content-between mb-3 p-4">
        <h1>Quiz</h1>
        <Logout />
      </div>

      <Router>
        <Routing />
      </Router>
    </AppContextProvider>
  );
}

export default App;
