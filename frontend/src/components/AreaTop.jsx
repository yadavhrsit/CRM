import { MdOutlineMenu } from "react-icons/md";
import { useContext, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { ThemeContext } from "../context/ThemeContext";
import AddLeadForm from "./AddLeadForm";
import Modal from "./Modal";

const AreaTop = ({ title, showAddLeadBtn }) => {
  const { openSidebar } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  return (
    <>
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
            {showAddLeadBtn && (
              <button
                className={`px-4 py-2 rounded-md text-lg xl:text-xl font-semibold transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-offset-gray-800"
                    : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-offset-white"
                }`}
                onClick={() => setShowAddLeadModal(true)}
              >
                Add Lead
              </button>
            )}
          </div>
        </div>
      </section>
      {showAddLeadModal && (
        <Modal
          show={showAddLeadModal}
          onClose={() => setShowAddLeadModal(false)}
        >
          <AddLeadForm />
        </Modal>
      )}
    </>
  );
};

export default AreaTop;
