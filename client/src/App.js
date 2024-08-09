import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import { CreateRecipe } from "./pages/create-recipe";
import { SavedRecipes } from "./pages/saved-recipes";
import { Navbar } from './component/Navbar';
import { useState } from 'react';

function App() {
  const [formType, setFormType] = useState("Register");

  return (
    <div className="App">
      <Router>
        <Navbar formType={formType} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth setFormType={setFormType} />} />
          <Route path='/saved-recipes' element={<SavedRecipes />} />
          <Route path='/create-recipe' element={<CreateRecipe />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

