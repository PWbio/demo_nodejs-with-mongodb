import { useState } from "react";
import AddingBox from "./components/AddingBox";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";
import MuiTable from "./components/MuiTable";
import LineLogin from "./components/LineLogin";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Fail from "./components/Fail";

const App = () => {
  // Trigger POST -> then GET newest data
  const [refresh, setRefresh] = useState(true);
  return (
    <>
      <Header />
      <div style={{ margin: "1rem" }}>
        <Router>
          <Switch>
            <Route exact path="/">
              <LineLogin />
            </Route>
            <Route path="/home">
              <AddingBox setRefresh={setRefresh} />
              <Divider variant="middle" />
              <MuiTable refresh={refresh} setRefresh={setRefresh} />
            </Route>
            <Route path="/login/failed">
              <Fail />
            </Route>
          </Switch>
        </Router>
      </div>
    </>
  );
};

export default App;

// POST: upload multiple entries, if one entries have error property and value. Raise Warning. Status Code 207?

// delete (method2: append id in URL, url-encodeded)

// performance optimize:
// virtualize table & pagination

// input validatoin
// between server <-> db, using mongoose

// security:
// https://
