import heroImg from "../assets/hero.png";
import viteLogo from "../assets/vite.svg";
import "../App.css";

import type { Route } from "../App";

interface Page2Props {
  onRouteChange: (newRoute: Route) => void;
}

const Page2: React.FC<Page2Props> = ({ onRouteChange }) => {
  return (
    <section>
      <header className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </header>
      <button
        onClick={() => {
          onRouteChange("Page1");
        }}
      >
        Page1
      </button>
      <button className="disabled">Page2 </button>
      <button
        onClick={() => {
          onRouteChange("Page3");
        }}
      >
        Page3
      </button>
    </section>
  );
};
export default Page2;
