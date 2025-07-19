import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  Flex,
  HStack,
  IconButton,
  Image,
  Pagination,
  Portal,
  Separator,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState, useEffect, useCallback } from "react";
import { Streamer, StreamerData } from "@/types/interfaces/streamer.interface";
import { StreamerService } from "@/services/streamer.service";
import { BiDetail } from "react-icons/bi";
import { PLATFORM_ICON_MAP, PLATFORM_NAME_MAP } from "@/constants/platform";
import Link from "next/link";
import { FcSearch } from "react-icons/fc";
import { MdVerified } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { MdOutlineHourglassTop } from "react-icons/md";
import { TbCalendarPlus } from "react-icons/tb";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface StreamerListProps {
  isVerified: boolean; // 인증 여부
  platforms: string[]; // 선택된 플랫폼들
  searchName: string; // 검색어
  searchTrigger: number; // 검색 트리거 (변경될 때마다 API 재호출)
  description: string;
}

function formatUTCToKoreanDate(utc: string | null): string {
  if (!utc) return "";
  const timeZone = "Asia/Seoul"; // 한국 시간대
  const date = new Date(utc);
  const zonedDate = toZonedTime(date, timeZone);

  return format(zonedDate, "yyyy년 MM월 dd일");
}

// 빈 상태 컴포넌트
const EmptyState: React.FC<{ searchName: string; platforms: string[] }> = ({
  searchName,
  platforms,
}) => (
  <Table.Row>
    <Table.Cell colSpan={7} py={12}>
      <Flex direction="column" justify="center" align="center">
        <Box fontSize="48px" opacity={0.3} mb={3}>
          <FcSearch />
        </Box>
        <Box fontSize="lg" color="neutral.600" fontWeight="500" mb={3}>
          검색 결과가 없습니다
        </Box>
        <Box fontSize="sm" color="neutral.400" mb={2}>
          {searchName && `"${searchName}"`}
          {searchName && platforms.length > 0 && " · "}
          {platforms.length > 0 && `${platforms.join(", ")} 플랫폼`}
          {(searchName || platforms.length > 0) && "에 대한 "}
          스트리머를 찾을 수 없습니다
        </Box>
        <Box fontSize="xs" color="neutral.400">
          다른 검색어나 필터를 시도해보세요
        </Box>
      </Flex>
    </Table.Cell>
  </Table.Row>
);

