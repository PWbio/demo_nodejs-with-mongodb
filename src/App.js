import AddingBox from "./components/AddingBox";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";
import MuiTable from "./components/MuiTable";

const App = () => {
  return (
    <>
      <Header />
      <div style={{ margin: "1rem" }}>
        <AddingBox />
        <Divider variant="middle" />
        <MuiTable />
      </div>
    </>
  );
};

export default App;

// POST (new data) -> GET (new data)

// constrait API, restrict input fields
// batch delete??
