// components/providers/modal.provider.tsx
"use client";

import React from "react";
import MyProfileModal from "../user/MyProfileModal";

/**
 * 앱에서 사용되는 모든 전역 모달들을 렌더링하는 Provider
 * 이 컴포넌트를 app/layout.tsx 또는 providers.tsx에 추가하면 됩니다.
 */
const ModalProvider: React.FC = () => {
  return (
    <>
      <MyProfileModal />
      {/* 다른 전역 모달들도 여기에 추가 */}
    </>
  );
};

export default ModalProvider;
