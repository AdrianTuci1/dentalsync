import { Component } from "@/features/clinic/types/componentType";

export class ComponentUpdater {
  static mergeComponent(components: Component[], id: string, updated: Partial<Component>): Component[] {
    return components.map((c) => (c.id === id ? { ...c, ...updated } : c));
  }
}