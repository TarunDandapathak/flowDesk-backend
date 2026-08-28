import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "30s", target: 100 },
    { duration: "50s", target: 500 },
    { duration: "80s", target: 1000 },
    { duration: "90s", target: 5000 },
  ],
};

export default function () {

  // 1. Login
  const loginResponse = http.post(
    "http://localhost:8080/api/auth/user/login",
    JSON.stringify({
      email: "tarundandapathak@gmail.com",
      password: "1234",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(loginResponse, {
    "Login successful": (r) => r.status === 200,
  });

  // 2. Add Task
  const taskResponse = http.post(
    "http://localhost:8080/api/user/task",
    JSON.stringify({
      title: "K6 Load Test Task",
      description: "Task created during load testing",
      dueDate: "2026-08-30T18:30:00.000Z",
      status: "pending",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(taskResponse, {
    "Task created": (r) =>
      r.status === 200 || r.status === 201,
  });

  sleep(1);
}