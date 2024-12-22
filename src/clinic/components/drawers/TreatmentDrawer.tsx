import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../../shared/services/drawerSlice';
import TreatmentService from '../../../shared/services/treatmentService';
import CategoryInput from '../CategoryInput';
import ComponentInput from '../ComponentInput';
import { selectTopDrawer } from '../../../shared/utils/selectors';

const TreatmentDrawer: React.FC = () => {
    // Redux and services
    const dispatch = useDispatch();
    const { drawerData } = useSelector(selectTopDrawer); // Get treatment data from Redux
    const treatmentId = drawerData?.treatmentId || null; // Current treatment ID
    const token = useSelector((state: any) => state.auth.subaccountToken); // Authentication token

    // Initialize services
    const treatmentService = new TreatmentService(token, 'demo_db');


      // Treatment details state
      const [name, setName] = useState<string>(''); // Treatment name
      const [category, setCategory] = useState<string>(''); // Treatment category
      const [price, setPrice] = useState<number>(0); // Treatment price
      const [duration, setDuration] = useState<number>(0); // Treatment duration in minutes
      const [description, setDescription] = useState<string>(''); // Treatment description
      const [color, setColor] = useState<string>('#FF5733'); // Treatment color

      // Components state
      const [components, setComponents] = useState<
        { id: string; componentName: string; unitPrice: number; componentUnits: number }[]
      >([]); // Selected components for the treatment

      // UI state
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Anchor for color picker menu
      const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Current focused component index

      // Fetch treatment data when the component mounts or treatmentId changes
      useEffect(() => {
        const fetchData = async () => {
          try {
            const fetchedTreatment = treatmentId
              ? await treatmentService.getTreatmentById(treatmentId)
              : null;

            if (fetchedTreatment) {
              setName(fetchedTreatment.name || '');
              setCategory(fetchedTreatment.category || '');
              setPrice(fetchedTreatment.price || 0);
              setDuration(fetchedTreatment.duration || 0);
              setDescription(fetchedTreatment.description || '');
              setColor(fetchedTreatment.color || '#FF5733');

              const loadedComponents = fetchedTreatment.components?.map((component: any) => ({
                id: component.id,
                componentName: component.componentName || '',
                unitPrice: component.unitPrice || 0,
                componentUnits: component.componentUnits || 1,
              })) || [];

              setComponents(loadedComponents);
            } else {
              resetForm();
            }
          } catch (error) {
            console.error('Error fetching treatment data:', error);
          }
        };

        fetchData();
      }, [treatmentId]);


      const handleSubmit = async () => {
        const treatmentData = {
          // Include treatmentId for updates, omit it for creation
          ...(treatmentId && { id: treatmentId }), // Add treatmentId only if it exists
          category,
          color,
          components: components.map((component) => ({
            id: component.id,
            componentName: component.componentName,
            unitPrice: component.unitPrice,
            componentUnits: component.componentUnits,
          })), // Map components to ensure correct structure
          description,
          duration,
          name,
          price,
        };
      
        console.log(treatmentData)
        
        try {
          if (treatmentId) {
            await treatmentService.updateTreatment(treatmentId, treatmentData);
          } else {
            await treatmentService.createTreatment(treatmentData);
          }
          dispatch(closeDrawer());
        } catch (error) {
          console.error('Error saving treatment:', error);
        }
      };
      

    // Reset the form to default values
    const resetForm = () => {
      setName('');
      setCategory('');
      setPrice(0);
      setDuration(0);
      setDescription('');
      setColor('#FF5733');
      setComponents([]);
    };

// Update a component's value in the components state
const handleComponentChange = (index: number, field: string, value: string | number) => {
  setComponents((prev) => {
    const updatedComponents = [...prev];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    return updatedComponents;
  });
};

// Remove a component from the components state
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

// Handle color picker focus
const handleColorChange = (newColor: any) => {
  setColor(newColor.hex);
};

const handleInputFocus = (index: number) => {
  setCurrentIndex(index);
};


  return (
    <>
<Box>
  {/* Header */}
  <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
    <Typography variant="h6">{treatmentId ? 'Edit Treatment' : 'Create Treatment'}</Typography>
  </Box>

  {/* Form Content */}
  <Box sx={{ p: 2 }}>
    {/* Treatment Name */}
    <label>Treatment Name:</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
    />

    {/* Category */}
    <label>Category:</label>
    <CategoryInput value={category} onChange={setCategory} clinicDbName={'demo_db'} />

    {/* Price */}
    <label>Price:</label>
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(parseFloat(e.target.value))}
      style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
    />

    {/* Duration */}
    <label>Duration (minutes):</label>
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(parseInt(e.target.value, 10))}
      style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
    />

    {/* Description */}
    <label>Description:</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={3}
      style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
    />

    {/* Color Picker */}
    <label>Color:</label>
    <Button
      onClick={(e) => setAnchorEl(e.currentTarget)}
      style={{ backgroundColor: color, color: '#fff', width: '100%' }}
    >
      {color}
    </Button>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
      <ChromePicker color={color} onChange={handleColorChange} />
    </Menu>

    {/* Components Section */}
    <Typography variant="subtitle1" marginTop={2}>
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
    <Box display="flex" justifyContent="center" mt={2}>
      <IconButton
        onClick={() =>
          setComponents([...components, { id: '', componentName: '', unitPrice: 0, componentUnits: 1 }])
        }
      >
        <Add />
      </IconButton>
    </Box>
  </Box>

  {/* Footer Buttons */}
  <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'right' }}>
    <Button variant="outlined" onClick={() => dispatch(closeDrawer())} style={{ marginRight: '10px' }}>
      Cancel
    </Button>
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      {treatmentId ? 'Save Changes' : 'Create Treatment'}
    </Button>
  </Box>
</Box>
</>
)};

export default TreatmentDrawer;
