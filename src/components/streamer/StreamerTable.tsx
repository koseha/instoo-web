"use client";

import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Group,
  IconButton,
  Image,
  Pagination,
  Popover,
  Portal,
  Stack,
  Table,
  VStack,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { BiDetail } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import { FcSearch } from "react-icons/fc";
import Link from "next/link";
import EmptyState from "../common/EmptyState";
import StreamerDetailDialog from "./StreamerDetailDialog";
import { Streamer } from "@/types/interfaces/streamer.interface";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { StreamerService } from "@/services/streamer.service";
import { useAuthStore } from "@/stores/auth.store";
import StreamerDialog, { StreamerRegisterData } from "./RegisterStreamerDialog";

interface StreamerTableProps {
  streamers: Streamer[];
  isVerified: boolean;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  searchName: string;
  platforms: string[];
  onPageChange: (page: number) => void;
}

const StreamerTable: React.FC<StreamerTableProps> = React.memo(
  ({
    streamers,
    isVerified,
    isLoading,
    currentPage,
    pageSize,
    totalCount,
    searchName,
    platforms,
    onPageChange,
  }) => {
    const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(
      null,
    );
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { user } = useAuthStore();

    const columnCount = isVerified ? 7 : 5;

    const getEmptyDescription = useCallback(() => {
      const parts = [];
      if (searchName) parts.push(`"${searchName}"`);
      if (platforms.length > 0) parts.push(`${platforms.join(", ")} 플랫폼`);

      const searchPart = parts.join(" · ");
      return searchPart
        ? `${searchPart}에 대한 스트리머를 찾을 수 없습니다`
        : "스트리머를 찾을 수 없습니다";
    }, [searchName, platforms]);

    const handlePageChangeCallback = useCallback(
      (details: { page: number }) => {
        onPageChange(details.page);
      },
      [onPageChange],
    );

    const handleDetailClick = useCallback(async (streamer: Streamer) => {
      try {
        // API를 통해 상세 정보 가져오기
        const detailStreamer = await StreamerService.getStreamerDetail(
          streamer.uuid,
        );
        setSelectedStreamer(detailStreamer);
        setIsDetailDialogOpen(true);
      } catch (error) {
        console.error("스트리머 상세 정보 로드 실패:", error);
        // 에러 발생 시 기본 정보라도 표시
        setSelectedStreamer(streamer);
        setIsDetailDialogOpen(true);
      }
    }, []);

    const handleCloseDialog = useCallback(() => {
      setIsDetailDialogOpen(false);
      setSelectedStreamer(null);
    }, []);

    // 스트리머 인증 처리
    const handleVerifyStreamer = useCallback(async (streamerUuid: string) => {
      setActionLoading(streamerUuid);
      try {
        await StreamerService.verifyStreamer(streamerUuid);
      } catch (error) {
        console.error("스트리머 인증 실패:", error);
        // 에러 처리 (토스트 메시지 등)
      } finally {
        setActionLoading(null);
      }
    }, []);

    // 스트리머 인증 해제 처리
    const handleUnverifyStreamer = useCallback(async (streamerUuid: string) => {
      setActionLoading(streamerUuid);
      try {
        await StreamerService.unverifyStreamer(streamerUuid);
      } catch (error) {
        console.error("스트리머 인증 해제 실패:", error);
        // 에러 처리 (토스트 메시지 등)
      } finally {
        setActionLoading(null);
      }
    }, []);

    const convertStreamerToStreamerData = (
      streamer: Streamer,
    ): StreamerRegisterData => {
      return {
        uuid: streamer.uuid,
        name: streamer.name,
        description: streamer.description || "",
        platforms:
          streamer.platforms?.map((platform) => ({
            platformName: platform.platformName,
            channelUrl: platform.channelUrl,
          })) || [],
        lastUpdatedAt: streamer.updatedAt,
      };
    };

    return (
      <>
        <Stack width="full" alignItems="center">
          <Table.Root size="sm" variant="line" opacity={isLoading ? 0.5 : 1}>
            <Table.ColumnGroup>
              <Table.Column htmlWidth="50px" />
              <Table.Column />
              <Table.Column htmlWidth="84px" />
              {isVerified && <Table.Column htmlWidth="50px" />}
              <Table.Column htmlWidth="84px" />
              {isVerified && <Table.Column htmlWidth="84px" />}
              <Table.Column htmlWidth="38px" />
              {user?.role === "ADMIN" && <Table.Column htmlWidth="38px" />}
              {user?.role === "ADMIN" && <Table.Column htmlWidth="40px" />}
            </Table.ColumnGroup>

            <Table.Header>
              <Table.Row bg="neutral.100" borderTopWidth={1}>
                <Table.ColumnHeader py={1} textAlign="center">
                  번호
                </Table.ColumnHeader>
                <Table.ColumnHeader py={1} textAlign="center">
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
                  <Table.ColumnHeader px={0} py={1} textAlign="center">
                    인증일
                  </Table.ColumnHeader>
                )}
                <Table.ColumnHeader
                  paddingLeft={0}
                  paddingRight={user?.role === "ADMIN" ? 0 : 2}
                  py={1}
                  textAlign="center"
                >
                  상세
                </Table.ColumnHeader>
                {user?.role === "ADMIN" && (
                  <Table.ColumnHeader
                    paddingLeft={0}
                    paddingRight={user?.role === "ADMIN" ? 0 : 2}
                    py={1}
                    textAlign="center"
                  >
                    수정
                  </Table.ColumnHeader>
                )}
                {user?.role === "ADMIN" && (
                  <Table.ColumnHeader
                    paddingLeft={0}
                    paddingRight={2}
                    py={1}
                    textAlign="center"
                  >
                    관리
                  </Table.ColumnHeader>
                )}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {streamers.length === 0 ? (
                <EmptyState
                  icon={<FcSearch />}
                  title="검색 결과가 없습니다"
                  description={getEmptyDescription()}
                  colSpan={columnCount}
                />
              ) : (
                streamers.map((streamer, index) => {
                  const rowNumber = (currentPage - 1) * pageSize + index + 1;
                  const isProcessing = actionLoading === streamer.uuid;

                  return (
                    <Table.Row key={streamer.uuid} fontSize="sm">
                      <Table.Cell textAlign="center" py={1} fontSize="xs">
                        {rowNumber}
                      </Table.Cell>
                      <Table.Cell py={1}>{streamer.name}</Table.Cell>
                      <Table.Cell px={0} py={1}>
                        <Flex gap={1} justify="center">
                          {streamer.platforms?.map((platform) => (
                            <Link
                              key={platform.channelUrl}
                              href={platform.channelUrl}
                              target="_blank"
                            >
                              <Image
                                w={4}
                                h={4}
                                src={PLATFORM_ICON_MAP[platform.platformName]}
                                alt={`${platform.platformName} icon`}
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
                          {streamer.followCount?.toLocaleString() || 0}
                        </Table.Cell>
                      )}
                      <Table.Cell
                        textAlign="center"
                        px={0}
                        py={1}
                        fontSize="xs"
                      >
                        {new Date(streamer.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      {isVerified && (
                        <Table.Cell
                          textAlign="center"
                          px={0}
                          py={1}
                          fontSize="xs"
                        >
                          {streamer.verifiedAt
                            ? new Date(streamer.verifiedAt).toLocaleDateString()
                            : "-"}
                        </Table.Cell>
                      )}
                      <Table.Cell px={0} py={1}>
                        <Flex justify="center" align="center">
                          <IconButton
                            variant="ghost"
                            size="xs"
                            p={0}
                            aria-label="스트리머 상세 정보 보기"
                            onClick={() => handleDetailClick(streamer)}
                          >
                            <BiDetail />
                          </IconButton>
                        </Flex>
                      </Table.Cell>
                      {user?.role === "ADMIN" && (
                        <Table.Cell
                          paddingLeft={0}
                          paddingRight={user?.role === "ADMIN" ? 0 : 2}
                          py={1}
                        >
                          <Flex justify="center" align="center">
                            <StreamerDialog
                              mode="edit"
                              streamerData={convertStreamerToStreamerData(
                                streamer,
                              )}
                            />
                          </Flex>
                        </Table.Cell>
                      )}
                      {user?.role === "ADMIN" && (
                        <Table.Cell paddingLeft={0} paddingRight={2} py={1}>
                          <Popover.Root size="xs">
                            <Popover.Trigger asChild>
                              <Flex justify="center" align="center">
                                <IconButton
                                  variant="ghost"
                                  size="xs"
                                  p={0}
                                  aria-label="스트리머 관리"
                                  color={streamer.isVerified ? "blue.600" : ""}
                                  disabled={isProcessing}
                                >
                                  <MdVerified />
                                </IconButton>
                              </Flex>
                            </Popover.Trigger>
                            <Portal>
                              <Popover.Positioner>
                                <Popover.Content width="auto">
                                  <Popover.Body>
                                    <Popover.Arrow />
                                    <VStack gap={0}>
                                      {/* 인증됨 탭에서는 해제만, 요청 중 탭에서는 인증만 표시 */}
                                      {isVerified ? (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          loading={isProcessing}
                                          onClick={() =>
                                            handleUnverifyStreamer(
                                              streamer.uuid,
                                            )
                                          }
                                        >
                                          인증 해제
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          loading={isProcessing}
                                          onClick={() =>
                                            handleVerifyStreamer(streamer.uuid)
                                          }
                                        >
                                          인증하기
                                        </Button>
                                      )}
                                    </VStack>
                                  </Popover.Body>
                                </Popover.Content>
                              </Popover.Positioner>
                            </Portal>
                          </Popover.Root>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>

          {/* 페이지네이션 */}
          {totalCount > pageSize && (
            <Pagination.Root
              count={totalCount}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={handlePageChangeCallback}
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

        {/* 스트리머 상세 다이얼로그 */}
        <StreamerDetailDialog
          isOpen={isDetailDialogOpen}
          onClose={handleCloseDialog}
          streamer={selectedStreamer}
        />
      </>
    );
  },
);

StreamerTable.displayName = "StreamerTable";

export default StreamerTable;
