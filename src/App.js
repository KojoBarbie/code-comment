import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Comment from "./components/Comment";

function App() {
  return (
  <Router>
    <Header />
    <Routes>
          <Route path="/" element={<Comment />} />
        </Routes>
  </Router>);
}

export default App;
