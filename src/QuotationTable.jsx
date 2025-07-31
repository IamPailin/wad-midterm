import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { CiShoppingCart } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import clearItems from "./App.jsx";
import style from "./mystyle.module.css";

function QuotationTable({ data, deleteByIndex, clearItems }) {
  if (!data || data.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Quotation
        </Typography>
        <Typography variant="body1">
          <CiShoppingCart /> No items
        </Typography>
      </Box>
    );
  }

  const total = data.reduce((acc, v) => acc + v.qty * v.ppu, 0);
  const totalDiscount = data.reduce((acc, v) => acc + v.discount, 0);

  const handleDelete = (index) => {
    deleteByIndex(index);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quotation
      </Typography>

      <Button
        variant="outlined"
        color="inherit"
        startIcon={<MdClear />}
        sx={{ mb: 2 }}
        onClick={clearItems}
      >
        Clear
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Price/Unit</TableCell>
              <TableCell align="center">Discount</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((v, i) => {
              const amount = v.qty * v.ppu;
              return (
                <TableRow key={i}>
                  <TableCell align="center">
                    <BsFillTrashFill
                      onClick={() => handleDelete(i)}
                      style={{ cursor: "pointer" }}
                    />
                  </TableCell>
                  <TableCell align="center">{v.qty}</TableCell>
                  <TableCell>{v.item}</TableCell>
                  <TableCell align="center">{v.ppu}</TableCell>
                  <TableCell align="center">{v.discount}</TableCell>
                  <TableCell align="right">{amount}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={4} align="right">
                <strong>Total Discount</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{totalDiscount}</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} align="right">
                <strong>Total Amount</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{total - totalDiscount}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default QuotationTable;
