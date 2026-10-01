import heroImg from "../assets/hero.png";
import viteLogo from "../assets/vite.svg";
import "../App.css";
import type { Route } from "../App";

interface Page3Props {
  onRouteChange: (newRoute: Route) => void;
}

const Page3: React.FC<Page3Props> = ({ onRouteChange }) => {
  return (
    <section>
      <header className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </header>
      <button
        onClick={() => {
          onRouteChange("page1");
        }}
      >
        Page1
      </button>
      <button
        onClick={() => {
          onRouteChange("page2");
        }}
      >
        Page2
      </button>
      <button className="disabled">Page3 </button>
    </section>
  );
};
export default Page3;
