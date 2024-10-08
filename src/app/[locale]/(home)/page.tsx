import { useTranslation } from "@/app/i18n";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = async ({ params: { locale } }) => {
  const { t } = await useTranslation(locale);

  return (
    <main>
      <h1>{t("hello")}</h1>
      <Button color="primary">Button</Button>
    </main>
  );
};

export default Home;
