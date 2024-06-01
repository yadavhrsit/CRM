import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "../components/DataCard";
import Modal from "../components/Modal";
import AreaTop from "../components/AreaTop";
import { AiOutlineOrderedList } from "react-icons/ai";
import { FaPiggyBank, FaBullseye } from "react-icons/fa";
import { FaMoneyBillWave, FaRegMoneyBillAlt } from "react-icons/fa";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("crm_token");
  const [data, setData] = useState([
    {
      title: "Total Savings Plans",
      icon: AiOutlineOrderedList,
      data: "0",
      color: "#23995e",
    },
    {
      title: "Total Saved Amount",
      icon: FaPiggyBank,
      data: "0",
      color: "#0932b0",
    },
    {
      title: "Total Target Amount",
      icon: FaBullseye,
      data: "0",
      color: "#ff0000",
    },
    {
      title: "Total Funds",
      icon: FaMoneyBillWave,
      data: 0,
      color: "#ff9900",
    },
    {
      title: "Unallocated Funds",
      icon: FaRegMoneyBillAlt,
      data: 0,
      color: "#800080",
    },
  ]);

  return (
    <div className="container mx-auto px-4">
      <AreaTop title="Dashboard" />
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4"
        data-aos="fade-up"
      >
        {data.map((item, index) => (
          <div key={index}>
            <DataCard
              title={item.title}
              icon={item.icon}
              data={item.data}
              color={item.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
