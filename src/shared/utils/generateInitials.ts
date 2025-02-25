function getInitials(inputString?: string): string {
  if (!inputString || inputString.trim() === '') return ''; // Handle undefined or empty string

  // Split the string by spaces into words
  const words: string[] = inputString.trim().split(/\s+/);

  // Extract the first letter of each word and join them
  const initials: string = words.map(word => word.charAt(0).toUpperCase()).join('');

  return initials;
}

export default getInitials;