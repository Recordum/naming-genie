import { Translator } from './translator';
import createVariableNameTranslator, {
  IVariableNameTranslator,
} from './variable-name-translator';
import { VariableNameTranslator } from './variable-name-translator';
describe('VariableNameTranslator', () => {
  let translator: Translator;
  let variableNameTranslator: IVariableNameTranslator;

  describe('translateVariableName', () => {
    it('should translate text to different variable name formats', async () => {
      translator = {
        translate: async (src, target, text) => 'test variable',
        detectLanguage: async (text) => 'ko',
      };
      variableNameTranslator = new VariableNameTranslator(translator);

      const result =
        await variableNameTranslator.translateVariableName('변수 테스트');

      expect(result.camelCase).toEqual('testVariable');
      expect(result.snakeCase).toEqual('test_variable');
      expect(result.pascalCase).toEqual('TestVariable');
      expect(result.bigSnakeCase).toEqual('TEST_VARIABLE');
    });

    it('translate text should not include Articles and Apostrophes', async () => {
      translator = {
        translate: async (src, target, text) => "it's a test",
        detectLanguage: async (text) => 'ko',
      };
      variableNameTranslator = new VariableNameTranslator(translator);

      const result =
        await variableNameTranslator.translateVariableName('이건 테스트');

      expect(result.camelCase).toEqual('itsTest');
    });

    it('translated text should not include prepositions and possessive pronounce', async () => {
      translator = {
        translate: async (src, target, text) => "verify one's user e-mail",
        detectLanguage: async (text) => 'ko',
      };
      variableNameTranslator = new VariableNameTranslator(translator);

      const result =
        await variableNameTranslator.translateVariableName('이건 테스트');

      expect(result.camelCase).toEqual('verifyUserEmail');
    });
  });
});
