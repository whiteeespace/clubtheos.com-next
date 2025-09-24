"use client";

import MicrosoftClarity from "@microsoft/clarity";
import React, { useEffect } from "react";

const Clarity: React.FC = () => {
  useEffect(() => {
    MicrosoftClarity.init("ph2shd5o0v");
  }, []);

  return null;
};

export default Clarity;
