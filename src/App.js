import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./routing/Routing";
import AppContextProvider from "./contexts/appContext";
import Logout from "./utils/Logout";
import Loader from "./components/commons/Loader";

function App() {
  return (
    <AppContextProvider>
      <Loader />
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
