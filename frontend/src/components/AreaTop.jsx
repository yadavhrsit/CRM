import { MdOutlineMenu } from "react-icons/md";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { ThemeContext } from "../context/ThemeContext";



const AreaTop = ({title}) => {
  const { openSidebar } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);

  return (
    <section className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center space-x-2">
        <button
          className="inline-flex items-center md:hidden dark:text-white"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <div className="flex gap-5 items-center justify-between">
          <h2
            className={`text-black ${
              theme === "dark" && "text-white"
            } text-lg xl:text-2xl font-semibold`}
          >
            {title}
          </h2>
          <button
            className={`text-black bg-blue-500 px-4 py-1 rounded-md ${
              theme === "dark" && "text-white"
            } text-lg xl:text-2xl font-semibold`}
          >
            Add Lead
          </button>
        </div>
      </div>
    </section>
  );
};

export default AreaTop;
