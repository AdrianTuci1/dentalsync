import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  IconButton,
  Menu,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '@/components/drawerSlice';

import CategoryInput from '@/components/inputs/CategoryInput';
import ComponentInput from '@/components/inputs/ComponentInput';
import { selectTopDrawer } from '@/shared/utils/selectors';
import { Treatment } from '@/features/clinic/types/treatmentType';

import isEqual from 'lodash/isEqual'; // Ensure lodash is installed
import { createTreatment, deleteTreatment, selectTreatments, updateTreatment } from '@/api/slices/treatmentSlice';
import { getSubdomain } from '@/shared/utils/getSubdomains';

import styles from "./TreatmentDrawer.module.scss";

const TreatmentDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { drawerData } = useSelector(selectTopDrawer);
  const treatments = useSelector(selectTreatments);
  const treatmentId = drawerData?.treatment?.id || null;


  // State for treatment details
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#FF5733');
  const [components, setComponents] = useState<
  { id: string; componentName: string; unitPrice: number; componentUnits: number }[]
>([]); // Selected components for the treatment
  const [originalTreatment, setOriginalTreatment] = useState<Partial<Treatment> | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Anchor for color picker menu
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Current focused component index

    const token = useSelector((state: any) => state.auth.subaccountToken);
    const clinicDb = getSubdomain() + '_db'; // Hardcoded clinicDb

  // Load treatment data when the drawer opens
  useEffect(() => {
    if (treatmentId) {
      const treatment = treatments.find((t: any) => t.id === treatmentId);
      if (treatment) {
        setName(treatment.name);
        setCategory(treatment.category || '');
        setPrice(treatment.price);
        setDuration(treatment.duration);
        setDescription(treatment.description || '');
        setColor(treatment.color || '#FF5733');
        setComponents(treatment.components || []);
        setOriginalTreatment(treatment);
      } else {
        resetForm()
        console.log('error occured')
      }
    } else {
      resetForm();
    }
  }, [treatmentId]);


  // Normalize components for comparison
  const normalizeComponents = (components: any[]) =>
    components.map((component) => ({
      id: component.id || '',
      componentName: component.componentName || '',
      unitPrice: Number(component.unitPrice || 0),
      componentUnits: Number(component.componentUnits || 1),
    }));

  // Normalize data for comparison
  const normalizeData = (data: any) => ({
    name: data.name || '',
    category: data.category || '',
    price: Number(data.price || 0),
    duration: Number(data.duration || 0),
    description: data.description || '',
    color: data.color || '#FF5733',
    components: normalizeComponents(data.components || []),
  });

  // Check if the treatment has been modified
  const isModified = () => {
    if (!originalTreatment) return false;
    const currentData = normalizeData({ name, category, price, duration, description, color, components });
    const originalData = normalizeData(originalTreatment);
    return !isEqual(currentData, originalData);
  };


  const handleSave = () => {
  
    const treatmentData = {
      id: treatmentId,
      name,
      category,
      price,
      duration,
      description,
      color,
      components: normalizeComponents(components),
    };
  
    const isModified = () => {
      if (!originalTreatment) return false;
  
      const currentData = normalizeData({
        name,
        category,
        price,
        duration,
        description,
        color,
        components,
      });
  
      const originalData = normalizeData(originalTreatment);
  
      return !isEqual(currentData, originalData);
    };
  
    try {
      if (treatmentId) {
        if (isModified()) {
          console.log('✅ Changes detected. Updating treatment...');
          dispatch(updateTreatment({ id: treatmentId, treatment: treatmentData, token, clinicDb }) as any);
        } else {
          console.log('ℹ️ No changes detected. Skipping update.');
        }
      } else {
        console.log('🆕 Creating new treatment...');
        dispatch(createTreatment({ treatment: treatmentData, token, clinicDb }) as any);
        resetForm();
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error('❌ Error submitting treatment:', error);
    }
  };


  // Reset form fields
  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice(0);
    setDuration(0);
    setDescription('');
    setColor('#FF5733');
    setComponents([]);
  };

  // Handle component field changes
  const handleComponentChange = (index: number, field: string, value: string | number) => {
    setComponents((prev) => {
      const updatedComponents = [...prev];
      updatedComponents[index] = { ...updatedComponents[index], [field]: value };
      return updatedComponents;
    });
  };

  // Remove a component
  const handleRemoveField = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

// Select a component from the dropdown and update the components state
const handleComponentSelect = (selectedComponent: any, index: number) => {
  setComponents((prev) => {
    const updatedComponents = [...prev];
    updatedComponents[index] = {
      id: selectedComponent.id,
      componentName: selectedComponent.componentName || '',
      unitPrice: selectedComponent.unitPrice || 0,
      componentUnits: 1, // Default value
    };
    return updatedComponents;
  });

  setCurrentIndex(null);
};


const handleInputFocus = (index: number) => {
  setCurrentIndex(index);
};


  // Handle color picker change
  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  // Handle drawer close
  const handleClose = async () => {
    if (treatmentId && isModified()) {
      await handleSave();
    }
    dispatch(closeDrawer());
  };
  

  const handleDelete = async () => {
    console.log(treatmentId)
      await dispatch(deleteTreatment({ id: treatmentId, token, clinicDb }) as any);
      dispatch(closeDrawer())
  }

    return (
    <div className={`${styles.drawer} ${styles.open}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3>{treatmentId ? "Edit Treatment" : "Create Treatment"}</h3>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </div>

      {/* Form */}
      <div className={styles.content}>
        <label>Treatment Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />

        <label>Category:</label>
        <CategoryInput value={category} onChange={setCategory} clinicDbName={"demo_db"} />

        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className={styles.input} />

        <label>Duration (minutes):</label>
        <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} className={styles.input} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={styles.textarea} />

        {/* Color Picker */}
        <label>Color:</label>
        <Button onClick={(e) => setAnchorEl(e.currentTarget)} className={styles.colorButton} style={{ backgroundColor: color }}>
          {color}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <ChromePicker color={color} onChange={handleColorChange} />
        </Menu>

        {/* Components Section */}
        <Typography variant="subtitle1" className={styles.sectionTitle}>
          Components
        </Typography>
        {components.map((component, index) => (
          <ComponentInput
            key={index}
            component={component}
            index={index}
            onComponentChange={handleComponentChange}
            onRemove={() => handleRemoveField(index)}
            onInputFocus={handleInputFocus}
            onComponentSelect={handleComponentSelect}
            currentIndex={currentIndex}
          />
        ))}

        {/* Add Component Button */}
        <div className={styles.addComponentButton}>
          <IconButton
            onClick={() =>
              setComponents([...components, { id: "", componentName: "", unitPrice: 0, componentUnits: 1 }])
            }
          >
            <Add />
          </IconButton>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className={styles.footer}>
        {!treatmentId && (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Treatment
          </Button>
        )}

        {treatmentId && (
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Treatment
          </Button>
        )}
      </div>
    </div>
  )};

export default TreatmentDrawer;
