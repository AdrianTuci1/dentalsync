import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../drawerSlice';
import { Component } from '@/features/clinic/types/componentType';
import { selectTopDrawer } from '@/shared/utils/selectors';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import { createComponent, updateComponent } from '@/api/slices/stockSlice';

import styles from "./StockDrawer.module.scss";


export const StockDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const db = getSubdomain() + "_db";

  const { drawerData } = useSelector(selectTopDrawer);
  const stock = drawerData?.stock || null;

  const [newStock, setNewStock] = useState<Partial<Component>>({
    componentName: "",
    unitPrice: 0,
    vendor: "",
    quantity: 0,
  });

  /** ✅ Prefill form when opening the drawer */
  useEffect(() => {
    if (stock) {
      setNewStock(stock);
    } else {
      setNewStock({
        componentName: "",
        unitPrice: 0,
        vendor: "",
        quantity: 0,
      });
    }
  }, [stock]);

  /** ✅ Handle input change */
  const handleNewStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: name === "quantity" || name === "unitPrice" ? parseFloat(value) || 0 : value,
    }));
  };

  /** ✅ Check if stock is modified */
  const isModified = () => {
    if (!stock) return true; // Always proceed for new stocks
    return (
      stock.componentName !== newStock.componentName ||
      stock.unitPrice !== newStock.unitPrice ||
      stock.vendor !== newStock.vendor ||
      stock.quantity !== newStock.quantity
    );
  };
  const handleSave = async () => {
    if (!isModified()) {
      console.log("ℹ️ No changes detected. Skipping save.");
      return;
    }

    const savedStock: Component = {
      id: newStock.id || "", // Ensure ID is present for updates
      componentName: newStock.componentName || "",
      unitPrice: newStock.unitPrice || 0,
      vendor: newStock.vendor || "",
      quantity: newStock.quantity || 0,
      createdAt: newStock.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (stock) {
      // ✅ Update existing stock
      dispatch(updateComponent({ id: savedStock.id, component: savedStock, token, clinicDb: db }) as any);
    } else {
      // ✅ Create new stock
      dispatch(createComponent({ component: savedStock, token, clinicDb: db }) as any);
    }

    dispatch(closeDrawer());
  };


  /** ✅ Handle Drawer Close */
  const handleClose = () => {
    if (stock && isModified()) {
      handleSave();
    }
    dispatch(closeDrawer());
  };

  return (
    <Drawer anchor="right" open={true} onClose={handleClose}>
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <Typography variant="h6">{stock ? "Edit Stock" : "Add New Stock"}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Form Inputs */}
        <div className={styles.form}>
          <label className={styles.inputGroup}>
            <Typography variant="body2">Component Name</Typography>
            <input
              name="componentName"
              value={newStock.componentName || ""}
              onChange={handleNewStockChange}
              className={styles.input}
            />
          </label>

          <label className={styles.inputGroup}>
            <Typography variant="body2">Unit Price</Typography>
            <input
              name="unitPrice"
              type="number"
              value={newStock.unitPrice?.toString() || "0"}
              onChange={handleNewStockChange}
              className={styles.input}
            />
          </label>

          <label className={styles.inputGroup}>
            <Typography variant="body2">Vendor</Typography>
            <input
              name="vendor"
              value={newStock.vendor || ""}
              onChange={handleNewStockChange}
              className={styles.input}
            />
          </label>

          <label className={styles.inputGroup}>
            <Typography variant="body2">Quantity</Typography>
            <input
              name="quantity"
              type="number"
              value={newStock.quantity?.toString() || "0"}
              onChange={handleNewStockChange}
              className={styles.input}
            />
          </label>
        </div>

        {/* Save Button */}
        {!stock && (
          <div className={styles.footer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={
                !newStock.componentName || !newStock.vendor || newStock.quantity === 0 || newStock.unitPrice === 0
              }
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default StockDrawer;
