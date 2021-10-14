import { useState } from "react";
import AddingBox from "./components/AddingBox";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";
import MuiTable from "./components/MuiTable";

const App = () => {
  const [refresh, setRefresh] = useState(true);
  return (
    <>
      <Header />
      <div style={{ margin: "1rem" }}>
        <AddingBox setRefresh={setRefresh} />
        <Divider variant="middle" />
        <MuiTable refresh={refresh} />
      </div>
    </>
  );
};

export default App;

// POST (new data) -> GET (new data)
// POST: upload multiple entries, if one entries have error property and value. Raise Warning. Status Code 207?

// constrait API, restrict input fields
// batch delete??
// delete (method2: append id in URL, url-encodeded)

// performance optimize:
// virtualize table
