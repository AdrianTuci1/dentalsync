import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import TreatmentService from '../../services/treatmentService';
import ComponentService from '../../services/componentService';
import { ComponentWithUnits } from '../../types/treatmentType';
import { useSelector } from 'react-redux';
import CategoryInput from '../CategoryInput';
import ComponentInput from '../ComponentInput';
import { ChromePicker } from 'react-color';

interface TreatmentDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  treatmentId?: string | null;
}

const TreatmentDrawer: React.FC<TreatmentDrawerProps> = ({ isOpen, toggleDrawer, treatmentId }) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [components, setComponents] = useState<ComponentWithUnits[]>([{ id: '', componentName: '', unitPrice: 0, componentUnits: 1 }]);
  const [allComponents, setAllComponents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [color, setColor] = useState('#FF5733');  // Default color

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // For color picker menu

  const token = useSelector((state: any) => state.auth.subaccountToken);

  const treatmentService = new TreatmentService(token, 'demo_db');
  const componentService = new ComponentService(token, 'demo_db');

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        try {
          const [fetchedTreatment, fetchedComponents] = await Promise.all([
            treatmentId ? treatmentService.getTreatmentById(treatmentId) : Promise.resolve(null),
            componentService.getAllComponents(),
          ]);
  
          if (fetchedTreatment) {
            setName(fetchedTreatment.name ?? '');
            setCategory(fetchedTreatment.category ?? '');
            setPrice(fetchedTreatment.price ?? 0);
            setDuration(fetchedTreatment.duration ?? 0);
            setDescription(fetchedTreatment.description ?? '');
            setColor(fetchedTreatment.color ?? '#FF5733');
  
            // Safely access components
            const loadedComponents = fetchedTreatment.components
              ? fetchedTreatment.components.map((component: any) => ({
                  id: component.id,
                  componentName: component.componentName ?? '',
                  unitPrice: component.unitPrice ?? 0,
                  componentUnits: component.componentUnits ?? 1,
                }))
              : [{ id: '', componentName: '', unitPrice: 0, componentUnits: 1 }];
  
            setComponents(loadedComponents);
          } else {
            // Reset form fields when no treatment is fetched
            setName('');
            setCategory('');
            setPrice(0);
            setDuration(0);
            setDescription('');
            setColor('#FF5733'); // Reset color
            setComponents([{ id: '', componentName: '', unitPrice: 0, componentUnits: 1 }]);
          }
  
          setAllComponents(fetchedComponents);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, [treatmentId, isOpen]);
  
  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const handleAddField = () => {
    setComponents([...components, { id: '', componentName: '', unitPrice: 0, componentUnits: 1 }]);
  };

  const handleRemoveField = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleComponentChange = (index: number, field: string, value: string | number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value ?? '' };
    setComponents(updatedComponents);
  };

  const handleInputFocus = (index: number) => {
    setCurrentIndex(index);
  };

  const handleComponentSelect = (component: any, index: number) => {
    const updatedComponents = [...components];
    updatedComponents[index] = {
      id: component.id,
      componentName: component.componentName ?? '',
      unitPrice: component.unitPrice ?? 0,
      componentUnits: 1,
    };
    setComponents(updatedComponents);
    setCurrentIndex(null); 
  };

  const handleSubmit = async () => {
    const componentIds = components
      .filter((component) => component.id)
      .map((component) => component.id);

    const componentUnits = components
      .filter((component) => component.id)
      .map((component) => component.componentUnits);

    const treatmentData = {
      name,
      category,
      description,
      price,
      duration,
      color,
      componentIds,
      componentUnits,
    };

    try {
      if (treatmentId) {
        await treatmentService.updateTreatment(treatmentId, treatmentData);
      } else {
        await treatmentService.createTreatment(treatmentData);
      }
      toggleDrawer();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleDrawer} PaperProps={{ style: { width: 480 } }}>
      <Box height="100%" display="flex" flexDirection="column">
        <Box padding={3} borderBottom="1px solid #e0e0e0">
          <Typography variant="h6">{treatmentId ? 'Edit Treatment' : 'Create Treatment'}</Typography>
        </Box>

        <Box flex="1" overflow="auto" padding={3}>
          <label>Treatment Name:</label>
          <input
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
          />

          <label>Category:</label>
          <CategoryInput
            value={category}
            onChange={setCategory}
            clinicDbName="demo_db"
          />

          <label>Price:</label>
          <input
            type="number"
            value={price ?? 0}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
          />

          <label>Duration (minutes):</label>
          <input
            type="number"
            value={duration ?? 0}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
          />

          <label>Description:</label>
          <textarea
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
          />

          {/* Color Picker */}
          <div>
            <label>Color:</label>
            <Button
              onClick={handleColorButtonClick}
              style={{ backgroundColor: color, color: '#fff', marginBottom: '16px', width: '100%', textAlign: 'left' }}
            >
              {color}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleColorPickerClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <ChromePicker color={color} onChange={handleColorChange} />
            </Menu>
          </div>

          <Typography variant="subtitle1" marginTop={2}>
            Components
          </Typography>
          {components.map((component, index) => (
              <ComponentInput
                key={index}
                component={component}
                allComponents={allComponents}
                index={index}
                onComponentChange={(index, field, value) => handleComponentChange(index, field, value)}
                onRemove={() => handleRemoveField(index)}
                onInputFocus={handleInputFocus}
                onComponentSelect={handleComponentSelect}
                currentIndex={currentIndex}
            />
            ))}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <IconButton color="primary" onClick={handleAddField}>
              <Add />
            </IconButton>
          </Box>
        </Box>

        <Box padding={3} borderTop="1px solid #e0e0e0">
          <Button variant="outlined" onClick={toggleDrawer} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {treatmentId ? 'Save Changes' : 'Create Treatment'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TreatmentDrawer;
