export interface Translator {
  translate(src: string, target: string, text: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
}
