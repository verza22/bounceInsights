export const formatDate = (date: Date): string => date.toISOString().split('T')[0]; //date to YYYY-MM-DD
export const strFormatDate = (str: string): Date => new Date(str); //string to date