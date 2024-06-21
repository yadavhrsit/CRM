import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const CustomPieChart = ({ pieData, infoData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <text
          x="50%"
          y="20"
          textAnchor="middle"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          {infoData.title}
        </text>
        <text
          x="50%"
          y="50"
          textAnchor="middle"
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          {infoData.totalLeads && " Total Leads: "}
          {infoData.totalLeads} {""}
          {infoData.openLeadsCount ? "Open Leads: " : "Closed Leads: "}
          {infoData.openLeadsCount || infoData.closedLeadsCount}
        </text>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={80}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {pieData[index].name}: {value} (
                {(
                  (value / infoData.totalLeads ||
                    value / infoData.closedLeadsCount) * 100
                ).toFixed(0)}
                %)
              </text>
            );
          }}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        <Legend
          formatter={(value, entry) => {
            return `${entry.payload.name}: ${entry.payload.value} (${(
              (entry.payload.value / infoData.totalLeads ||
                entry.payload.value / infoData.closedLeadsCount) * 100
            ).toFixed(0)}%)`;
          }}
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
