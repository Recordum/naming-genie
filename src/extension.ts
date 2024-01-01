import * as vscode from 'vscode';
import { NamingCodeActionProvider } from './code-action';
import createVariableNameTranslator, {
  VariableName,
} from './variable-name-translator';
import { Range } from 'vscode';

/**
 *
 * @param context
 * TODO: translator service 설정이 변경될때마다 variableNameTranslator를 재생성
 * observer 패턴 사용해보기
 */
export function activate(context: vscode.ExtensionContext) {
  // const service = context.globalState.get('service') as string;
  const service = 'papago';
  // const clientId = context.globalState.get('clientId') as string;
  const clientId = 'wiJp72PeYk7XWLDAG0Qr';
  // const clientSecret = context.globalState.get('clientSecret') as string;
  const clientSecret = 'MJ2V0iF_O0';
  console.log('=====start========');
  if (!service) {
    registerEnterService(context);
  }

  const variableNameTranslator = createVariableNameTranslator({
    service,
    clientId,
    clientSecret,
  });

  const provider = new NamingCodeActionProvider();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'namingenie.invokeNamingGenie',

      async (document: vscode.TextDocument, range: Range) => {
        const selectedText = document.getText(range);
        const variableNames =
          await variableNameTranslator.translateVariableName(selectedText);
        console.log(variableNames);
        const quickPickItems = Object.keys(variableNames).map((key) => ({
          label: variableNames[key as keyof VariableName],
          description: key,
        }));
        const pickedItem = await vscode.window.showQuickPick(quickPickItems, {
          placeHolder: 'Choose the variable name format',
        });

        if (pickedItem) {
          applySelectedVariableName(document, range, pickedItem.label);
        }
      },
    ),
  );
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(['*'], provider),
  );
  
  registerReplaceCommand(context);
  registerEnterService(context);
  // enterCredentialsQuickPick(context);
}

function applySelectedVariableName(
  document: vscode.TextDocument,
  range: Range,
  variableName: string,
) {
  const editor = vscode.window.activeTextEditor;
  if (editor && document === editor.document) {
    editor.edit((editBuilder) => {
      editBuilder.replace(range, variableName);
    });
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}

function registerEnterService(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'namingenie.enterCredentials',
    async () => {
      const service = await vscode.window.showInputBox({
        prompt: 'Enter your translation service',
      });
      const clientId = await vscode.window.showInputBox({
        prompt: 'Enter your Client ID for the Translation Service',
      });
      const clientSecret = await vscode.window.showInputBox({
        prompt: 'Enter your Client Secret for the Translation Service',
      });

      if (clientId && clientSecret && service) {
        context.globalState.update('service', service);
        context.globalState.update('clientId', clientId);
        context.globalState.update('clientSecret', clientSecret);
        vscode.window.showInformationMessage(
          'Translation Service Credentials Saved!',
        );

        const variableNameTranslator = createVariableNameTranslator({
          service,
          clientId,
          clientSecret,
        });
      }
    },
  );

  context.subscriptions.push(disposable);
}

function registerReplaceCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'namingenie.replaceWithVariableName',
      (range: Range, replacement: string) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            editBuilder.replace(range, replacement);
          });
        }
      },
    ),
  );
}
