export class Formatter {
  static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}
