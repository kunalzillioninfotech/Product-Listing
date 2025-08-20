import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DateRangePicker,
  DateRange,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface Product {
  _id: string;
  name: string;
  price: number;
  availableDate: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    availableDate: '',
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:8000/api/products";

      if (dateRange[0] && dateRange[1]) {
        const start = dayjs(dateRange[0]).format("YYYY-MM-DD");
        const end = dayjs(dateRange[1]).format("YYYY-MM-DD");
        url += `?start=${start}&end=${end}`;
      }

      const res = await axios.get(url);
      setProducts(res.data);
      setPage(0);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };
  console.log("Products fetched:", products);
  

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, [dateRange]);

  const handleReset = () => {
    setDateRange([null, null]);
  };

  const handleAdd = async () => {
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        availableDate: newProduct.availableDate,
      };
  
      if (editingProductId) {
        await axios.put(`http://localhost:8000/api/products/${editingProductId}`, productData);
        alert("Product updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/products", productData);
        alert("Product added successfully!");
      }
  
      setNewProduct({ name: "", price: "", availableDate: "" });
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));    
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setNewProduct({
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        availableDate: dayjs(productToEdit.availableDate).format("YYYY-MM-DD"),
      });
      setEditingProductId(productToEdit._id);
    }
  };  

  return (
    <Box p={4}>
      <Typography variant="h4" textAlign={"center"} mb={2} gutterBottom>
        Product List with Date Filter
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={5}>
        <TextField
          label="Product Name"
          variant="outlined"
          size="small"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <TextField
          label="Price"
          type="number"
          variant="outlined"
          size="small"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <TextField
          type="date"
          variant="outlined"
          size="small"
          value={newProduct.availableDate}
          onChange={(e) =>
            setNewProduct({ ...newProduct, availableDate: e.target.value })
          }
        />

        <Button sx={{ ml: 1 }} variant="contained" onClick={handleAdd}>
            {editingProductId ? "Update" : "Add"}
        </Button>
      </Box>

      <Box display="flex" justifyContent="end" mt={5}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            value={dateRange}
            onChange={(newValue: DateRange<Dayjs>) => setDateRange(newValue)}
            calendars={1}
            slotProps={{
              textField: () => ({
                variant: "outlined",
                size: "small",
                sx: { mx: 1, width: 300 },
                label: "Select Date Range",
              }),
            }}
          />
        </LocalizationProvider>
        <Button sx={{ ml: 1 }} variant="outlined" onClick={handleReset}>
          <CloseIcon sx={{ mr: 1 }} />
          Clear Filter
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mt: 2, maxWidth: "100%", mx: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Price (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Available From</strong>
              </TableCell>
              <TableCell >
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  {new Date(product.availableDate).toLocaleDateString()}
                </TableCell>
                <TableCell >
                  <Box display="flex"  gap={2}>
                  <ModeEditIcon onClick={() => handleEdit(product._id)}/>
                  <DeleteIcon color="error" onClick={() => handleDelete(product._id)}/>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No products available...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 20]}
        />
      </TableContainer>
    </Box>
  );
};

export default ProductList;
