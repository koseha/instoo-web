"use client";

import Sidebar from "../sidebar/Sidebar";
import MiniSidebar from "../sidebar/MiniSidebar";
import { useInteractiveSidebar } from "@/stores/interactive-sidebar.store";

const InteractiveSidebar = () => {
  const { isOpen } = useInteractiveSidebar();

  return isOpen ? <Sidebar /> : <MiniSidebar />;
};

export default InteractiveSidebar;
