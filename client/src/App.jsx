import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import MeetRoom from "./pages/meetRoom.jsx";
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/meetRoom/:code" element={<MeetRoom/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App;
