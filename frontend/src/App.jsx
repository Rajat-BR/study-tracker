import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { getCurrentUser, getSessions, addSession, updateSession, deleteSession } from "./api/api";

// -------------------------------------------------------------------
// App.jsx is the ONLY place that holds global state:
//   - currentPage:  which page is visible ("login" | "register" | "dashboard")
//   - currentUser:  the logged-in user, or null if nobody is logged in
//   - sessions:     the list of study sessions
//
// Pages do not manage this data themselves. They receive it as props
// and call the functions below (e.g. handleAddSession) to change it.
// This keeps the data flow easy to follow: one direction, one source
// of truth, no Context API / Redux needed.
// -------------------------------------------------------------------
function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [sort_by, setSort] = useState("id");
  
  //-----------------useEffect Hooks---------------------------------
  //automatically login if there is a valid token in the localStorage
  useEffect(()=>{
    const getUser = async () => {
      const token = localStorage.getItem("token");
        if(!token) return;
        try{
          const user = await getCurrentUser();
          await handleLoginSuccess(user);
        }
        catch (error) {
          console.error(error);
          localStorage.removeItem("token");
          setCurrentUser(null);
          setSessions([]);
        }
    };
    getUser();  
  },[]);

  // Hook to look for changes in the states
  useEffect(() => {
    loadSessions();
  },[sort_by]);

  //Hook for debouncing search
  const DEBOUNCE_DELAY = 400
  
  useEffect(()=>{
    const timer = setTimeout(()=>{
      loadSessions();
    },DEBOUNCE_DELAY);
    return ()=>{
      clearTimeout(timer);
    };
  },[search]);

  // Called by LoginPage after a successful login
  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);

    // FastAPI Endpoint:
    // GET /sessions
    const fetchedSessions = await getSessions();
    setSessions(fetchedSessions);

    setCurrentPage("dashboard");
  };

  // Called by DashboardPage when the user clicks "Logout"
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setSessions([]);
    setCurrentPage("login");
  };

  const loadSessions = async () => {
    // FastAPI GET /sessions
    const fetchedSessions = await getSessions({search, sort_by}); 
    setSessions(fetchedSessions);
  };

  // Called by DashboardPage's form when adding a new session
  const handleAddSession = async (sessionData) => {
    // FastAPI Endpoint:
    // POST /sessions
    const savedSession = await addSession(sessionData);
    setSessions([...sessions, savedSession]);
  };

  // Called by DashboardPage's form when saving edits to a session
  const handleUpdateSession = async (id, updatedFields) => {
    // FastAPI Endpoint:
    // PATCH /sessions/{id}
    const updated = await updateSession(id, updatedFields);
    setSessions(
      sessions.map((session) =>
        session.id === id ? { ...session, ...updated } : session
      )
    );
  };

  // Called by DashboardPage when the user clicks "Delete" on a session
  const handleDeleteSession = async (id) => {
    // FastAPI Endpoint:
    // DELETE /sessions/{id}
    await deleteSession(id);
    setSessions(sessions.filter((session) => session.id !== id));
  };

  // Simple page switcher - no routing library needed for 3 pages
  return (
    <div className="app-container">
      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          goToRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage goToLogin={() => setCurrentPage("login")} />
      )}

      {currentPage === "dashboard" && (
        <DashboardPage
          user={currentUser}
          sessions={sessions}
          onLogout={handleLogout}
          onAddSession={handleAddSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
          search={search}
          setSearch={setSearch}
          onSearch={loadSessions}
          sort={sort_by}
          setSort={setSort}
        />
      )}
    </div>
  );
}

export default App;
