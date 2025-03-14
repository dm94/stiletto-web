"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { getStoredItem } from "@/lib/services";
import { getDomain } from "@/lib/utils";
import { config } from "@/config/config";

export default function DiscordButton() {
  const t = useTranslations();

  if (getStoredItem("token")) {
    return (
      <Link
        className="btn btn-outline-light"
        href="/profile"
        data-cy="profile-link"
      >
        <i className="far fa-user" /> {t("Profile")}
      </Link>
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
    config.DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;

  return (
    <a className="btn btn-outline-light" href={discordAuthUrl}>
      <i className="fab fa-discord" /> {t("Login with discord")}
    </a>
  );
}
