// Utility function to get the subdomain from the URL
export const getSubdomain = (): string => {
    const host = window.location.hostname; // e.g., demo.dentms.ro or clinicname.dentms.ro
    const subdomain = host.split('.')[0]; // Extract the subdomain (demo or clinicname)
    return subdomain;
  };
  