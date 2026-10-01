import heroImg from "../assets/hero.png";
import viteLogo from "../assets/vite.svg";
import reactLogo from "../assets/react.svg";
import "../App.css";
import type { Route } from "../App";

interface Page1Props {
  onRouteChange: (newRoute: Route) => void;
}

const Page1: React.FC<Page1Props> = ({ onRouteChange }) => {
  return (
    <section>
      <header className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
        <img src={reactLogo} className="react" alt="React logo" />
      </header>
      <button className="disabled">Page1 </button>
      <button
        onClick={() => {
          onRouteChange("Page2");
        }}
      >
        Page2
      </button>
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
export default Page1;
