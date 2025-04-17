"use client";  // ✅ Make this a client component

import { SessionProvider } from "next-auth/react";

const SessionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
