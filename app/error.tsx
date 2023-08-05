"use client";

import { useEffect } from "react";
import EmptyState from "./components/shared/EmptyState";

interface ErrorStateProps {
  error: Error;
}
const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <EmptyState
      title="Ups"
      subtitle="Something went wrong( check the console.log.This is a client component) "
    />
  );
};
export default ErrorState;
