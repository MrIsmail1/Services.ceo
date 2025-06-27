import { redirect } from "next/navigation";

export default function PublicHome() {
  redirect("/services");
  return null;
}
