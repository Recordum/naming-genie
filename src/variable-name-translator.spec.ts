
import { Translator } from './translator';
import { VariableNameTranslator } from './variable-name-translator';

describe('VariableNameTranslator', () => {
  let translator: Translator;
  let variableNameTranslator: VariableNameTranslator;

  beforeEach(() => {
    // Translator의 Mock 구현 (필요에 따라 실제 구현에 맞게 조정)
    translator = {
      translate: async (src, target, text) => 'test variable', // 단순 반환
      detectLanguage: async (text) => 'ko', // 항상 'EN'으로 가정
    };
    variableNameTranslator = new VariableNameTranslator(translator);
  });

  describe('translateVariableName', () => {
    it('should translate text to different variable name formats', async () => {
      const result = await variableNameTranslator.translateVariableName('변수 테스트');
      expect(result.camelCase).toEqual('testVariable');
      expect(result.snakeCase).toEqual('test_variable');
      expect(result.pascalCase).toEqual('TestVariable');
      expect(result.bigSnakeCase).toEqual('TEST_VARIABLE');
    });
  });

});
