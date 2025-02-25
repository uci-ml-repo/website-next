"use client";

import axios from "axios";
import * as React from "react";

import { Main } from "@/components/layout/Main";

export default function Test() {
  axios.post("/api/static/private/test.txt").then((response) => {
    console.log(response.data);
  });

  return <Main>TEST</Main>;
}
