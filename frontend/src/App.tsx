import { BrowserRouter, Routes, Route } from "react-router";
import SudokuSolverPage from "./pages/SudokuSolverPage";
import RegisterPage from "./pages/RegisterPage";
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<SudokuSolverPage/>}
        />

        <Route
          path="/register"
          element={<RegisterPage/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
