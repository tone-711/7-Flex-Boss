import * as React from "react";

export default function Shifts() {
  const mockData = [
    {
     headcount: 8,
     acceptances: 2,
    },
    {
      headcount: 2,
      acceptances: 0,
     },
     {
      headcount: 4,
      acceptances: 4,
     },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        flex: 1,
        backgroundColor: '#50ac94',
        paddingBottom: 1000,
        paddingTop: 10,
      }}
    >
      <h2 style={{ marginBottom: 80, fontSize: 45, color: 'white', marginTop: 30 }}>Shifts</h2>

      <div style={{ marginLeft: 90, marginRight: 90 }}>
        {mockData.map((x, i) => (
            <div
              style={{
                flex: 1,
                backgroundColor: '#fcc494',
                borderRadius: 8,
              }}
            >
              {/* <p style={{ textAlign: "start", paddingTop: 10, marginLeft: 10 }}>{i + 1+')'}</p> */}
              <p
                style={{
                  textAlign: "start",
                  marginLeft: 10,
                  paddingTop: 15,
                  fontSize: 16,
                  fontWeight: "normal",
                  color: "black",
                }}
              >
                HeadCount: {x.headcount}
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
                Acceptances: {x.acceptances}
              </p>
            </div>
        ))}
      </div>
    </div>
  );
}

