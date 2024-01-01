import {
  CancellationToken,
  CodeAction,
  CodeActionContext,
  CodeActionKind,
  CodeActionProvider,
  Range,
  TextDocument,
} from 'vscode';

export class NamingCodeActionProvider implements CodeActionProvider {
  public async provideCodeActions(
    document: TextDocument,
    range: Range,
    context: CodeActionContext,
    token: CancellationToken,
  ): Promise<CodeAction[]> {
    const namingGenieAction = new CodeAction(
      'Naming Genie',
      CodeActionKind.QuickFix,
    );

    namingGenieAction.command = {
      title: 'Invoke Naming Genie',
      command: 'namingenie.invokeNamingGenie',
      arguments: [document, range],
    };

    return [namingGenieAction];
  }
}
