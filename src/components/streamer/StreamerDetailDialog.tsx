import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Image,
  Portal,
  Separator,
  Stack,
  Text,
  Timeline,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { TbCalendarPlus } from "react-icons/tb";
import { Streamer } from "@/types/interfaces/streamer.interface";
import { PLATFORM_ICON_MAP, PLATFORM_NAME_MAP } from "@/constants/platform";
import { formatUTCToKoreanDate } from "@/utils/time.utils";
import { FaUserPlus, FaUserCheck } from "react-icons/fa6";
import { useStreamerFollow } from "@/hooks/useStreamerFollow";

interface StreamerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  streamer: Streamer | null;
}

const StreamerDetailDialog: React.FC<StreamerDetailDialogProps> = ({
  isOpen,
  onClose,
  streamer,
}) => {
  const { toggleFollow, getFollowState, syncToServer } = useStreamerFollow();

  // 모달이 닫힐 때 API 동기화 (한 곳에서만 처리)
  const handleClose = async () => {
    if (streamer) {
      await syncToServer(streamer.uuid, streamer.isFollowed);
    }
    onClose();
  };

  if (!streamer) return null;

  // 현재 팔로우 상태 계산
  const { isFollowed, followCount } = getFollowState(
    streamer.uuid,
    streamer.isFollowed,
    streamer.followCount,
  );

  // 원본 상태로 토글 (중요!)
  const handleFollowClick = () => {
    toggleFollow(streamer.uuid, streamer.isFollowed, streamer.followCount);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && handleClose()}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content px={2} py={5}>
            <Dialog.Body>
              <Stack>
                {/* 프로필 */}
                <HStack spaceX={3} marginBottom={4}>
                  <Image
                    src="https://bit.ly/naruto-sage"
                    boxSize="120px"
                    borderRadius="full"
                    fit="cover"
                    alt={`${streamer.name} profile`}
                  />
                  <Stack>
                    <Text
                      fontFamily="heading"
                      fontSize="xl"
                      fontWeight={500}
                      color="neutral.900"
                    >
                      {streamer.name}
                    </Text>
                    {streamer.isVerified ? (
                      <HStack gapX={3}>
                        <HStack gapX={1}>
                          <Box as={MdVerified} boxSize={4} color="blue.600" />
                          <Text fontSize="xs">관리자 인증</Text>
                        </HStack>
                        <HStack gapX={1} color="neutral.500">
                          <Box as={GoPeople} boxSize={4} />
                          <Text fontSize="xs">
                            {followCount?.toLocaleString() || 0}
                          </Text>
                        </HStack>
                      </HStack>
                    ) : (
                      <HStack gapX={1}>
                        <Box as={MdVerified} boxSize={4} />
                        <Text fontSize="xs">관리자 인증 요청 중</Text>
                      </HStack>
                    )}
                  </Stack>
                </HStack>

                <Button
                  w="full"
                  size="md"
                  variant="surface"
                  marginBottom={4}
                  colorPalette={isFollowed ? "blue" : "gray"}
                  onClick={handleFollowClick}
                >
                  {isFollowed ? (
                    <>
                      <FaUserCheck />
                      팔로잉
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      팔로우
                    </>
                  )}
                </Button>

                {/* 소개 */}
                <Field.Root marginBottom={4}>
                  <Field.Label
                    fontFamily="heading"
                    fontSize="sm"
                    fontWeight={600}
                  >
                    ABOUT
                  </Field.Label>
                  <Text fontFamily="body" fontSize="sm" fontWeight={300}>
                    {streamer.description || "소개글이 없습니다."}
                  </Text>
                </Field.Root>

                {/* 플랫폼 */}
                <Field.Root marginBottom={4}>
                  <Field.Label
                    fontFamily="heading"
                    fontSize="sm"
                    fontWeight={600}
                  >
                    PLATFORMS
                  </Field.Label>
                  <HStack>
                    {streamer.platforms?.map((platform) => (
                      <Button
                        variant="outline"
                        key={platform.channelUrl}
                        size="sm"
                        asChild
                        fontFamily="body"
                        fontSize="xs"
                      >
                        <a
                          href={platform.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            w={4}
                            h={4}
                            src={PLATFORM_ICON_MAP[platform.platformName]}
                            alt={`${platform.platformName} icon`}
                          />
                          {PLATFORM_NAME_MAP[platform.platformName]} 방문하기
                        </a>
                      </Button>
                    ))}
                  </HStack>
                </Field.Root>

                <Separator marginBottom={2} />

                {/* 이력 */}
                <Field.Root>
                  <Field.Label
                    fontFamily="heading"
                    fontSize="sm"
                    fontWeight={600}
                    marginBottom={2}
                  >
                    HISTORY
                  </Field.Label>
                  <Timeline.Root size="sm">
                    {streamer.isVerified && streamer.verifiedAt && (
                      <Timeline.Item>
                        <Timeline.Connector>
                          <Timeline.Separator />
                          <Timeline.Indicator>
                            <MdVerified />
                          </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content paddingBottom={3}>
                          <Timeline.Title>관리자 인증 완료</Timeline.Title>
                          <Timeline.Description>
                            {formatUTCToKoreanDate(streamer.verifiedAt)}
                          </Timeline.Description>
                        </Timeline.Content>
                      </Timeline.Item>
                    )}
                    <Timeline.Item>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <TbCalendarPlus />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content paddingBottom={3}>
                        <Timeline.Title>팬 등록 완료</Timeline.Title>
                        <Timeline.Description>
                          <HStack as="span" color="gray.500">
                            {formatUTCToKoreanDate(streamer.createdAt)}
                            <Separator
                              size="md"
                              orientation="vertical"
                              height="4"
                            />
                            <Box as="span" color="blue.400" fontWeight={400}>
                              {streamer.createdBy?.nickname}
                            </Box>
                          </HStack>
                        </Timeline.Description>
                      </Timeline.Content>
                    </Timeline.Item>
                  </Timeline.Root>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            {/* CloseButton에서 onClick 제거 */}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default StreamerDetailDialog;
