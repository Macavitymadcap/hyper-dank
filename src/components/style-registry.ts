export class StyleRegistry {
  private readonly styles: Set<string>;

  constructor() {
    this.styles = new Set<string>();
  }

  register(css: string): void {
    this.styles.add(css);
  }

  getStyles(): string {
    return Array.from(this.styles).join('\n');
  }

  clear(): void {
    this.styles.clear();
  }

  reset(): string {
    const styles = this.getStyles();
    this.clear();
    return styles;
  }
}

// Singleton instance
export const styleRegistry = new StyleRegistry();