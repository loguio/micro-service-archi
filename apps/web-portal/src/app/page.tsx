"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

interface LogEntry {
  time: string;
  type: "in" | "out" | "err";
  text: string;
}

export default function Home() {
  const [authStatus, setAuthStatus] = useState<"online" | "offline" | "checking">("checking");
  const [userStatus, setUserStatus] = useState<"online" | "offline" | "checking">("checking");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const authUrl = "http://localhost:3001";
  const userUrl = "http://localhost:3002";

  // Helper to add logs to the console
  const addLog = (type: "in" | "out" | "err", text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, type, text }]);
  };

  // Scroll console to bottom on new log
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Ping services health
  const checkHealth = async () => {
    // Check Auth Service
    try {
      setAuthStatus("checking");
      const res = await fetch(`${authUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        setAuthStatus("online");
      } else {
        setAuthStatus("offline");
      }
    } catch {
      setAuthStatus("offline");
    }

    // Check User Service
    try {
      setUserStatus("checking");
      const res = await fetch(`${userUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        setUserStatus("online");
      } else {
        setUserStatus("offline");
      }
    } catch {
      setUserStatus("offline");
    }
  };

  // Initial and periodic health checks
  useEffect(() => {
    checkHealth();
    addLog("out", "Initialized DevOps Playground Dashboard.");
    addLog("out", "Pinging microservices on host ports 3001 and 3002...");

    const interval = setInterval(() => {
      checkHealth();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch Login
  const handleLoginTest = async () => {
    addLog("in", "GET http://localhost:3001/login");
    try {
      const res = await fetch(`${authUrl}/login`);
      const data = await res.json();
      if (res.ok) {
        addLog("out", `Auth Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        addLog("err", `Auth Error: HTTP ${res.status} - ${JSON.stringify(data)}`);
      }
    } catch (e: any) {
      addLog("err", `Connection Failed to Auth Service: ${e.message}`);
    }
  };

  // Fetch Profile
  const handleProfileTest = async () => {
    addLog("in", "GET http://localhost:3002/profile");
    try {
      const res = await fetch(`${userUrl}/profile`);
      const data = await res.json();
      if (res.ok) {
        addLog("out", `User Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        addLog("err", `User Error: HTTP ${res.status} - ${JSON.stringify(data)}`);
      }
    } catch (e: any) {
      addLog("err", `Connection Failed to User Service: ${e.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("out", "Console cleared.");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className="gradient-text">DevOps & Clean Archi Playground</h1>
        <p>
          A minimalist microservice environment designed to test Docker setups,
          Dependabot integrations, and Clean Architecture port-mapped communications.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.techBadge}>TypeScript</span>
          <span className={styles.techBadge}>Next.js App Router</span>
          <span className={styles.techBadge}>NestJS API</span>
          <span className={styles.techBadge}>Docker Compose</span>
          <span className={styles.techBadge}>Dependabot</span>
        </div>
      </header>

      {/* Grid */}
      <main className={styles.grid}>
        {/* Auth Service Card */}
        <section className={`${styles.card} glass`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Auth Service</h2>
            <div className={styles.statusIndicator}>
              <span
                className={`${styles.statusCircle} ${
                  authStatus === "online" ? styles.online : styles.offline
                }`}
              />
              <span>
                {authStatus === "online"
                  ? "ONLINE"
                  : authStatus === "checking"
                  ? "Pinging..."
                  : "OFFLINE"}
              </span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>
              Handles authentications, tokens generation, and session checks. Built with NestJS.
            </p>
            <div className={styles.serviceInfo}>
              <span>Host URL: http://localhost:3001</span>
              <span>Dev Container: auth-service</span>
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleLoginTest}>
              Trigger Login Request
            </button>
          </div>
        </section>

        {/* User Service Card */}
        <section className={`${styles.card} glass`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>User Service</h2>
            <div className={styles.statusIndicator}>
              <span
                className={`${styles.statusCircle} ${
                  userStatus === "online" ? styles.online : styles.offline
                }`}
              />
              <span>
                {userStatus === "online"
                  ? "ONLINE"
                  : userStatus === "checking"
                  ? "Pinging..."
                  : "OFFLINE"}
              </span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>
              Manages profiles, configurations, and core user schema logic. Built with NestJS.
            </p>
            <div className={styles.serviceInfo}>
              <span>Host URL: http://localhost:3002</span>
              <span>Dev Container: user-service</span>
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleProfileTest}>
              Trigger Profile Request
            </button>
          </div>
        </section>
      </main>

      {/* Console Section */}
      <section className={`${styles.consoleWrapper} glass`}>
        <div className={styles.consoleHeader}>
          <div className={styles.consoleTitle}>
            <span>💻</span>
            <span>API Execution Console</span>
          </div>
          <div className={styles.consoleActions}>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={checkHealth} style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
              Ping Statuses
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={clearLogs} style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
              Clear
            </button>
          </div>
        </div>
        <div className={styles.console}>
          {logs.map((log, idx) => (
            <div key={idx} className={styles.consoleLog}>
              <span className={styles.consoleLogTime}>[{log.time}]</span>
              <span className={`${styles.consoleLogType} ${styles[log.type]}`}>
                {log.type === "in" ? "-->" : log.type === "out" ? "<--" : "ERR"}
              </span>
              <span>{log.text}</span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Clean Architecture Microservices Starter • Exposes direct localhost ports to host network</p>
      </footer>
    </div>
  );
}
