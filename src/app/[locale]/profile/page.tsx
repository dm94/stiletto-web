"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getStoredItem } from "@/lib/storage";
import { getDiscordLoginUrl } from "@/lib/utils";

interface UserProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  guilds?: {
    id: string;
    name: string;
    icon: string;
  }[];
}

export default function ProfilePage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleDiscordCallback(code);
    } else {
      loadProfile();
    }
  }, [searchParams]);

  const loadProfile = async () => {
    const token = getStoredItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error loading profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading profile");
    }
  };

  const handleDiscordCallback = async (code: string) => {
    try {
      const response = await fetch("/api/auth/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Error authenticating with Discord");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error authenticating");
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {t(error)}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <h1 className="mb-4">{t("Login with Discord")}</h1>
        <a
          href={getDiscordLoginUrl()}
          className="btn btn-primary btn-lg"
          role="button"
        >
          <i className="fab fa-discord me-2" />
          {t("Login with Discord")}
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title mb-0">{t("Profile")}</h1>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <img
                  src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`}
                  alt={profile.username}
                  className="rounded-circle me-3"
                  width="64"
                  height="64"
                />
                <div>
                  <h2 className="mb-0">
                    {profile.username}#{profile.discriminator}
                  </h2>
                </div>
              </div>
              {profile.guilds && profile.guilds.length > 0 && (
                <div>
                  <h3 className="mb-3">{t("Servers")}</h3>
                  <div className="row g-3">
                    {profile.guilds.map((guild) => (
                      <div key={guild.id} className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            {guild.icon && (
                              <img
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                alt={guild.name}
                                className="rounded me-2"
                                width="32"
                                height="32"
                              />
                            )}
                            <span>{guild.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
