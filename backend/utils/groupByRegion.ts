export const groupByRegion = (data: any[]) => {
    const getRegion = (location: string | null): string => {
      if (!location) return "Unknown";
      if (location.startsWith("N")) return "North";
      if (location.startsWith("S")) return "South";
      return "Unknown";
    };
  
    const grouped: Record<string, number> = {};
  
    data.forEach((item: any) => {
      const region = getRegion(item.sourceLocation || null);
      grouped[region] = (grouped[region] || 0) + 1;
    });
  
    return Object.entries(grouped).map(([name, y]) => ({ name, y }));
  };