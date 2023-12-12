import axios from 'axios';
export interface Translator {
  translate(src: string, target: string, text: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
}

export type TranslatorConfig = PapagoConfig;

export type PapagoConfig = {
  clientId: string;
  clientSecret: string;
};

export class PapagoTranslator implements Translator {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(papagoConfig: PapagoConfig) {
    this.clientId = papagoConfig.clientId;
    this.clientSecret = papagoConfig.clientSecret;
  }

  async translate(src: string, target: string, text: string): Promise<string> {
    const apiURL = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
    const headers = {
      'X-NCP-APIGW-API-KEY-ID': this.clientId,
      'X-NCP-APIGW-API-KEY': this.clientSecret,
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
    const apiURL = 'https://naveropenapi.apigw.ntruss.com/langs/v1/dect';
    const headers = {
      'X-NCP-APIGW-API-KEY-ID': this.clientId,
      'X-NCP-APIGW-API-KEY': this.clientSecret,
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
