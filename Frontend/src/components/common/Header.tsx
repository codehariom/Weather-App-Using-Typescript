import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeProvider";
import { Sun, Moon } from "@phosphor-icons/react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className=" sticky top-0 z-50 w-full border-b-2 bg-background/60 backdrop-blur-lg py-2 ">
      <div className=" flex container mx-auto justify-between items-center ">
        <Link to={"/"}>
          <img
            src={
              isDark
                ? "/src/assets/cloud-sun-fill.svg"
                : "/src/assets/cloud-sun.svg"
            }
            className=" h-15 w-15"
          />
        </Link>
        <div>
          {/* search input  */}
          {/* Theme toggel  */}
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {isDark ? (
              <Sun size={32} color="#ffae00" weight="fill" />
            ) : (
              <Moon size={32} color="#0099ff" weight="fill" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
