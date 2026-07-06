import React from "react";
import windowWrapper from "@hoc/windowWrapper";
import useTelegram from "../../hooks/useTelegram";
import TelegramSection from "../section/TelegramSection";

const Telegram = () => {
  const allProps = useTelegram();
  return <TelegramSection {...allProps} />;
};

const TelegramWindow = windowWrapper(Telegram, "telegram");
export default TelegramWindow;
