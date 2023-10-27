import * as React from "react";
import useSocketIO from '../services/useSocketIO'

export default function Shifts() {
  const { socket } = useSocketIO();
  const [shifts, setShifts] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    socket.emit('get shifts', { getAll: true });
  }, []);

  socket?.on("get shifts response", ({ success, shifts }) => {
    if (success === true) {
      setError('')
      setShifts(shifts)
    }
    else {
      setError('Refresh to pull all shifts')
    }
  });

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
      {error ? <p style={{ color: '#ff0028' }}>{error}</p> : null}

      <div style={{ marginLeft: 90, marginRight: 90 }}>
        {shifts?.map((x,i) => (
            <div
              style={{
                flex: 1,
                backgroundColor: '#fcc494',
                borderRadius: 8,
              }}
            >
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
                StoreId: {x.storeId}
              </p>
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
                StartDate: {x.startDate}
              </p>
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
                PayRate: {x.payRate}
              </p>
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
                HeadCount: {x.headCount}
              </p>
              <p
                style={{
                  textAlign: "start",
                  marginLeft: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  fontSize: x.status === "unassigned" ? 20 : 16,
                  fontWeight: x.status === "unassigned" ? "bold" : "normal",
                  color: "black",
                }}
              >
                AvailableSlots: {x.availableSlots}
              </p>
            </div>
        ))}
      </div>
    </div>
  );
}

