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
import ComponentService from '../../../shared/services/componentService';
import CategoryInput from '../CategoryInput';
import ComponentInput from '../ComponentInput';
import { selectTopDrawer } from '../../../shared/utils/selectors';

const TreatmentDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Get treatmentId from the Redux slice
  const { drawerData } = useSelector(selectTopDrawer);
  const treatmentId = drawerData?.treatmentId || null;

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const treatmentService = new TreatmentService(token, 'demo_db');
  const componentService = new ComponentService(token, 'demo_db');

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [components, setComponents] = useState<{ id: string; componentName: string; unitPrice: number; componentUnits: number; }[]>([
    { id: '', componentName: '', unitPrice: 0, componentUnits: 1 },
  ]);
  const [allComponents, setAllComponents] = useState<any[]>([]);
  const [color, setColor] = useState('#FF5733');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);


  // Fetch data when the drawer is opened
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTreatment, fetchedComponents] = await Promise.all([
          treatmentId ? treatmentService.getTreatmentById(treatmentId) : Promise.resolve(null),
          componentService.getAllComponents(),
        ]);

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
          })) || [{ id: '', componentName: '', unitPrice: 0, componentUnits: 1 }];

          setComponents(loadedComponents);
        } else {
          resetForm();
        }

        setAllComponents(fetchedComponents);
      } catch (error) {
        console.error('Error fetching treatment data:', error);
      }
    };

    fetchData();
  }, [treatmentId]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice(0);
    setDuration(0);
    setDescription('');
    setColor('#FF5733');
    setComponents([{ id: '', componentName: '', unitPrice: 0, componentUnits: 1 }]);
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleSubmit = async () => {
    const treatmentData = {
      name,
      category,
      description,
      price,
      duration,
      color,
      componentIds: components.map((comp) => comp.id),
      componentUnits: components.map((comp) => comp.componentUnits),
    };

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

  const handleComponentChange = (index: number, field: string, value: string | number) => {
    setComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value,
      };
      return updatedComponents;
    });
  };

  
  const handleRemoveField = (index: number) => {
    setComponents((prevComponents) => prevComponents.filter((_, i) => i !== index));
  };

  
  const handleInputFocus = (index: number) => {
    setCurrentIndex(index);
  };

  
  const handleComponentSelect = (selectedComponent: any, index: number) => {
    setComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];
      updatedComponents[index] = {
        id: selectedComponent.id,
        componentName: selectedComponent.componentName || '',
        unitPrice: selectedComponent.unitPrice || 0,
        componentUnits: 1, // Default value
      };
      return updatedComponents;
    });
  
    // Clear the current index after selection
    setCurrentIndex(null);
  };
  

  return (
    <Box>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">{treatmentId ? 'Edit Treatment' : 'Create Treatment'}</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <label>Treatment Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
        />

        <label>Category:</label>
        <CategoryInput value={category} onChange={setCategory} clinicDbName={'demo_db'}/>

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
        />

        <label>Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
        />

        {/* Color Picker */}
        <label>Color:</label>
        <Button onClick={(e) => setAnchorEl(e.currentTarget)} style={{ backgroundColor: color, color: '#fff', width: '100%' }}>
          {color}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <ChromePicker color={color} onChange={handleColorChange} />
        </Menu>

        <Typography variant="subtitle1" marginTop={2}>
          Components
        </Typography>
        {components.map((component, index) => (
          <ComponentInput
            key={index}
            component={component}
            allComponents={allComponents}
            index={index}
            onComponentChange={handleComponentChange}
            onRemove={() => handleRemoveField(index)}
            onInputFocus={handleInputFocus}
            onComponentSelect={handleComponentSelect}
            currentIndex={currentIndex}
          />
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton onClick={() => setComponents([...components, { id: '', componentName: '', unitPrice: 0, componentUnits: 1 }])}>
            <Add />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'right' }}>
        <Button variant="outlined" onClick={() => dispatch(closeDrawer())} style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {treatmentId ? 'Save Changes' : 'Create Treatment'}
        </Button>
      </Box>
    </Box>
  );
};

export default TreatmentDrawer;
