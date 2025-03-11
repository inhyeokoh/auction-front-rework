import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./routes/route-config.jsx";

const App = () => {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
