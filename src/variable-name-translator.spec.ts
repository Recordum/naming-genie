import { Translator } from './translator';
import { IVariableNameTranslator } from './variable-name-translator';
import { VariableNameTranslator } from './variable-name-translator';
describe('VariableNameTranslator', () => {
  let translator: Translator;
  let variableNameTranslator: IVariableNameTranslator;

  beforeEach(() => {
    translator = {
      translate: async (src, target, text) => 'test variable',
      detectLanguage: async (text) => 'ko',
    };
    variableNameTranslator = new VariableNameTranslator(translator);
  });

  describe('translateVariableName', () => {
    it('should translate text to different variable name formats', async () => {
      const result =
        await variableNameTranslator.translateVariableName('변수 테스트');
      expect(result.camelCase).toEqual('testVariable');
      expect(result.snakeCase).toEqual('test_variable');
      expect(result.pascalCase).toEqual('TestVariable');
      expect(result.bigSnakeCase).toEqual('TEST_VARIABLE');
    });
  });
});
