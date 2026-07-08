// ===================================================================
// API FILE
// ===================================================================
// This is the ONLY file that talks to the backend. Pages never call
// fetch() themselves - they call the functions below instead.
//
// RIGHT NOW: every function returns mock/fake data so the app works
// without a backend.
//
// LATER: once your FastAPI server is running, delete the mock line
// in each function and uncomment the fetch() call above it.
// ===================================================================

import { mockUser, mockSessions } from "../data/mockData";

// Update this if your FastAPI server runs somewhere else.
const BASE_URL = "http://127.0.0.1:8000";

// FastAPI Endpoint:
// POST /register
export async function registerUser(username, email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  return data;
}

// FastAPI Endpoint:
// POST /login
export async function loginUser(email, password) {
  const params = new URLSearchParams();

  params.set("username", email);
  params.set("password", password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json()

  localStorage.setItem("token", data.access_token)
  return data;
}

// FastAPI Endpoint:
// GET /me
// (Not called anywhere yet - useful later once you add real login
// sessions/tokens and want to check "who is currently logged in".)
export async function getCurrentUser() {
  const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if(!response.ok){
    throw new Error("Invalid or expired Token !");
  }

  const data = await response.json()
  return data;

}

// FastAPI Endpoint:       
// GET /sessions 
export async function getSessions(sessionData = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sessionData)){
    if(value === "" || value === null || value === undefined){
      continue;
    }
    params.set(key, value);
  }

  let paramString = params.toString();
  if (paramString!==""){
    paramString = `?${paramString}`;
  }

  const token = localStorage.getItem("token")

  const response = await fetch(`${BASE_URL}/sessions${paramString}`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data;

}

// FastAPI Endpoint:
// POST /sessions
export async function addSession(sessionData) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/sessions`,{
    method: "POST",
    headers: {"Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(sessionData)
  });
  const data = await response.json();
  return data;
}

// FastAPI Endpoint:
// PATCH /sessions/{id}
export async function updateSession(id, updatedFields) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
     },
    body: JSON.stringify(updatedFields),
  });

  if(!response.ok){
    alert("Session Not Found !");
  }

  const data = await response.json();
  return data;
}

// FastAPI Endpoint:
// DELETE /sessions/{id}
export async function deleteSession(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/sessions/${id}`, {
    method: "DELETE",
    headers: {"Authorization": `Bearer ${token}`}
  });

  if(!response.ok){
    alert("Session Not Found !");
  }

}
