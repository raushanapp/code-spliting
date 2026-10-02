import { useState } from "react";
import Page1 from "./components/page1";
import { AsyncComponent } from "./components/async-components";

export type Route = "Page1" | "Page2" | "Page3";
export type PageProps = {
  onRouteChange: (newRoute: Route) => void;
};

// function App() {
//   const [route, setRoute] = useState<Route>("Page1");
//   const [Components, setComponents] = useState<{
//     [key: string]: React.ComponentType<PageProps>;
//   }>({ Page1 });

//   const onRouteChange = (newRoute: Route = "Page1") => {
//     // No code spliting
//     // setRoute(newRoute);
//     // with code splitting
//     if (newRoute === "Page1") {
//       setRoute(newRoute);
//     } else if (newRoute === "Page2") {
//       import("./components/page2").then(({ default: Page2 }) => {
//         setComponents((prev) => ({ ...prev, Page2 }));
//         setRoute(newRoute);
//       });
//     } else if (newRoute === "Page3") {
//       import("./components/page3").then(({ default: Page3 }) => {
//         setComponents((prev) => ({ ...prev, Page3 }));
//         setRoute(newRoute);
//       });
//     }
//   };
//   const CurrentComponent = Components[route];

//   return (
//     <>
//       <section id="center">
//         {CurrentComponent && <CurrentComponent onRouteChange={onRouteChange} />}
//       </section>
//     </>
//   );
// }

// export default App;

function App() {
  const [route, setRoute] = useState<Route>("Page1");
  const onRouteChange = (newRoute: Route = "Page1") => {
    setRoute(newRoute);
  };

  return (
    <>
      <section id="center">
        {route === "Page1" && <Page1 onRouteChange={onRouteChange} />}
        {route === "Page2" && (
          <AsyncComponent
            importComponent={() => import("./components/page2")}
            onRouteChange={onRouteChange}
          />
        )}

        {route === "Page3" && (
          <AsyncComponent
            importComponent={() => import("./components/page3")}
            onRouteChange={onRouteChange}
          />
        )}
      </section>
    </>
  );
}

export default App;
