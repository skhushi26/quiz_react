import logo from "./logo.svg";
import "./App.css";
import Registration from "./components/Registration";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./routing/Routing";
import AppContextProvider from "./contexts/appContext";

function App() {
  return (
    <>
      <AppContextProvider>
        <h1>Quiz</h1>
        <Router>
          <Routing />
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;
