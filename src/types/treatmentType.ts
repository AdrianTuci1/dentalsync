export interface ComponentWithUnits {
    id: string;
    componentName: string;
    unitPrice: number;
    componentUnits: number;
  }
  
  export interface Treatment {
    id: number;
    name: string;
    category: string;
    description?: string;
    duration?: number; // Duration in minutes
    price?: number;
    components?: ComponentWithUnits[]; // Array of components with units
    createdAt?: string;
    updatedAt?: string;
  }
  