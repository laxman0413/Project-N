import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editStatus, setEditStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data on load
  useEffect(() => {
    const fetchJobsAndTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          return;
        }

        // Fetch jobs
        const jobsResponse = await axios.get("http://localhost:3001/admin/getjobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsResponse.data);

        // Fetch tickets
        const ticketsResponse = await axios.get("http://localhost:3001/admin/gettickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(ticketsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchJobsAndTickets();
  }, []);

  // Handle job selection
  const handleJobClick = (job) => setSelectedJob(job);

  // Handle ticket selection
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.TicketStatus); // Pre-fill status for editing
    setIsEditing(false);
  };

  // Save the edited ticket status
  const saveTicketStatus = async () => {
    if (!selectedTicket) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      // Update the ticket status
      const updatedTicket = { ...selectedTicket, TicketStatus: editStatus };
      await axios.put(`http://localhost:3001/admin/updateticket/${selectedTicket.TicketId}`, updatedTicket, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the tickets array locally
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.TicketId === selectedTicket.TicketId ? updatedTicket : ticket
        )
      );

      setSelectedTicket(updatedTicket);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Failed to update ticket. Please try again later.");
    }
  };

  // Filter tickets based on status
  const filteredTickets =
    statusFilter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.TicketStatus === statusFilter);

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="content-container">
        {/* Job Section */}
        <div className="jobs-section">
          <h3>Job Listings</h3>
          <div className="scrollable-list">
            <table className="job-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Job Title</th>
                  <th>Posted By</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id} onClick={() => handleJobClick(job)} className="job-row">
                      <td>{job.id}</td>
                      <td>{job.jobTitle}</td>
                      <td>{job.providerName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No jobs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {selectedJob && (
            <div className="details-container">
              <h3>Job Details</h3>
              <p><strong>ID:</strong> {selectedJob.id}</p>
              <p><strong>Title:</strong> {selectedJob.jobTitle}</p>
              <p><strong>Payment:</strong> ${selectedJob.payment}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              {selectedJob.images && <img src={selectedJob.images} alt="Job" className="job-image" />}
            </div>
          )}
        </div>

        {/* Ticket Section */}
        <div className="tickets-section">
          <h3>Tickets</h3>
          <div className="filter-container">
            <label>Filter:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="scrollable-list">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.TicketId} onClick={() => handleTicketClick(ticket)} className="ticket-row">
                      <td>{ticket.TicketId}</td>
                      <td>{ticket.TicketOwner}</td>
                      <td>{ticket.TicketStatus}</td>
                      <td>{ticket.Title}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {selectedTicket && (
            <div className="details-container">
              <h3>Ticket Details</h3>
              <p><strong>ID:</strong> {selectedTicket.TicketId}</p>
              <p><strong>Owner:</strong> {selectedTicket.TicketOwner}</p>
              <p><strong>Title:</strong> {selectedTicket.Title}</p>
              <p><strong>Status:</strong> {isEditing ? (
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                selectedTicket.TicketStatus
              )}</p>
              <p><strong>Description:</strong> {selectedTicket.Description || "No description provided"}</p>
              {isEditing ? (
                <div className="action-buttons">
                  <button onClick={saveTicketStatus} className="save-button">Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
