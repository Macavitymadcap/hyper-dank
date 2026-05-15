export class Calculator {
  static getSpeed(miles: number, minutes: number, seconds: number): number {
    if (miles <= 0 || (minutes <= 0 && seconds <= 0)) return 0;
    const totalHours = minutes / 60 + seconds / 3600;
    return miles / totalHours;
  }
  
  static getPace(miles: number, minutes: number, seconds: number): number {
    if (miles <= 0) return 0;
    const totalMinutes = minutes + seconds / 60;
    return totalMinutes / miles;
  }

  static getAverage(numbers: number[]): number {
    const total = numbers.length;
    const average = total > 0 
        ? numbers.reduce((a, b) => a + b, 0) / total 
        : 0;

    return average
  }

  static getMedian(numbers: number[]): number {
    const total = numbers.length;
    if (total === 0) return 0;

    const sorted = numbers.toSorted((a, b) => a - b);
    const midpoint = Math.floor(total / 2);

    if (total % 2 === 1) {
      return sorted[midpoint] ?? 0;
    }

    const lower = sorted[midpoint - 1] ?? 0;
    const upper = sorted[midpoint] ?? 0;
    return (lower + upper) / 2;
  } 
}
