import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import Tables from "./components/Tables";
import "./App.css";
// import Tables from "./components/Tables";

function App() {
  return (
    <PrimeReactProvider>
      <h1 className="text-3xl font-bold underline text-center">Data Table</h1>

      {/* <Button label="Check" icon="pi pi-check"></Button> */}

      <Tables />
    </PrimeReactProvider>
  );
}

export default App;
