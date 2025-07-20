// src/components/schedule/StatusSelector.tsx
"use client";

import { Grid, Button } from "@chakra-ui/react";

interface StatusSelectorProps {
  selectedStatus: "BREAK" | "TIME_TBD" | "SCHEDULED";
  onStatusChange: (status: "BREAK" | "TIME_TBD" | "SCHEDULED") => void;
}

const StatusSelector = ({
  selectedStatus,
  onStatusChange,
}: StatusSelectorProps) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "예정";
      case "BREAK":
        return "휴방";
      case "TIME_TBD":
        return "시간 미정";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "accent.live";
      case "BREAK":
        return "accent.break";
      case "TIME_TBD":
        return "accent.timeTbd";
      default:
        return "neutral.400";
    }
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
      {(["SCHEDULED", "BREAK", "TIME_TBD"] as const).map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "solid" : "outline"}
          bg={
            selectedStatus === status ? getStatusColor(status) : "primary.white"
          }
          color={selectedStatus === status ? "primary.white" : "neutral.700"}
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => onStatusChange(status)}
          fontSize="sm"
          fontWeight="500"
          h={10}
        >
          {getStatusLabel(status)}
        </Button>
      ))}
    </Grid>
  );
};

export default StatusSelector;