const StreamerList: React.FC<StreamerListProps> = ({
  isVerified,
  platforms,
  searchName,
  searchTrigger,
  description,
}) => {
  const [data, setData] = useState<StreamerData>({
    data: [],
    totalCount: 0,
    page: 1,
    size: 15,
  });
  const [streamerDetail, setStreamerDetail] = useState<Streamer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // DTO에 맞춰 15로 변경

  console.log(streamerDetail);

  // API 호출 함수
  const fetchStreamers = useCallback(
    async (page: number = 1, qName: string = "") => {
      setIsLoading(true);
      setError(null);

      try {
        const requestBody = {
          isVerified,
          page,
          size: pageSize,
          ...(platforms.length > 0 && { platforms }),
          // ...(searchName.trim() && { qName: searchName.trim() }),
          ...(qName.trim() && { qName: qName.trim() }),
        };

        const response: StreamerData =
          await StreamerService.getStreamerList(requestBody);

        // 응답 구조: { code, content: { size, page, totalCount, data } }
        const content = response || {};

        console.log(content);

        setData({
          data: content.data || [],
          totalCount: content.totalCount || 0,
          page: content.page || page,
          size: content.size || pageSize,
        });

        setCurrentPage(page);
      } catch (error) {
        console.error("스트리머 목록 조회 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        );
        setData({
          data: [],
          totalCount: 0,
          page: 1,
          size: pageSize,
        });
      } finally {
        setIsLoading(false);
      }
    },
    // [isVerified, platforms, searchName, pageSize]
    [isVerified, platforms, pageSize],
  );

  // 필터 변경 시 첫 페이지로 이동하여 검색
  useEffect(() => {
    fetchStreamers(1, searchName);
    // }, [isVerified, platforms, searchTrigger, fetchStreamers]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platforms, searchTrigger]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    fetchStreamers(page, searchName);
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontFamily="body" fontSize="sm" color="neutral.400">
          {description}
        </Text>
        <Text fontSize="sm" color="neutral.400">
          {isLoading ? "로딩 중..." : `총 ${data.totalCount}명`}
        </Text>
      </Flex>

      {error && (
        <Text color="red.500" fontSize="sm" mb={2}>
          오류: {error}
        </Text>
      )}
      <Dialog.Root placement="center" size="sm">
        <Stack width="full" alignItems="center">
          <Table.Root
            key="outline"
            size="sm"
            variant="line"
            opacity={isLoading ? 0.5 : 1}
          >
            <Table.ColumnGroup>
              <Table.Column htmlWidth="50px" />
              <Table.Column />
              <Table.Column htmlWidth="84px" />
              {isVerified && <Table.Column htmlWidth="50px" />}
              <Table.Column htmlWidth="84px" />
              {isVerified && <Table.Column htmlWidth="84px" />}
              <Table.Column htmlWidth="40px" />
            </Table.ColumnGroup>
            <Table.Header>
              <Table.Row bg="neutral.100" borderTopWidth={1}>
                <Table.ColumnHeader py={1} textAlign="center">
                  번호
                </Table.ColumnHeader>
                <Table.ColumnHeader py={1} textAlign="center">
                  {/* 사진, 이름 */}
                  스트리머
                </Table.ColumnHeader>
                <Table.ColumnHeader px={0} py={1} textAlign="center">
                  플랫폼
                </Table.ColumnHeader>
                {isVerified && (
                  <Table.ColumnHeader px={0} py={1} textAlign="center">
                    팔로우
                  </Table.ColumnHeader>
                )}
                <Table.ColumnHeader px={0} py={1} textAlign="center">
                  등록일
                </Table.ColumnHeader>
                {isVerified && (
                  <Table.ColumnHeader
                    px={0}
                    py={1}
                    textAlign="center"
                    width="fit-content"
                  >
                    인증일
                  </Table.ColumnHeader>
                )}
                <Table.ColumnHeader
                  paddingLeft={0}
                  paddingRight={2}
                  py={1}
                  textAlign="center"
                >
                  상세
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.data.length === 0 ? (
                // 빈 상태
                <EmptyState searchName={searchName} platforms={platforms} />
              ) : (
                // 실제 데이터
                data.data.map((item, idx) => (
                  <Table.Row key={item.uuid} fontSize="sm">
                    <Table.Cell textAlign="center" py={1} fontSize="xs">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </Table.Cell>
                    <Table.Cell py={1}>{item.name}</Table.Cell>
                    <Table.Cell px={0} py={1}>
                      <Flex gap={1} justify="center">
                        {item.platforms?.map((p) => (
                          <Link
                            key={p.channelUrl}
                            href={p.channelUrl}
                            target="_blank"
                          >
                            <Image
                              w={4}
                              h={4}
                              src={PLATFORM_ICON_MAP[p.platformName]}
                              alt={`${p.platformName} icon`}
                              cursor="pointer"
                              _hover={{ opacity: 0.7 }}
                            />
                          </Link>
                        ))}
                      </Flex>
                    </Table.Cell>
                    {isVerified && (
                      <Table.Cell
                        textAlign="center"
                        px={0}
                        py={1}
                        fontSize="xs"
                      >
                        {item.followCount.toLocaleString() || 0}
                      </Table.Cell>
                    )}
                    <Table.Cell textAlign="center" px={0} py={1} fontSize="xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    {isVerified && (
                      <Table.Cell
                        textAlign="center"
                        px={0}
                        py={1}
                        fontSize="xs"
                      >
                        {new Date(item.verifiedAt).toLocaleDateString()}
                      </Table.Cell>
                    )}
                    <Table.Cell paddingLeft={0} paddingRight={2} py={1}>
                      <Flex justify="center" align="center">
                        <Dialog.Trigger asChild>
                          <IconButton
                            variant="ghost"
                            size="xs"
                            p={0}
                            aria-label="스트리머 상세 정보 보기"
                            onClick={() => setStreamerDetail(item)}
                          >
                            <BiDetail />
                          </IconButton>
                        </Dialog.Trigger>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>

          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content px={2} py={5}>
                <Dialog.Body>
                  {streamerDetail && (
                    <Stack>
                      {/* 상단 */}
                      <HStack spaceX={3} marginBottom={6}>
                        <Image
                          src="https://bit.ly/naruto-sage"
                          boxSize="120px"
                          borderRadius="full"
                          fit="cover"
                          alt="Naruto Uzumaki"
                        />
                        <Stack>
                          <Text
                            fontFamily="heading"
                            fontSize="xl"
                            fontWeight={500}
                            color="neutral.900"
                          >
                            {streamerDetail.name}
                          </Text>
                          {streamerDetail.isVerified ? (
                            <HStack gapX={3}>
                              <HStack gapX={1}>
                                <Box
                                  as={MdVerified}
                                  boxSize={4}
                                  color="blue.500"
                                />
                                <Text fontSize="xs">VERIFIED</Text>
                              </HStack>
                              <HStack gapX={1} color="neutral.500">
                                <Box as={GoPeople} boxSize={4} />
                                <Text fontSize="xs">
                                  {streamerDetail.followCount.toLocaleString()}
                                </Text>
                              </HStack>
                            </HStack>
                          ) : (
                            <HStack gapX={1}>
                              <Box
                                as={MdOutlineHourglassTop}
                                boxSize={4}
                                color="orange.500"
                              />
                              <Text fontSize="xs">PENDING</Text>
                            </HStack>
                          )}
                        </Stack>
                      </HStack>

                      {/* ABOUT - description */}
                      <Field.Root marginBottom={4}>
                        <Field.Label
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight={600}
                        >
                          ABOUT
                        </Field.Label>
                        <Text fontFamily="body" fontSize="sm" fontWeight={300}>
                          {streamerDetail.description}
                        </Text>
                      </Field.Root>

                      {/* PLATFORMS */}
                      <Field.Root marginBottom={4}>
                        <Field.Label
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight={600}
                        >
                          PLATFORMS
                        </Field.Label>
                        <HStack>
                          {streamerDetail.platforms?.map((p) => (
                            <Button
                              variant="outline"
                              key={p.channelUrl}
                              size="sm"
                              asChild
                              fontFamily="body"
                              fontSize="xs"
                            >
                              <a href={p.channelUrl}>
                                <Image
                                  w={4}
                                  h={4}
                                  src={PLATFORM_ICON_MAP[p.platformName]}
                                  alt={`${p.platformName} icon`}
                                  cursor="pointer"
                                  _hover={{ opacity: 0.7 }}
                                />
                                {PLATFORM_NAME_MAP[p.platformName]} 방문하기
                              </a>
                            </Button>
                          ))}
                        </HStack>
                      </Field.Root>

                      <Separator marginBottom={1} />

                      {/* DATE */}
                      <Stack gap={1}>
                        {streamerDetail.createdAt && (
                          <HStack>
                            <Box
                              as={TbCalendarPlus}
                              boxSize={4}
                              color="neutral.500"
                            />
                            <Text
                              fontFamily="body"
                              fontSize="xs"
                              fontWeight={300}
                            >
                              Registered{" "}
                              {formatUTCToKoreanDate(streamerDetail.createdAt)}
                            </Text>
                          </HStack>
                        )}
                        {streamerDetail.isVerified && (
                          <HStack>
                            <Box
                              as={MdVerified}
                              boxSize={4}
                              color="neutral.500"
                            />
                            <Text
                              fontFamily="body"
                              fontSize="xs"
                              fontWeight={300}
                            >
                              Verified{" "}
                              {formatUTCToKoreanDate(streamerDetail.verifiedAt)}
                            </Text>
                          </HStack>
                        )}
                      </Stack>
                    </Stack>
                  )}
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button>Save</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>

          {data.totalCount > pageSize && (
            <Pagination.Root
              count={data.totalCount}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={(details) => handlePageChange(details.page)}
            >
              <ButtonGroup variant="outline" size="sm" wrap="wrap">
                <Pagination.PrevTrigger asChild>
                  <IconButton disabled={isLoading}>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                    <IconButton
                      variant={{ base: "outline", _selected: "solid" }}
                      disabled={isLoading}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton disabled={isLoading}>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          )}
        </Stack>
      </Dialog.Root>
    </>
  );
};

export default StreamerList;
