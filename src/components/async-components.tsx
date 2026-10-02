import React from "react";

interface AsyncComponentProps {
  importComponent: () => Promise<{ default: React.ComponentType }>;
}

export const AsyncComponent: React.FC<AsyncComponentProps> = ({
  importComponent,
}) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(
    null,
  );

  React.useEffect(() => {
    importComponent().then(({ default: ImportedComponent }) => {
      setComponent(() => ImportedComponent);
    });
  }, [importComponent]);

  if (!Component) return null;

  return <Component />;
};
