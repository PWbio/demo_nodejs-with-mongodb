import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Shop = ({ name, contact, address, phone }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {address}
        </Typography>
        <Typography variant="body1">{contact}</Typography>
        <Typography variant="body2">{phone}</Typography>
      </CardContent>
    </Card>
  );
};

export default Shop;
