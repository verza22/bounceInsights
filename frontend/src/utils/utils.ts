export const formatDate = (date: Date): string => date.toISOString().split('T')[0]; //date to YYYY-MM-DD
export const strFormatDate = (str: string): Date => new Date(str); //string to date

export const createRandomUuid = (): string => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}