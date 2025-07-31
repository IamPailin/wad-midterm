import { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Divider,
} from "@mui/material";

import QuotationTable from "./QuotationTable";
import prefillData from "./prefills.json";
import "./App.css";

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 },
];

function App() {
  const didInit = useRef(false);
  const itemRef = useRef();
  const ppuRef = useRef();
  const qtyRef = useRef();
  const discountRef = useRef();

  const [dataItems, setDataItems] = useState([]);
  const [ppu, setPpu] = useState(products[0].price);
  const [selectedCode, setSelectedCode] = useState(products[0].code);
  const [discount, setDiscount] = useState(0);

  const mergeItem = (newItem) => {
    const existingIndex = dataItems.findIndex(
      (v) => v.item === newItem.item && v.ppu === newItem.ppu
    );

    if (existingIndex !== -1) {
      const updatedItems = [...dataItems];
      updatedItems[existingIndex].qty += newItem.qty;
      updatedItems[existingIndex].discount = Math.round(
        (updatedItems[existingIndex].discount *
          updatedItems[existingIndex].qty +
          newItem.discount * newItem.qty) /
          (updatedItems[existingIndex].qty + newItem.qty)
      );

      setDataItems(updatedItems);
    } else {
      setDataItems((prev) => [...prev, newItem]);
    }
  };

  const addItem = () => {
    const item = products.find((v) => itemRef.current.value === v.code);

    const newItem = {
      item: item.name,
      ppu: Number(ppuRef.current.value),
      qty: Number(qtyRef.current.value),
      discount: Number(discountRef.current.value),
    };

    mergeItem(newItem);
  };

  const deleteByIndex = (index) => {
    const newDataItems = [...dataItems];
    newDataItems.splice(index, 1);
    setDataItems(newDataItems);
  };

  const clearItems = () => {
    setDataItems([]);
  };

  const productChange = (event) => {
    const code = event.target.value;
    const product = products.find((v) => v.code === code);
    setSelectedCode(code);
    setPpu(product.price);
  };

  useEffect(() => {
    if (didInit.current) return; //to skip second call
    didInit.current = true;

    const merged = [];

    prefillData.forEach((item) => {
      const existingIndex = merged.findIndex(
        (v) =>
          v.item === item.item &&
          v.ppu === item.ppu &&
          v.discount === item.discount
      );

      if (existingIndex !== -1) {
        // Calculate total qty before adding new qty (for weighted avg)
        const totalQty = merged[existingIndex].qty + item.qty;

        merged[existingIndex].discount =
          (merged[existingIndex].discount * merged[existingIndex].qty +
            item.discount * item.qty) /
          totalQty;

        merged[existingIndex].qty = totalQty;
      } else {
        merged.push({ ...item });
      }
    });

    setDataItems(merged);
  }, []);

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#e4e4e4",
              p: 2,
              borderRadius: 2,
            }}
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="product-select-label">Item</InputLabel>
              <Select
                labelId="product-select-label"
                value={selectedCode}
                label="Item"
                inputRef={itemRef}
                onChange={productChange}
              >
                {products.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Price Per Unit"
              type="number"
              fullWidth
              margin="normal"
              inputRef={ppuRef}
              value={ppu}
              onChange={(e) => setPpu(Number(e.target.value))}
            />

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              inputRef={qtyRef}
              defaultValue={1}
            />

            <TextField
              label="Discount"
              type="number"
              fullWidth
              margin="normal"
              inputRef={discountRef}
              value={discount === null ? "" : discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addItem}
            >
              Add
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <QuotationTable
            data={dataItems}
            deleteByIndex={deleteByIndex}
            clearItems={clearItems}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
