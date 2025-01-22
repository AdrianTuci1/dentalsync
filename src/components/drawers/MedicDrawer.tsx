import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { AccessTimeOutlined, AdminPanelSettingsOutlined, Close as CloseIcon, EditCalendar, InfoOutlined, MedicalServices } from '@mui/icons-material';
import WorkingHoursStep from './addMedic/WorkingHoursStep';
import DaysOffStep from './addMedic/DaysOffStep';
import PermissionsStep from './addMedic/PermissionsStep';
import InfoTab from './addMedic/StaffInfoStep';
import TreatmentAccordion from './addMedic/TreatmentAccordion';
import MedicService from '@/api/medicService';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../drawerSlice';

import {
  MedicInfo,
  ApiMedicData,
  ApiWorkingDayHour,
} from '@/features/clinic/types/Medic';

import styles from '@styles-cl/drawers/MedicDrawer.module.scss'
import { selectTopDrawer } from '@/shared/utils/selectors';
import eventEmitter from '@/shared/utils/events';
import { getSubdomain } from '@/shared/utils/getSubdomains';


const transformMedicInfoToTableFormat = (medicInfo: any) => {


  // Explicitly type dayAbbreviations
  const dayAbbreviations: Record<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun", string> = {
    Mon: "M",
    Tue: "T",
    Wed: "W",
    Thu: "T",
    Fri: "F",
    Sat: "S",
    Sun: "S",
  };

  // Initialize all days in order with empty strings by default
  const weekDaysOrder: Array<keyof typeof dayAbbreviations> = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const transformedWorkingDays = weekDaysOrder.map((day) => {
    const hours = medicInfo.workingHours?.[day]?.trim();
    return hours ? dayAbbreviations[day] : ""; // Add abbreviation if hours exist, otherwise empty string
  });

  const transformedData = {
    id: medicInfo.id,
    name: medicInfo.name || medicInfo.info?.name || "Unknown",
    specialty: medicInfo.specialization || medicInfo.info?.specialization || "Unknown",
    contact: medicInfo.phone || medicInfo.info?.phone || "No contact",
    email: medicInfo.email || medicInfo.info?.email || "No email",
    workingDays: transformedWorkingDays, // Transformed array of working days
    type: medicInfo.info.employmentType === "full-time" ? "FULL-TIME" : "PART-TIME",
  };

  return transformedData;
};

const MedicDrawer: React.FC = () => {
    const dispatch = useDispatch();
    const { drawerData, isOpen } = useSelector(selectTopDrawer);
    const medicId = drawerData?.medicId || null;
  
    const [activeTab, setActiveTab] = useState<string>("info");
    const [medicInfo, setMedicInfo] = useState<MedicInfo>({
      id: undefined,
      info: {
        name: "",
        email: "",
        employmentType: "",
        specialization: "",
        phone: "",
        address: "",
        photo: "",
      },
      assignedServices: {
        assignedTreatments: [],
      },
      workingHours: {},
      daysOff: [],
      permissions: [],
    });
  
    const token = useSelector((state: any) => state.auth.subaccountToken);
    const db = getSubdomain() + '_db'
    const medicService = new MedicService(token, db);
  
    // Fetch or reset medic details on medicId change
    useEffect(() => {
      const fetchMedic = async () => {
        if (medicId) {
          try {
            const data: ApiMedicData = await medicService.viewMedic(medicId);
            setMedicInfo({
              id: data.id.toString(),
              info: {
                name: data.name || "",
                email: data.email || "",
                employmentType: data.medicProfile.employmentType || "",
                specialization: data.medicProfile.specialization || "",
                phone: data.medicProfile.phone || "",
                address: data.medicProfile.address || "",
                photo: data.photo || "",
              },
              assignedServices: {
                assignedTreatments: data.medicProfile.assignedTreatments || [],
              },
              workingHours: data.medicProfile.workingDaysHours.reduce(
                (acc: { [day: string]: string }, curr: ApiWorkingDayHour) => {
                  acc[curr.day] = `${curr.startTime}-${curr.endTime}`;
                  return acc;
                },
                {}
              ),
              daysOff: data.medicProfile.daysOff || [],
              permissions: data.permissions || [],
            });
          } catch (error) {
            console.error("Error fetching medic:", error);
          }
        } else {
          resetMedicInfo();
        }
      };
  
      fetchMedic();
    }, [medicId]);

    
  
    const resetMedicInfo = () => {
      setMedicInfo({
        id: undefined,
        info: {
          name: "",
          email: "",
          employmentType: "",
          specialization: "",
          phone: "",
          address: "",
          photo: "",
        },
        assignedServices: {
          assignedTreatments: [],
        },
        workingHours: {},
        daysOff: [],
        permissions: [],
      });
    };
  
    const handleChange = (field: string, value: any) => {
      setMedicInfo((prevInfo) => ({
        ...prevInfo,
        [field]: value,
      }));
    };
  
    const handleSubmit = async () => {
      try {
        if (medicInfo.id) {
          await medicService.updateMedic(medicInfo.id, medicInfo);
          eventEmitter.emit("medicUpdated", transformMedicInfoToTableFormat(medicInfo));
          console.log(medicInfo)
        } else {
          const newMedic = await medicService.createMedic(medicInfo);
          eventEmitter.emit("medicCreated", transformMedicInfoToTableFormat(newMedic));
        }
        dispatch(closeDrawer());
      } catch (error) {
        console.error("Error saving medic:", error);
      }
    };


  const tabs = [
    { key: 'info', icon: <InfoOutlined />, component: <InfoTab info={medicInfo.info} onInfoChange={(field, value) => handleChange('info', { ...medicInfo.info, [field]: value })} /> },
    { key: 'services', icon: <MedicalServices />, component: <TreatmentAccordion assignedTreatments={medicInfo.assignedServices.assignedTreatments} onServiceChange={(updatedServices) => handleChange('assignedServices', { assignedTreatments: updatedServices })} /> },
    { key: 'workingHours', icon: <AccessTimeOutlined />, component: <WorkingHoursStep workingHours={medicInfo.workingHours} onWorkingHoursChange={(day, hours) => handleChange('workingHours', { ...medicInfo.workingHours, [day]: hours })} /> },
    { key: 'daysOff', icon: <EditCalendar />, component: <DaysOffStep daysOff={medicInfo.daysOff} onDaysOffChange={(updatedDaysOff) => handleChange('daysOff', updatedDaysOff)} /> },
    { key: 'permissions', icon: <AdminPanelSettingsOutlined />, component: <PermissionsStep permissions={medicInfo.permissions} onPermissionsChange={(updatedPermissions) => handleChange('permissions', updatedPermissions)} /> },
  ];
  


  return (
    <Drawer anchor="right" open={isOpen} onClose={() => dispatch(closeDrawer())}>
      <Box className={styles.drawerContainer}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{medicId ? 'Edit Medic' : 'Add Medic'}</Typography>
          <IconButton edge="end" onClick={() => dispatch(closeDrawer())}>
            <CloseIcon />
          </IconButton>
        </Box>

                <div className={styles.tabRow}>
                  {tabs.map((tab) => (
                    <div
                      key={tab.key}
                      className={`${styles.tabItem} ${
                        activeTab === tab.key ? styles.activeTabItem : ''
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.icon}
                    </div>
                  ))}
                </div>


        <Box className={styles.tabContent}>
          {tabs.find((tab) => tab.key === activeTab)?.component}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MedicDrawer;
