import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function EmployeeDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  if (!token || user.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to view this page",
    }).then(() => navigate("/login"));
  }
  return <div>EmployeeDashboard</div>;
}

export default EmployeeDashboard;
