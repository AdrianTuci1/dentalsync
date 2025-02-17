import ComponentService from "@/api/services/componentService";
import { Component } from "@/features/clinic/types/componentType";

export const createComponentFactory = (token: string, clinicDb: string) => {
  // Use the singleton getter to obtain the service instance.
  const service = ComponentService.getInstance(token, clinicDb);

  return {
    fetchComponents: async (name: string = "", offset: number = 0) => service.getAllComponents(name, offset),
    createComponent: async (component: Partial<Component>) =>
      service.createComponent(component),
    updateComponent: async (id: string, component: Partial<Component>) =>
      service.updateComponent(id, component),
    deleteComponent: async (id: string) => service.deleteComponent(id),
  };
};