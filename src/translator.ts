import axios from 'axios';
export interface Translator {
  translate(src: string, target: string, text: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
}

export function createTranslator(config: TranslatorConfig): Translator {
  if (config.service === 'papago') {
    return new PapagoTranslator({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
  }
  throw Error('not-supported-service');
}
export type TranslatorConfig = {
  service: string;
} & PapagoConfig;

export type PapagoConfig = {
  clientId: string;
  clientSecret: string;
};

class PapagoTranslator implements Translator {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(papagoConfig: PapagoConfig) {
    this.clientId = papagoConfig.clientId;
    this.clientSecret = papagoConfig.clientSecret;
  }

  async translate(src: string, target: string, text: string): Promise<string> {
    const apiURL = 'https://openapi.naver.com/v1/papago/n2mt';
    const headers = {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    };

    const data = {
      source: src,
      target: target,
      text: text,
    };

    const response = await axios.post(apiURL, data, {
      headers,
    });

    return response.data.message.result.translatedText;
  }

  async detectLanguage(text: string): Promise<string> {
    const apiURL = 'https://openapi.naver.com/v1/papago/detectLangs';
    const headers = {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    };

    const data = {
      query: text,
    };

    const response = await axios.post(apiURL, data, {
      headers,
    });

    return response.data.langCode;
  }
}
