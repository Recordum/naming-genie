import { isThisTypeNode } from 'typescript';
import { Translator, TranslatorConfig, createTranslator } from './translator';

export type VariableName = {
  snakeCase: string;
  camelCase: string;
  pascalCase: string;
  bigSnakeCase: string;
};

export interface IVariableNameTranslator {
  translateVariableName(text: string): Promise<VariableName>;
  recommendVariableName(description: string): Promise<VariableName[]>;
}

export default function createVariableNameTranslator(config: TranslatorConfig) {
  const translator = createTranslator(config);
  return new VariableNameTranslator(translator);
}
/**
 * TODO: a/an 제거하기
 */
export class VariableNameTranslator implements IVariableNameTranslator {
  constructor(private translator: Translator) {}

  async translateVariableName(text: string): Promise<VariableName> {
    const src: string = await this.translator.detectLanguage(text);
    if (src === 'en') {
      return this.convertToVariableFormats(text);
    }

    const translatedText: string = await this.translator.translate(
      src,
      'en',
      text,
    );
    return this.convertToVariableFormats(translatedText);
  }

  async recommendVariableName(description: string): Promise<VariableName[]> {
    throw new Error('Method not implemented.');
  }

  private convertToVariableFormats(text: string): VariableName {
    return {
      snakeCase: this.convertToSnakeCase(text),
      camelCase: this.convertToCamelCase(text),
      pascalCase: this.convertToPascalCase(text),
      bigSnakeCase: this.convertToBigSnakeCase(text),
    };
  }

  private convertToSnakeCase(text: string): string {
    return text
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('_');
  }

  private convertToCamelCase(text: string): string {
    const words = text.split(' ');
    const firstWord = words[0].toLowerCase();
    const restOfWords = words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    return firstWord + restOfWords;
  }

  private convertToPascalCase(text: string): string {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private convertToBigSnakeCase(text: string): string {
    return text
      .split(' ')
      .map((word) => word.toUpperCase())
      .join('_');
  }
}
