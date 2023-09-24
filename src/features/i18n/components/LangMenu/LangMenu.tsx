import React from "react";

import { Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { i18nConfig } from "../../config";
import { useChangeLanguage } from "../../useChangeLanguage";
import { useI18nWatcher } from "../../useI18nWatchers";

const LangModal = React.lazy(() =>
  import(/* webpackChunkName: "LangModal" */ "./LangModal").then((module) => ({
    default: module.LangModal,
  }))
);

export const LangMenu: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation("Layout");
  useI18nWatcher();
  const { changeLanguage } = useChangeLanguage(
    location.pathname,
    i18n.resolvedLanguage ?? i18nConfig.fallbackLang.code
  );
  const { onOpen, onClose, isOpen } = useDisclosure();

  const loadingButton = (
    <Button onClick={onOpen} variant="outline" isLoading></Button>
  );
  return i18nConfig.supportedLanguages.length > 1 ? (
    <React.Suspense fallback={loadingButton}>
      <>
        <Button onClick={onOpen} variant="outline">
          {i18n.resolvedLanguage}
        </Button>
        <LangModal
          isOpen={isOpen}
          onClose={onClose}
          onChange={changeLanguage}
          defaultValue={i18n.resolvedLanguage ?? i18nConfig.fallbackLang.code}
          supportedLanguages={i18nConfig.supportedLanguages}
        />
      </>
    </React.Suspense>
  ) : null;
};
