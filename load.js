import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
};

export default function () {
  const random = Math.floor(Math.random() * 1000000000);

  const payload = JSON.stringify({
    name: `User ${random}`,
    email: `user${random}@test.com`,
    password: "123456",
    phone: `+9198${String(random).padStart(8, "0").slice(0, 8)}`,
  });

  const res = http.post(
    "http://localhost:5005/api/auth/register",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Status:", res.status);
  console.log("Error :", res.error);
  console.log("Body  :", res.body);

  check(res, {
    "status is 201": (r) => r.status === 201,
  });
}