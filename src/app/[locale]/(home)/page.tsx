import { useTranslation } from "@/app/i18n";
import { Button } from "@nextui-org/react";
import React from "react";

const Home = async ({ params: { locale } }) => {
  const { t } = await useTranslation(locale);
  return (
    <main>
      <h1>{t("hello")}</h1>
      <Button radius="sm" color="primary">
        Button
      </Button>
    </main>
  );
};

export default Home;
