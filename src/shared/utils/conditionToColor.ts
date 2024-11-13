export const conditionToColor = (condition: string): string => {
    switch (condition) {
      case 'healthy':
        return '#00FF00'; // Green for healthy
      case 'cavity':
        return '#FF0000'; // Red for cavity
      case 'filled':
        return '#0000FF'; // Blue for filled tooth
      default:
        return '#FFFFFF'; // Default white for unknown condition
    }
  };
  