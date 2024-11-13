function getInitials(inputString: string): string {
    // Split the string by spaces into words
    const words: string[] = inputString.split(' ');
  
    // Extract the first letter of each word and join them with a space
    const initials: string = words.map(word => word.charAt(0).toUpperCase()).join('');
  
    return initials;
  }
  
export default getInitials;