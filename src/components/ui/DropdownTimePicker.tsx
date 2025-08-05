import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  Grid,
  PopoverPositioner,
  ButtonProps,
} from "@chakra-ui/react";
import { MdAccessTime } from "react-icons/md";

interface DropdownTimePickerProps extends Omit<ButtonProps, "onChange"> {
  value?: string; // HH:MM 형식 (24시간)
  onChange?: (time: string) => void; // HH:MM 형식 (24시간)으로 반환
}

const DropdownTimePicker: React.FC<DropdownTimePickerProps> = ({
  value,
  onChange,
  ...props
}) => {
  // 24시간 형식 값을 12시간 형식으로 변환하여 상태 초기화
  const initializeTime = (timeValue: string | undefined) => {
    if (!timeValue) return { hour: 12, minute: 0, period: "AM" };

    const [hourStr, minuteStr] = timeValue.split(":");
    const hour24 = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    let hour12, period;
    if (hour24 === 0) {
      hour12 = 12;
      period = "AM";
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = "AM";
    } else if (hour24 === 12) {
      hour12 = 12;
      period = "PM";
    } else {
      hour12 = hour24 - 12;
      period = "PM";
    }

    return { hour: hour12, minute, period };
  };

  const initialTime = initializeTime(value);
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);
  const { open, onOpen, onClose } = useDisclosure();

  // 12시간 형식: 1-12
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleTimeChange = (
    newHour: number,
    newMinute: number,
    newPeriod: string,
  ) => {
    // 12시간 형식을 24시간 형식으로 변환
    const hour24 =
      newPeriod === "PM" && newHour !== 12
        ? newHour + 12
        : newPeriod === "AM" && newHour === 12
          ? 0
          : newHour;
    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}`;
    onChange?.(timeString);
  };

  // 12시간 형식으로 표시
  const displayTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;

  return (
    <PopoverRoot
      open={open}
      onOpenChange={(details) => (details.open ? onOpen() : onClose())}
      positioning={{ placement: "bottom-start" }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          justifyContent="flex-start"
          w="200px"
          {...props}
        >
          <MdAccessTime />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverPositioner zIndex={9999}>
        <PopoverContent w="300px">
          <PopoverBody p={4}>
            <Grid templateColumns="1fr 1fr 1fr" gap={4} alignItems="center">
              <VStack>
                <Text fontSize="sm" fontWeight="bold">
                  시간
                </Text>
                <Box
                  maxH="120px"
                  overflowY="auto"
                  border="1px"
                  borderColor="gray.200"
                  rounded="md"
                >
                  {hours.map((h) => (
                    <Button
                      key={h}
                      variant={hour === h ? "solid" : "ghost"}
                      colorScheme={hour === h ? "blue" : "gray"}
                      size="sm"
                      w="full"
                      onClick={() => {
                        setHour(h);
                        handleTimeChange(h, minute, period);
                      }}
                    >
                      {h}
                    </Button>
                  ))}
                </Box>
              </VStack>

              <VStack>
                <Text fontSize="sm" fontWeight="bold">
                  분
                </Text>
                <Box
                  maxH="120px"
                  overflowY="auto"
                  border="1px"
                  borderColor="gray.200"
                  rounded="md"
                >
                  {minutes
                    .filter((m) => m % 5 === 0)
                    .map((m) => (
                      <Button
                        key={m}
                        variant={minute === m ? "solid" : "ghost"}
                        colorScheme={minute === m ? "blue" : "gray"}
                        size="sm"
                        w="full"
                        onClick={() => {
                          setMinute(m);
                          handleTimeChange(hour, m, period);
                        }}
                      >
                        {m.toString().padStart(2, "0")}
                      </Button>
                    ))}
                </Box>
              </VStack>

              <VStack>
                <Text fontSize="sm" fontWeight="bold">
                  오전/오후
                </Text>
                <VStack gap={2}>
                  <Button
                    variant={period === "AM" ? "solid" : "outline"}
                    colorScheme="blue"
                    size="sm"
                    w="full"
                    onClick={() => {
                      setPeriod("AM");
                      handleTimeChange(hour, minute, "AM");
                    }}
                  >
                    오전
                  </Button>
                  <Button
                    variant={period === "PM" ? "solid" : "outline"}
                    colorScheme="blue"
                    size="sm"
                    w="full"
                    onClick={() => {
                      setPeriod("PM");
                      handleTimeChange(hour, minute, "PM");
                    }}
                  >
                    오후
                  </Button>
                </VStack>
              </VStack>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default DropdownTimePicker;
