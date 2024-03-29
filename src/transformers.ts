import ts, { factory } from 'typescript';

export function testTransformer(
  transformCtx: ts.TransformationContext,
): ts.Transformer<ts.SourceFile> {
  function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isMethodDeclaration(node) && node.name.getText() === 'getText') {
      return ts.factory.updateMethodDeclaration(
        node,
        node.modifiers,
        node.asteriskToken,
        node.name,
        node.questionToken,
        node.typeParameters,
        node.parameters,
        node.type,
        factory.updateBlock(node.body, [
          factory.createExpressionStatement(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('console'),
                factory.createIdentifier('log'),
              ),
              undefined,
              [factory.createStringLiteral('hey from the transformer!')],
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
