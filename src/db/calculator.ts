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

  static getAverage(numbers: number[]) {
    const total = numbers.length;
    const average = total > 0 
        ? numbers.reduce((a, b) => a + b, 0) / total 
        : 0;

    return average
  }

  static getMedian(numbers: number[]) {
    const total = numbers.length;
    const median = total > 0
      ? numbers.toSorted((a, b) => a - b)[Math.floor(total / 2)]
      : 0;
    
    return median;
  } 
}