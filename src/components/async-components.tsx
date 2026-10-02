import React from "react";
import type { PageProps, Route } from "../App";

interface AsyncComponentProps {
  importComponent: () => Promise<{
    default: React.ComponentType<PageProps>;
  }>;
  onRouteChange: (newRoute: Route) => void;
}
//  async components using code splitting

export const AsyncComponent: React.FC<AsyncComponentProps> = ({
  importComponent,
  onRouteChange,
}) => {
  const [Component, setComponent] =
    React.useState<React.ComponentType<PageProps> | null>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: ImportedComponent } = await importComponent();
      setComponent(() => ImportedComponent);
    };

    loadComponent();
  }, [importComponent]);

  if (!Component) return <h1>Loading...</h1>;

  return <Component onRouteChange={onRouteChange} />;
};
