import * as React from "react";
import Button from "@mui/material/Button";

export default function Shifts() {
  const mockData = [
    {
      hours: 8,
      status: "unassigned",
    },
    {
      hours: 8,
      status: "assigned",
    },
    {
      hours: 8,
      status: "assigned",
    },
    {
      hours: 6,
      status: "assigned",
    },
  ];

  const unassignedTasks = mockData.filter((word) => word.status === 'unassigned');
  const assignedTasks = mockData.filter((word) => word.status === 'assigned');

  return (
    <div
      style={{
        textAlign: "center",
        flex: 1,
        backgroundColor: "#6DC86E",
        paddingBottom: 1000,
        paddingTop: 10,
      }}
    >
      <h2 style={{ marginBottom: 80, fontSize: 45, color: 'white', marginTop: 30 }}>Shifts</h2>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            height: 20,
            width: 120,
            background: "#FFCCCB",
            marginLeft: 30,
            borderRadius: 8,
          }}
        >
          <p>UNassigned: {unassignedTasks.length}</p>
        </div>

        <div
          style={{
            height: 20,
            width: 120,
            background: "#b1dcd1",
            marginLeft: 30,
            borderRadius: 8,
          }}
        >
          <p>assigned: {assignedTasks.length}</p>
        </div>
      </div>

      <div style={{ marginLeft: 90, marginRight: 90 }}>
        {mockData.map((x, i) => (
          <Button variant="text" style={{ width: "100%", marginBottom: 30 }} onPress={console.log('button pressed')}>
            <div
              style={{
                flex: 1,
                backgroundColor:
                  x.status !== "unassigned" ? "#b1dcd1" : "#FFCCCB",
                borderRadius: 8,
              }}
            >
              {/* <p style={{ textAlign: "start", paddingTop: 10, marginLeft: 10 }}>{i + 1+')'}</p> */}
              <p
                style={{
                  textAlign: "start",
                  marginLeft: 10,
                  paddingTop: 15,
                  fontSize: x.status === "unassigned" ? 20 : 16,
                  fontWeight: x.status === "unassigned" ? "bold" : "normal",
                  color: "black",
                }}
              >
                Shift Hours: {x.hours}
              </p>
              <p
                style={{
                  textAlign: "start",
                  marginLeft: 10,
                  paddingBottom: 15,
                  fontSize: x.status === "unassigned" ? 20 : 16,
                  fontWeight: x.status === "unassigned" ? "bold" : "normal",
                  color: "black",
                }}
              >
                Shift Status: {x.status}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

