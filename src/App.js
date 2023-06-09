import './App.css';
import Home from "./Home"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <Home/>
    </div>
    </LocalizationProvider>
  );
}

export default App;
