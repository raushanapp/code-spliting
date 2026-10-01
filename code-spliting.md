# Code Splitting in React: First Approach

Code splitting means dividing the JavaScript application into smaller bundles. Instead of downloading every page when the application starts, the browser can download a page only when the user navigates to it.

This project uses the first approach: **manual dynamic imports** with JavaScript's `import()` function.

## Current application

The application has three pages:

- `Page1` is imported normally and is available in the initial bundle.
- `Page2` is loaded dynamically when the user selects Page2.
- `Page3` is loaded dynamically when the user selects Page3.

The relevant component files are:

```text
src/
	App.tsx
	components/
		page1.tsx
		page2.tsx
		page3.tsx
```

## How the current approach works

`App.tsx` imports the first page normally:

```tsx
import Page1 from "./components/page1";
```

The other pages are imported only inside the navigation handler:

```tsx
if (newRoute === "Page1") {
  setRoute(newRoute);
} else if (newRoute === "Page2") {
  import("./components/page2").then(({ default: Page2 }) => {
    setComponents((prev) => ({ ...prev, Page2 }));
    setRoute(newRoute);
  });
} else if (newRoute === "Page3") {
  import("./components/page3").then(({ default: Page3 }) => {
    setComponents((prev) => ({ ...prev, Page3 }));
    setRoute(newRoute);
  });
}
```

The dynamic `import()` returns a Promise. When the Promise resolves:

1. The imported page component is stored in the `Components` state object.
2. The active route is updated.
3. `App` renders the component for the active route.

```tsx
const CurrentComponent = Components[route];

return (
  <section id="center">
    {CurrentComponent && <CurrentComponent onRouteChange={onRouteChange} />}
  </section>
);
```

## Loading sequence

When the application starts:

```text
Initial bundle
	- App.tsx
	- page1.tsx
```

When the user clicks Page2, the browser requests a separate chunk:

```text
Page2 chunk
	- page2.tsx
```

When the user clicks Page3, another separate chunk is requested:

```text
Page3 chunk
	- page3.tsx
```

After a page has been loaded, it remains in `Components`, so navigating to that page again does not need to import it again during the current application session.

## Why use code splitting?

Without code splitting, all page components can be imported at startup:

```tsx
import Page1 from "./components/page1";
import Page2 from "./components/page2";
import Page3 from "./components/page3";
```

That makes the initial JavaScript bundle larger, even when the user never visits Page2 or Page3.

With dynamic imports, the initial bundle can be smaller and page-specific code can be downloaded when it is needed.

## Important limitation of this first approach

The current code has no loading or error state while a dynamic import is pending. During that time, the previous page can remain visible and `CurrentComponent` may not exist yet for the requested route.

The manual approach also requires us to write the import and state-update logic for every page. A later approach can use `React.lazy` together with `Suspense` to make lazy loading and loading UI more declarative.

## Verify the build

Run the production build:

```bash
pnpm build
```

Vite should generate separate JavaScript chunks for the dynamically imported pages. The generated chunk names can vary between builds.
