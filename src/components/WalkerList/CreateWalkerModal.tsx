import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AddWalkerFromUserRequestBody,
  type WalkerEnum,
  WalkerUse,
} from "@ctypes/dto/walkers";

import type { MemberInfo } from "@ctypes/dto/members";

interface CreateWalkerModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  walkerTypes: string[];
  memberList: MemberInfo[];
  onClose: () => void;
  onSubmit: (payload: AddWalkerFromUserRequestBody) => void;
}

interface CreateWalkerFormState {
  name: string;
  owner: string;
  use?: WalkerUse;
  ready: boolean;
  type?: WalkerEnum;
  description: string;
}

const getInitialFormState = (): CreateWalkerFormState => {
  return {
    name: "",
    owner: "",
    use: undefined,
    ready: false,
    type: undefined,
    description: "",
  };
};

const formatUseLabel = (
  value: WalkerUse,
  t: (key: string) => string,
): string => {
  const translatedValue = t(`common.${value}`);
  if (translatedValue !== `common.${value}`) {
    return translatedValue;
  }

  if (value === WalkerUse.PVP) {
    return "PVP";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const CreateWalkerModal: React.FC<CreateWalkerModalProps> = ({
  isOpen,
  isSubmitting,
  walkerTypes,
  memberList,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<CreateWalkerFormState>(
    getInitialFormState(),
  );

  const ownerOptions = useMemo(() => {
    const uniqueOwners = new Set<string>();
    for (const member of memberList) {
      const nickname = member.nickname?.trim();
      if (nickname) {
        uniqueOwners.add(nickname);
      }
    }

    return Array.from(uniqueOwners).sort((a, b) => a.localeCompare(b));
  }, [memberList]);

  const useOptions = useMemo(() => Object.values(WalkerUse), []);

  const handleFieldChange = useCallback(
    (
      field: keyof CreateWalkerFormState,
      value: string | boolean | WalkerUse | WalkerEnum | undefined,
    ) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    },
    [],
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormState(getInitialFormState());
      onClose();
    }
  }, [isSubmitting, onClose]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = formState.name.trim();
      if (!trimmedName) {
        return;
      }

      const trimmedOwner = formState.owner.trim();
      const trimmedDescription = formState.description.trim();
      const requestBody: AddWalkerFromUserRequestBody = {
        name: trimmedName,
        ...(trimmedOwner && { owner: trimmedOwner }),
        ...(formState.use && { use: formState.use }),
        ready: formState.ready,
        ...(formState.type && { type: formState.type }),
        ...(trimmedDescription && { description: trimmedDescription }),
      };

      onSubmit(requestBody);
    },
    [formState, onSubmit],
  );

  useEffect(() => {
    if (!isOpen) {
      setFormState(getInitialFormState());
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default"
        aria-label={t("common.close")}
        onClick={handleClose}
      />
      <div className="z-10 w-full max-w-2xl rounded-lg bg-gray-800 shadow-xl">
        <div className="border-b border-gray-700 p-4">
          <h2 className="text-xl font-semibold text-white">
            {t("common.add")}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="create-walker-name"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                {t("common.name")}
              </label>
              <input
                id="create-walker-name"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="text"
                maxLength={60}
                value={formState.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-walker-owner"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                {t("common.owner")}
              </label>
              <input
                id="create-walker-owner"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="text"
                value={formState.owner}
                onChange={(event) =>
                  handleFieldChange("owner", event.target.value)
                }
                list="walker-owner-options"
              />
              <datalist id="walker-owner-options">
                {ownerOptions.map((owner) => (
                  <option key={owner} value={owner} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="create-walker-type"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                {t("common.type")}
              </label>
              <select
                id="create-walker-type"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.type ?? ""}
                onChange={(event) =>
                  handleFieldChange(
                    "type",
                    event.target.value
                      ? (event.target.value as WalkerEnum)
                      : undefined,
                  )
                }
              >
                <option value="">{t("common.notDefined1")}</option>
                {walkerTypes.map((walkerType) => (
                  <option key={walkerType} value={walkerType}>
                    {t(walkerType)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="create-walker-use"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                {t("common.use")}
              </label>
              <select
                id="create-walker-use"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.use ?? ""}
                onChange={(event) =>
                  handleFieldChange(
                    "use",
                    event.target.value
                      ? (event.target.value as WalkerUse)
                      : undefined,
                  )
                }
              >
                <option value="">{t("common.notDefined1")}</option>
                {useOptions.map((useType) => (
                  <option key={useType} value={useType}>
                    {formatUseLabel(useType, t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="create-walker-ready"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                type="checkbox"
                checked={formState.ready}
                onChange={(event) =>
                  handleFieldChange("ready", event.target.checked)
                }
              />
              <label
                htmlFor="create-walker-ready"
                className="text-sm font-medium text-gray-300"
              >
                {t("common.isReady")}
              </label>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="create-walker-description"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                {t("common.description")}
              </label>
              <textarea
                id="create-walker-description"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-700 p-4">
            <button
              type="button"
              className="rounded-lg border border-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-green-900"
              disabled={!formState.name.trim() || isSubmitting}
            >
              {t("common.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWalkerModal;
