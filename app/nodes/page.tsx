"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation'

const Nodes = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/")
  }, [router])
};

export default Nodes
