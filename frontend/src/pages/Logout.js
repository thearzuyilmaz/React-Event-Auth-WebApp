import { redirect } from "react-router-dom";

// not a component just the action function

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  return redirect("/");
}
