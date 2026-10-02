# React Code Splitting: Implementation Notes

This project demonstrates code splitting for a small React application with three
pages. `Page1` is imported in the main bundle; `Page2` and `Page3` are loaded on
demand as separate chunks.

## Recent changes

The four most recent commits on `main` show how the implementation evolved:

| Commit | Change |
| --- | --- |
| `539a7b0` | Added an initial note describing manual dynamic imports and their limitations. |
| `5e83750` | Added a reusable `AsyncComponent` that loads a component through a dynamic import. |
| `b6658b9` | Used `AsyncComponent` for `Page2` and `Page3`, added the loading message, and typed the page props and routes. |
| `4a419fe` | Replaced the active helper-based approach with `React.lazy` and `Suspense`. |

The active implementation is the last one. The earlier manual and helper-based
versions remain commented in `src/App.tsx` as examples; `src/components/async-components.tsx`
also remains in the project but is not used by the active `App`.

## What code splitting does

Without code splitting, statically importing every page makes those modules
available in the initial application bundle, even if a visitor never opens them.
A dynamic `import()` creates an asynchronous module boundary that the bundler
(Vite/Rollup in this project) can emit as a separate chunk. The browser can then
fetch that chunk when the page is needed.

In this app:

- `Page1` is statically imported and available immediately.
- `Page2` and `Page3` are lazy-loaded when their route is rendered.
- `Suspense` shows a fallback while a lazy page's chunk is loading.

## Current implementation: `React.lazy` and `Suspense`

The active implementation in `src/App.tsx` is equivalent to this example:

```tsx
import { lazy, Suspense, useState } from "react";
import Page1 from "./components/page1";

type Route = "Page1" | "Page2" | "Page3";
type PageProps = {
  onRouteChange: (newRoute: Route) => void;
};

const Page2Lazy = lazy(() => import("./components/page2"));
const Page3Lazy = lazy(() => import("./components/page3"));

function App() {
  const [route, setRoute] = useState<Route>("Page1");
  const onRouteChange = (newRoute: Route = "Page1") => setRoute(newRoute);

  return (
    <section id="center">
      {route === "Page1" && <Page1 onRouteChange={onRouteChange} />}
      <Suspense fallback={<h1>Loading...</h1>}>
        {route === "Page2" && <Page2Lazy onRouteChange={onRouteChange} />}
        {route === "Page3" && <Page3Lazy onRouteChange={onRouteChange} />}
      </Suspense>
    </section>
  );
}
```

`React.lazy` expects the imported module to have a default-exported component.
The lazy component should be declared outside `App`, as above, so it is not
re-created on every render. When the active route first renders that component,
React starts the import. The closest `Suspense` boundary displays its fallback
until the import resolves.

## Earlier approaches

### Manual dynamic imports

The initial implementation loaded each page inside the route-change handler and
stored the resolved component in state:

```tsx
if (newRoute === "Page2") {
  import("./components/page2").then(({ default: Page2 }) => {
    setComponents((previous) => ({ ...previous, Page2 }));
    setRoute(newRoute);
  });
}
```

This makes the load timing and component cache explicit. However, each route
needs its own import/state-update logic, and loading and import failures must be
handled manually.

### Reusable `AsyncComponent`

The next version extracted the import and loading state into a helper component:

```tsx
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

type Route = "Page1" | "Page2" | "Page3";
type PageProps = {
  onRouteChange: (newRoute: Route) => void;
};

interface AsyncComponentProps {
  importComponent: () => Promise<{
    default: ComponentType<PageProps>;
  }>;
  onRouteChange: (newRoute: Route) => void;
}

function AsyncComponent({
  importComponent,
  onRouteChange,
}: AsyncComponentProps) {
  const [Component, setComponent] = useState<ComponentType<PageProps> | null>(
    null,
  );

  useEffect(() => {
    const loadComponent = async () => {
      const { default: ImportedComponent } = await importComponent();
      setComponent(() => ImportedComponent);
    };

    loadComponent();
  }, [importComponent]);

  if (!Component) return <h1>Loading...</h1>;
  return <Component onRouteChange={onRouteChange} />;
}
```

This reduced repeated loading UI, but still required custom asynchronous state
and error handling. The helper in this repository is retained as an example,
not as part of the active `App` implementation.

## Pros and cons

| Approach | Pros | Cons |
| --- | --- | --- |
| Manual `import()` and component state | Full control over when a module is fetched and how it is cached or rendered. | Repeats route-specific code; loading, import errors, and navigation races need explicit handling. |
| Reusable `AsyncComponent` | Centralizes the import-and-loading pattern and can be reused for multiple modules. | Adds custom lifecycle/state code; errors still need explicit handling; an inline importer can change identity and retrigger its effect if the helper's parent rerenders. |
| `React.lazy` with `Suspense` (current) | Concise, idiomatic React pattern; separates the chunk declaration from route rendering; `Suspense` provides a clear loading boundary. | Requires a default export; `Suspense` handles pending loads, not rejected imports, so an Error Boundary is needed to present a deliberate recovery UI for load failures. |

## Loading behavior and limitations

The lazy pages are only rendered when their route is active, so their imports
are deferred until then. Once requested, the module is reused by the module
loader/React rather than fetched afresh for each visit.

The current fallback is a simple heading. The application does not currently
include an Error Boundary around the lazy pages, so rejected imports do not have
a project-specific error or retry UI. Code splitting also does not guarantee a
performance improvement for every app: it trades smaller initial downloads for
additional requests and loading time when a deferred page is first opened.

## Verify the production chunks

Build the app:

```bash
pnpm build
```

Vite should emit separate JavaScript chunks for the dynamically imported pages.
Chunk file names can vary between builds. Use the production build output to
confirm the split rather than relying only on the source-level `import()` calls.
