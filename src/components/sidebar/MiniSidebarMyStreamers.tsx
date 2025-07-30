import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { Avatar, defineStyle, Text, VStack } from "@chakra-ui/react";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "green.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const MiniSidebarMyStreamers = () => {
  const { streamers, toggleIsActive } = useMyStreamersStore();

  return (
    <VStack>
      <VStack gap={0}>
        <Text
          fontSize="xs"
          color="neutral.500"
          lineHeight={1.1}
          textAlign="center"
        >
          관심
          <br />
          스트리머
        </Text>
      </VStack>
      <VStack gap={1}>
        {streamers.map((streamer) => (
          <VStack key={streamer.uuid} gap={1}>
            <Avatar.Root
              css={streamer.isActive && ringCss}
              cursor="pointer"
              onClick={() => toggleIsActive(streamer.uuid)}
            >
              <Avatar.Fallback name="Segun Adebayo" />
              <Avatar.Image src={"/default-image.png"} />
            </Avatar.Root>
            <Text fontSize="xs">{streamer.name}</Text>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default MiniSidebarMyStreamers;
