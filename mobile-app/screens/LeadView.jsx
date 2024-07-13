import { useEffect, useState } from "react";
import { ScrollView, View, Text, Modal, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import AddFollowUpForm from "../components/AddFollowUpForm";

function LeadView({ route }) {
  const { token, user } = useAuth();
  const { notifications } = useNotification();
  const { id } = route.params;
  const [addFollowUp, setAddFollowUp] = useState(false);
  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState(false);
  const [lead, setLead] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/leads/${id}`, {
          headers: { Authorization: token },
        });
        setLead(response.data);
        
        if (response.data.followUps.length === 0) {
          setAddFollowUp(true);
        } else if (
          response.data.followUps[response.data.followUps.length - 1].assignedTo
            .username === user.username
        ) {
          setAddFollowUp(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, token, notifications, showAddFollowUpModal]);

  if (isLoading) {
    return (
      <View className="flex items-center justify-center min-h-screen">
        <Text className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Company:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.company?.name}
            </Text>
          </View>
          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Name:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.name}
            </Text>
          </View>
          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Email:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.email}
            </Text>
          </View>
          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Mobile:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.mobile}
            </Text>
          </View>
          <View className=" col-span-2">
            <Text className="block text-gray-700 dark:text-gray-300">
              Query:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.query}
            </Text>
          </View>
          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Status:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.status}
            </Text>
          </View>

          <View>
            <Text className="block text-gray-700 dark:text-gray-300">
              Created At:
            </Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.createdAt &&
                dayjs(lead.createdAt).format("DD-MM-YYYY HH:mm A")}
            </Text>
          </View>
          <View>
            <Text className="text-gray-700 dark:text-gray-300">Added By:</Text>
            <Text className="text-lg text-gray-900 dark:text-gray-100">
              {lead.addedBy?.name}
            </Text>
          </View>
        </View>
        <View className="mb-4">
          <View className="flex flex-row justify-between items-center my-4">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white">
              Follow-Ups ({lead.followUps.length})
            </Text>
            {addFollowUp && user.role==="employee" && (
              <TouchableOpacity
                onPress={() => setShowAddFollowUpModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                <Text className="text-lg font-bold text-gray-100">
                  Add Follow-Up
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {lead.followUps && lead.followUps.length > 0 ? (
            lead.followUps.map((followUp) => (
              <View
                key={followUp._id}
                className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                <View className="flex gap-4">
                  <View>
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Follow Date:
                    </Text>
                    <Text className="text-lg text-gray-900 dark:text-gray-100">
                      {followUp.followDate &&
                        dayjs(followUp.followDate).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                  <View>
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Follow up taken Date:
                    </Text>
                    <Text className="text-lg text-gray-900 dark:text-gray-100">
                      {followUp.createdAt &&
                        dayjs(followUp.createdAt).format("DD-MM-YYYY, hh:mm A")}
                    </Text>
                  </View>
                  <View>
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Status:
                    </Text>
                    <Text className="text-lg text-gray-900 dark:text-gray-100">
                      {followUp.status}
                    </Text>
                  </View>
                  <View className="col-span-2">
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Remarks:
                    </Text>
                    <Text
                      className="text-lg text-gray-900 dark:text-gray-100"
                      selectable
                    >
                      {followUp.remarks}
                    </Text>
                  </View>
                  <View>
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Added By:
                    </Text>
                    <Text className="text-lg text-gray-900 dark:text-gray-100">
                      {followUp.addedBy?.name}
                    </Text>
                  </View>
                  <View>
                    <Text className="block text-gray-700 dark:text-gray-300">
                      Assigned To:
                    </Text>
                    <Text className="text-lg text-gray-900 dark:text-gray-100">
                      {followUp.assignedTo?.name}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 dark:text-gray-400 pb-4">
              No follow-ups available.
            </Text>
          )}
        </View>
      </ScrollView>
      <AddFollowUpForm
        leadId={id}
        showAddFollowUpModal={showAddFollowUpModal}
        setShowAddFollowUpModal={setShowAddFollowUpModal}
      />
    </>
  );
}

export default LeadView;
