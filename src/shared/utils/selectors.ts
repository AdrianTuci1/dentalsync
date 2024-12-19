import { createSelector } from 'reselect';

export const selectTopDrawer = createSelector(
  (state: { drawer: { drawers: Array<{ type: string; data: any }> } }) => state.drawer.drawers,
  (drawers) => {
    const topDrawer = drawers[drawers.length - 1];
    return {
      drawerType: topDrawer?.type || null, // Include drawerType
      drawerData: topDrawer?.data || null,
      isOpen: Boolean(topDrawer),
    };
  }
);
