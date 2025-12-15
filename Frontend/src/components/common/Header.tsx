import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeProvider";
import { MoonIcon, SunIcon } from "lucide-react";
import CitySearch from "./CitySearch";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className=" sticky top-0 z-50 w-full border-b-2 bg-background/60 backdrop-blur-lg py-2 ">
      <div className=" flex container mx-auto justify-between items-center ">
<Link to="/">
  <h3
    className={`h-15 w-15 font-bold ${
      isDark ? "text-white" : "text-black"
    }`}
  >
    {isDark ? "codehariom" : "codehariom"}
  </h3>
</Link>
        <div className=" flex gap-5">
          {/* search input  */}
          <CitySearch/>
          {/* Theme toggel  */}
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {isDark ? (
              <SunIcon size={32} color="#ffae00" />
            ) : (
              <MoonIcon size={32} color="#0099ff"  />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
