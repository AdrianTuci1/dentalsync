import React, { useState, useEffect } from 'react';
import {
  AccessTimeOutlined,
  AdminPanelSettingsOutlined,
  Close as CloseIcon,
  EditCalendar,
  InfoOutlined,
  MedicalServices,
} from '@mui/icons-material';
import WorkingHoursStep from './addMedic/WorkingHoursStep';
import DaysOffStep from './addMedic/DaysOffStep';
import PermissionsStep from './addMedic/PermissionsStep';
import InfoTab from './addMedic/StaffInfoStep';
import TreatmentAccordion from './addMedic/TreatmentAccordion';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../drawerSlice';
import {
  MedicInfo,
  MedicsListItem,
} from '@/features/clinic/types/Medic';

import styles from '@/features/clinic/styles/drawers/MedicDrawer.module.scss';
import { selectTopDrawer } from '@/shared/utils/selectors';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import { createMedic, fetchMedicById, setUpdatedMedicInTable, updateMedic } from '@/api/slices/medicSlice';
import { transformMedicInfoToTableFormat } from '@/shared/utils/medicTransform';

const MedicDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { drawerData, isOpen } = useSelector(selectTopDrawer);
  const medicId = drawerData?.medicId || null;

  const [activeTab, setActiveTab] = useState<string>('info');

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  // ✅ Extract medic from Redux state (ENSURE RE-RENDER)
  const medic = useSelector((state: any) =>
    state.medics.detailedMedics.find((m: MedicInfo) => String(m.id) === String(medicId))
  );

  // ✅ Local state for form data
  const [medicInfo, setMedicInfo] = useState<MedicInfo | null>(null);

  // ✅ Fetch medic when drawer opens (only if medicId exists)
  useEffect(() => {
    if (medicId && token && clinicDb) {
      console.log(`📡 Fetching medic details for ID: ${medicId}`);
      dispatch(fetchMedicById({ id: medicId, token }) as any);
    }
  }, [medicId, dispatch, token, clinicDb]);

  // ✅ Sync local state WHEN Redux medic updates
  useEffect(() => {
    if (medicId && medic) {
      console.log("🔄 Updating local state with fetched medic:", medic);
      setMedicInfo(medic);
    }
  }, [medic]); // ✅ Runs whenever `medic` updates in Redux

  // ✅ Initialize form when creating a new medic
  useEffect(() => {
    if (!medicId) {
      console.log('📌 Initializing Empty Medic Form');
      setMedicInfo({
        id: undefined,
        info: {
          name: '',
          email: '',
          employmentType: '',
          specialization: '',
          phone: '',
          address: '',
          photo: '',
        },
        assignedServices: {
          assignedTreatments: [],
        },
        workingHours: {},
        daysOff: [],
        permissions: [],
      });
    }
  }, [medicId]);

  console.log('💡 Current medicInfo state:', medicInfo);

  // ✅ Ensure Redux Data Exists Before Rendering
  if (medicId && !medic) {
    return <div>Loading medic details...</div>;
  }

  // ✅ Prevent rendering until state is ready
  if (!medicInfo) {
    return <div>Loading medic details...</div>;
  }

    // ✅ Prevent rendering until state is ready
    if (!medicInfo.assignedServices) {
      return <div>Loading medic details...</div>;
    }

  // 📝 Handle input changes
  const handleChange = (field: keyof MedicInfo, value: any) => {
    setMedicInfo((prevInfo) =>
      prevInfo ? { ...prevInfo, [field]: value } : null
    );
  };

  // 💾 Save or update medic
  const handleSubmit = async () => {
    if (!medicInfo) return;

    try {
      let updatedMedic: MedicInfo;

      if (medicInfo.id) {
        console.log("💾 Updating existing medic:", medicInfo);
        await dispatch(updateMedic({ id: medicInfo.id, medic: medicInfo, token }) as any);
        updatedMedic = medicInfo; // Redux will update this eventually
      } else {
        console.log("➕ Creating new medic:", medicInfo);
        await dispatch(createMedic({ medic: medicInfo, token }) as any);
        updatedMedic = medicInfo;
      }

      // ✅ Transform the updated medic data to match the table format
      const updatedTableFormat: MedicsListItem = transformMedicInfoToTableFormat(updatedMedic);

      // ✅ Update only the Redux table state
      dispatch(setUpdatedMedicInTable(updatedTableFormat));

      dispatch(closeDrawer());
    } catch (error) {
      console.error('❌ Error saving medic:', error);
    }
  };

  const tabs = [
    {
      key: 'info',
      icon: <InfoOutlined />,
      component: (
        <InfoTab
          info={medicInfo.info}
          onInfoChange={(field, value) =>
            handleChange('info', { ...medicInfo.info, [field]: value })
          }
        />
      ),
    },
    {
      key: 'services',
      icon: <MedicalServices />,
      component: (
        <TreatmentAccordion
          assignedTreatments={medicInfo.assignedServices.assignedTreatments}
          onServiceChange={(updatedServices) =>
            handleChange('assignedServices', { assignedTreatments: updatedServices })
          }
        />
      ),
    },
    {
      key: 'workingHours',
      icon: <AccessTimeOutlined />,
      component: (
        <WorkingHoursStep
          workingHours={medicInfo.workingHours}
          onWorkingHoursChange={(day, hours) =>
            handleChange('workingHours', { ...medicInfo.workingHours, [day]: hours })
          }
        />
      ),
    },
    {
      key: 'daysOff',
      icon: <EditCalendar />,
      component: (
        <DaysOffStep
          daysOff={medicInfo.daysOff}
          onDaysOffChange={(updatedDaysOff) => handleChange('daysOff', updatedDaysOff)}
        />
      ),
    },
    {
      key: 'permissions',
      icon: <AdminPanelSettingsOutlined />,
      component: (
        <PermissionsStep
          permissions={medicInfo.permissions}
          onPermissionsChange={(updatedPermissions) =>
            handleChange('permissions', updatedPermissions)
          }
        />
      ),
    },
  ];

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
      {/* Header */}
      <div className={styles.drawerHeader}>
        <h2 className={styles.drawerTitle}>{medicId ? 'Edit Medic' : 'Add Medic'}</h2>
        <button className={styles.closeButton} onClick={() => dispatch(closeDrawer())}>
          <CloseIcon />
        </button>
      </div>

      {/* Tabs Row */}
      <div className={styles.tabRow}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.activeTabItem : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={styles.tabContent}>
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </div>

      {/* Footer */}
      <div className={styles.drawerFooter}>
        <button className={styles.saveButton} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default MedicDrawer;