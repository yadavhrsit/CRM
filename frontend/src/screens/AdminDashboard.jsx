import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  if (!token || user.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to view this page",
    }).then(() => navigate("/login"));
  }
  return <div>AdminDashboard</div>;
}

export default AdminDashboard;
