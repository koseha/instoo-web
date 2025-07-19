// components/common/EmptyState.tsx
import { Box, Flex, Table } from "@chakra-ui/react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  colSpan?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  colSpan = 7,
}) => {
  return (
    <Table.Row>
      <Table.Cell colSpan={colSpan} py={12}>
        <Flex direction="column" justify="center" align="center">
          {icon && (
            <Box fontSize="48px" opacity={0.3} mb={3}>
              {icon}
            </Box>
          )}
          <Box fontSize="lg" color="neutral.600" fontWeight="500" mb={3}>
            {title}
          </Box>
          {description && (
            <Box fontSize="sm" color="neutral.400" textAlign="center">
              {description}
            </Box>
          )}
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};

export default EmptyState;
