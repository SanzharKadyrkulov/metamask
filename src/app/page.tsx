"use client";
import HomePage from "@/pages/HomePage";
import { SnackbarProvider } from "notistack";

export default function Home() {
  return (
    <SnackbarProvider maxSnack={3}>
      <HomePage />
    </SnackbarProvider>
  );
}
