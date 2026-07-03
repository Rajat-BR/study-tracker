import { useState } from "react";

// -------------------------------------------------------------------
// Dashboard Page
//   - Welcome message + Logout button
//   - A form to add a new session (or edit an existing one)
//   - A list of sessions, each with Edit and Delete buttons
//
// Note: this component DOES use useState, but only for the form
// inputs (subject, topic, etc.) and which session is being edited.
// That is local UI state, not app data - the actual list of
// sessions still lives in App.jsx and is passed in as a prop.
// -------------------------------------------------------------------
function DashboardPage({
  user,
  sessions,
  onLogout,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  search,
  setSearch,
  onSearch,
}) {
  // Form field state
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  // editingId is null while adding a new session.
  // When the user clicks "Edit" on a session, we store that
  // session's id here and pre-fill the form with its data.
  const [editingId, setEditingId] = useState(null);

  const clearForm = () => {
    setSubject("");
    setTopic("");
    setDuration("");
    setNotes("");
    setEditingId(null);
  };

  // One form handles both "add" and "edit" - simpler than having
  // two separate forms/components for almost the same fields.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionData = {
      subject,
      topic,
      duration: Number(duration),
      notes,
    };

    if (editingId === null) {
      await onAddSession(sessionData); // -> POST /sessions (see api.js)
    } else {
      await onUpdateSession(editingId, sessionData); // -> PATCH /sessions/{id}
    }

    clearForm();
  };

  // Fill the form with an existing session so the user can change it
  const startEditing = (session) => {
    setEditingId(session.id);
    setSubject(session.subject);
    setTopic(session.topic);
    setDuration(session.duration);
    setNotes(session.notes);
  };

  const handleDelete = (id) => {
    onDeleteSession(id); // -> DELETE /sessions/{id}
    if (editingId === id) clearForm(); // don't leave a stale edit form open
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h2>Welcome, {user ? user.username : "Student"}!</h2>
        <button onClick={onLogout} className="btn btn-ghost">
          Logout
        </button>
      </div>

      <div className="form-card">
        <h3 className="form-card-title">
          {editingId === null ? "Add Study Session" : "Edit Study Session"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId === null ? "Add Session" : "Save Changes"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={clearForm} className="link-button">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="sessions-section">
        <h3 className="section-title">Your Study Sessions</h3>
        <input id = "search-box"
          type="search"
          placeholder="Search Sessions.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter"){
              onSearch();
            }
          }}/>

        {sessions.length === 0 ? (
          <p className="empty-state">No study sessions yet. Add one above!</p>
        ) : (
          <ul className="sessions-grid">
            {sessions.map((session) => (
              <li key={session.id} className="session-card">
                <div className="session-card-top">
                  <strong className="session-subject">
                    📚 {session.subject}
                  </strong>
                  <span className="session-duration">
                    ⏱ {session.duration} min
                  </span>
                </div>

                <p className="session-topic">{session.topic}</p>

                {session.notes && (
                  <p className="session-notes">Notes: {session.notes}</p>
                )}

                <div className="session-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => startEditing(session)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(session.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
