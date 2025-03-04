import React, { useState, useEffect } from "react";
import {
  AccessTimeOutlined,
  AdminPanelSettingsOutlined,
  Close as CloseIcon,
  EditCalendar,
  InfoOutlined,
  MedicalServices,
} from "@mui/icons-material";
import WorkingHoursStep from "./addMedic/WorkingHoursStep";
import DaysOffStep from "./addMedic/DaysOffStep";
import PermissionsStep from "./addMedic/PermissionsStep";
import InfoTab from "./addMedic/StaffInfoStep";
import TreatmentAccordion from "./addMedic/TreatmentAccordion";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "../drawerSlice";
import { MedicInfo } from "@/features/clinic/types/Medic";
import styles from "@/features/clinic/styles/drawers/MedicDrawer.module.scss";
import { selectTopDrawer } from "@/shared/utils/selectors";
import { MedicRepository } from "@/api/repositories/MedicRepository";

const MedicDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { drawerData, isOpen } = useSelector(selectTopDrawer);
  const medicId = drawerData?.medicId || null;

  const [activeTab, setActiveTab] = useState<string>("info");
  const medicRepository = new MedicRepository();

  // ✅ Extract medic from Redux
  const medic = useSelector((state: any) =>
    state.medics.detailedMedics.find((m: MedicInfo) => String(m.id) === String(medicId))
  );

  // ✅ Local state for form data
  const [medicInfo, setMedicInfo] = useState<MedicInfo | null>(null);

  // ✅ Fetch medic when drawer opens
  useEffect(() => {
    if (medicId) {
      console.log(`📡 Fetching medic details for ID: ${medicId}`);
      medicRepository.loadMedicById(medicId);
    }
  }, [medicId]);

  // ✅ Sync local state when Redux updates
  useEffect(() => {
    if (medicId && medic) {
      console.log("🔄 Updating local state with fetched medic:", medic);
      setMedicInfo(medic);
    }
  }, [medic]);

  // ✅ Initialize form when creating a new medic
  useEffect(() => {
    if (!medicId) {
      console.log("📌 Initializing Empty Medic Form");
      setMedicInfo({
        id: undefined,
        email: "",
        name: "",
        role: "medic",
        subaccount_of: 1,
        photo: "",
        medicProfile: {
          employmentType: "",
          specialization: "",
          phone: "",
          address: "",
          assignedTreatments: [],
          workingDaysHours: [],
          daysOff: [],
        },
        permissions: [],
      });
    }
  }, [medicId]);

  console.log("💡 Current medicInfo state:", medicInfo);

  // ✅ Prevent rendering until state is ready
  if (!medicInfo) {
    return <div>Loading medic details...</div>;
  }

  // 📝 Handle input changes
  const handleChange = (field: keyof MedicInfo, value: any) => {
    setMedicInfo((prevInfo) =>
      prevInfo ? { ...prevInfo, [field]: value } : null
    );
  };

  
  // ✅ Handle Assigned Treatments
  const handleAssignedTreatmentsChange = (updatedTreatments: string[]) => {
    setMedicInfo((prevInfo) =>
      prevInfo
        ? {
            ...prevInfo,
            medicProfile: { ...prevInfo.medicProfile, assignedTreatments: updatedTreatments },
          }
        : null
    );
  };

  // 💾 Save or update medic
  const handleSubmit = async () => {
    if (!medicInfo) return;

    try {
      if (medicInfo.id) {
        console.log("💾 Updating existing medic:", medicInfo);
        await medicRepository.modifyMedic(medicInfo.id, medicInfo);
      } else {
        console.log("➕ Creating new medic:", medicInfo);
        await medicRepository.addMedic(medicInfo);
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error("❌ Error saving medic:", error);
    }
  };

  const tabs = [
    {
      key: "info",
      icon: <InfoOutlined />,
      component: (
        <InfoTab
          email={medicInfo.email}
          name={medicInfo.name}
          photo={medicInfo.photo}
          medicProfile={medicInfo.medicProfile}
          onInfoChange={(field, value) => 
            setMedicInfo((prev) => prev ? { ...prev, [field]: value } : prev)
          }
          onProfileChange={(field, value) =>
            setMedicInfo((prev) => prev
              ? { ...prev, medicProfile: { ...prev.medicProfile, [field]: value } }
              : prev
            )
          }
        />
      ),
    },
    {
      key: "services",
      icon: <MedicalServices />,
      component: (
        <TreatmentAccordion
          assignedTreatments={medicInfo.medicProfile.assignedTreatments}
          onServiceChange={handleAssignedTreatmentsChange}
        />
      ),
    },
    {
      key: "workingHours",
      icon: <AccessTimeOutlined />,
      component: (
      <WorkingHoursStep
        workingDaysHours={medicInfo.medicProfile.workingDaysHours || []} // ✅ Ensures it's always an array
        onWorkingHoursChange={(updatedHours) =>
          setMedicInfo((prevInfo) =>
            prevInfo ? { ...prevInfo, workingDaysHours: updatedHours } : prevInfo
          )
        }
      />
      ),
    },
    {
      key: "daysOff",
      icon: <EditCalendar />,
      component: (
        <DaysOffStep
          daysOff={medicInfo.medicProfile.daysOff || []} // ✅ Ensures daysOff is always an array
          onDaysOffChange={(updatedDaysOff) =>
            setMedicInfo((prevInfo) =>
              prevInfo
                ? {
                    ...prevInfo,
                    daysOff: updatedDaysOff.map((dayOff) => ({
                      ...dayOff,
                      medicId: prevInfo.id ? Number(prevInfo.id) : 0, // Ensure medicId consistency
                    })),
                  }
                : prevInfo
            )
          }
        />
      ),
    },
    {
      key: "permissions",
      icon: <AdminPanelSettingsOutlined />,
      component: (
        <PermissionsStep
          permissions={medicInfo.permissions}
          onPermissionsChange={(updatedPermissions) =>
            handleChange("permissions", updatedPermissions)
          }
        />
      ),
    },
  ];

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
      {/* Header */}
      <div className={styles.drawerHeader}>
        <h2 className={styles.drawerTitle}>{medicId ? "Edit Medic" : "Add Medic"}</h2>
        <button className={styles.closeButton} onClick={() => dispatch(closeDrawer())}>
          <CloseIcon />
        </button>
      </div>

      {/* Tabs Row */}
      <div className={styles.tabRow}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.activeTabItem : ""}`}
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