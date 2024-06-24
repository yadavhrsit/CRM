import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import AreaTop from "../components/AreaTop";
import { useParams, useLocation } from "react-router-dom";
import AddFollowUpForm from "../components/AddFollowUpForm";
import Modal from "../components/Modal";
import { useNotification } from "../context/NotificationContext";

function LeadView() {
  const { token, user } = useAuth();

  const { notifications } = useNotification();
  
  const { id } = useParams();
  const location = useLocation();
  const { addFollowUp } = location.state || {}; // Providing a default value in case state is undefined
  const [lead, setLead] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/leads/${id}`, {
          headers: { Authorization: token },
        });
        setLead(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, token, notifications]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            @media print {
              body * {
                visibility: hidden;
              }
              #print-section, #print-section * {
                visibility: visible;
              }
              #print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div id="print-section">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const handleFollowUp = () => {
    setShowAddFollowUpModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <AreaTop title="Lead Details" />
        <div>
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
          >
            Print
          </button>
          {(addFollowUp ||
            lead?.followUps[lead.followUps.length - 1]?.assignedTo.username ===
              user.username) && (
            <button
              onClick={handleFollowUp}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Follow-Up
            </button>
          )}
        </div>
      </div>
      <div
        ref={printRef}
        className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Lead Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Company:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.company?.name}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Name:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.name}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.email}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Mobile:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.mobile}
            </p>
          </div>
          <div className=" col-span-2">
            <label className="block text-gray-700 dark:text-gray-300">
              Query:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.query}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Status:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.status}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Created At:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.createdAt &&
                dayjs(lead.createdAt).format("DD-MM-YYYY HH:mm A")}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Added By:
            </label>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {lead.addedBy?.name}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
          Follow Ups
        </h3>
        {lead.followUps && lead.followUps.length > 0 ? (
          lead.followUps.map((followUp) => (
            <div
              key={followUp._id}
              className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    Follow Date:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.followDate &&
                      dayjs(followUp.followDate).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    Follow up taken Date:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.createdAt &&
                      dayjs(followUp.createdAt).format("DD-MM-YYYY, hh:mm A")}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    Status:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300">
                    Remarks:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.remarks}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    Added By:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.addedBy?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    Assigned To:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">
                    {followUp.assignedTo?.name}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No follow-ups available.
          </p>
        )}
      </div>
      {showAddFollowUpModal && (
        <Modal
          show={showAddFollowUpModal}
          onClose={() => setShowAddFollowUpModal(false)}
        >
          <AddFollowUpForm
            leadId={id}
            setShowAddFollowUpModal={setShowAddFollowUpModal}
          />
        </Modal>
      )}
    </>
  );
}

export default LeadView;
