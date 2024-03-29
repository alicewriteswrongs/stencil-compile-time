import * as ts from 'typescript';

export function testTransformer(
  transformCtx: ts.TransformationContext,
): ts.Transformer<ts.SourceFile> {
  function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isMethodDeclaration(node) && node.name.getText() === 'render') {
      return ts.factory.updateMethodDeclaration(
        node,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.questionToken,
        node.typeParameters,
        node.parameters,
        node.type,
        ts.factory.createBlock([
          ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('console'),
                ts.factory.createIdentifier('log'),
              ),
              undefined,
              [ts.factory.createStringLiteral('hello, world!')],
            ),
          ),
          ...node.body.statements,
        ]),
      );
    } else {
      return ts.visitEachChild(node, visitor, transformCtx);
    }
  }

  return tsSourceFile => {
    return ts.visitEachChild(tsSourceFile, visitor, transformCtx);
  };
}
