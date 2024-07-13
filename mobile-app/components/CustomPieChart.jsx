import { PieChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";

const CustomPieChart = ({ pieData, leadChartInfo }) => {
  const totalLeads = pieData.reduce((sum, item) => sum + item.value, 0);

  const renderLegend = (text, color) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || "white",
          }}
        />
        <Text style={{ color: "white", fontSize: 16 }}>{text || ""}</Text>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <View
        className="bg-[#2864ad] dark:bg-sky-950"
        style={{
          borderRadius: 10,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*********************    Custom Header component      ********************/}
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          {leadChartInfo.title}
        </Text>
        {/****************************************************************************/}

        <PieChart
          strokeColor="white"
          strokeWidth={4}
          donut
          data={[
            { value: pieData[0].value, color: "#fad325" },
            { value: pieData[1].value, color: "#f44336" },
            { value: pieData[2].value, color: "#4CAF50" },
          ]}
          innerCircleColor="#414141"
          innerCircleBorderWidth={4}
          innerCircleBorderColor={"white"}
          showValuesAsLabels={true}
          showText
          textSize={18}
          textColor="black"
          centerLabelComponent={() => {
            return (
              <View>
                <Text
                  style={{ color: "white", fontSize: 20, textAlign: "center" }}
                >
                  {leadChartInfo.totalLeads}
                </Text>
                <Text style={{ color: "white", fontSize: 12 }}>
                  Total Leads
                </Text>
              </View>
            );
          }}
        />

        {/*********************    Custom Legend component      ********************/}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          {renderLegend(
            `Won ${pieData[2].value} (${(
              (pieData[2].value / totalLeads) *
              100
            ).toFixed(2)}%)`,
            "#18b86a"
          )}
          {renderLegend(
            `Lost ${pieData[1].value} (${(
              (pieData[1].value / totalLeads) *
              100
            ).toFixed(2)}%)`,
            "#d1384d"
          )}
          {renderLegend(
            `Closed ${leadChartInfo.closedLeadsCount} (${(
              (leadChartInfo.closedLeadsCount / totalLeads) *
              100
            ).toFixed(2)}%)`,
            "blue"
          )}
          {renderLegend(
            `Open ${leadChartInfo.openLeadsCount} (${(
              (leadChartInfo.openLeadsCount / totalLeads) *
              100
            ).toFixed(2)}%)`,
            "#fad325"
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomPieChart;
