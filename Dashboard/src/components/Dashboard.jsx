import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";


const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(Context); 
  const [appointments, setAppointments] = useState([]); 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/v1/appointment/getall", {
          withCredentials: true
        });
        setAppointments(data.appointments); 
      } catch (error) {
        setAppointments([]); 
        console.log("Error Occurred While Fetching Appointments!!", error);
      }
    }
    fetchAppointments(); 
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/api/v1/appointment/update/${id}`, 
        { status }, 
        { withCredentials: true }
      ); 
      setAppointments((prevAppointments) => 
        prevAppointments.map((appointment) => 
          appointment._id === id ? { ...appointment, status } : appointment)
      );
      toast.success(data.message); 
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src='/doc.png' alt='docImg' />
            <div className='content'>
              <div>
                <p>Hello,</p>
                <h5>
                  {admin && `${admin.firstName} ${admin.lastName}`}
                </h5>
              </div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio, maxime. Sapiente adipisci ut, iusto nostrum expedita molestiae! Non voluptatem magni nihil laborum maiores itaque consequatur?</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Doctors Registered</p>
            <h3>20</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          {appointments && appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Visited</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select 
                        className={
                          appointment.status === "Pending" ? "value-pending" : 
                          appointment.status === "Accepted" ? "value-accepted" : 
                          "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                      >
                        <option value="Pending" className="value-pending">Pending</option>
                        <option value="Accepted" className="value-accepted">Accepted</option>
                        <option value="Rejected" className="value-rejected">Rejected</option>
                      </select>
                    </td>
                    <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1>No Appointments Found!</h1>
          )}
        </div>
      </section>
    </>
  )
}

export default Dashboard;