import { useState } from "react";
import Page1 from "./components/page1";
import Page2 from "./components/page2";
import Page3 from "./components/page3";

export type Route = "page1" | "page2" | "page3";

function App() {
  const [route, setRoute] = useState<Route>("page1");

  const onRouteChange = (newRoute: Route = "page1") => {
    setRoute(newRoute);
  };
  const pages = {
    page1: <Page1 onRouteChange={onRouteChange} />,
    page2: <Page2 onRouteChange={onRouteChange} />,
    page3: <Page3 onRouteChange={onRouteChange} />,
  };
  return (
    <>
      <section id="center">{pages[route]}</section>
    </>
  );
}

export default App;
