import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { MyContext } from "../../App";
import { useContext } from "react";
const AddressForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: true,
    userId: "",
  });

  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const url = context.AppUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission if called from an event
    setLoading(true);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(`${url}/api/address/addAddress`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        props.onSubmit(response.data); 
        setFormData({
          address_line: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          mobile: "",
          status: true,
          userId: "",
        });
        return true; 
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  // Expose the submitForm method to the parent component
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      return handleSubmit(); // Programmatically submit the form
    },
  }));

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add Address
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Address Line"
            name="address_line"
            value={formData.address_line}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="status"
                checked={formData.status}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    status: e.target.checked,
                  }))
                }
              />
            }
            label="Status"
          />
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
});

export default AddressForm;