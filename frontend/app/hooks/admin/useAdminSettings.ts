// hooks/admin/useAdminSettings.ts
// TanStack Query hook for Platform Settings (get + bulk-update)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminSettingsData, AdminActionResponse } from "~/types/admin";

async function fetchAdminSettings(): Promise<AdminSettingsData> {
    const { data } = await api.get<AdminSettingsData>("/users/admin/settings/");
    return data;
}

async function patchAdminSettings(
    settings: { key: string; value: string }[]
): Promise<AdminActionResponse> {
    const { data } = await api.patch<AdminActionResponse>("/users/admin/settings/", { settings });
    return data;
}

export function useAdminSettings() {
    return useQuery({
        queryKey: ["admin", "settings"],
        queryFn: fetchAdminSettings,
        staleTime: 300_000, // Settings are very stable — 5 minute stale time
    });
}

export function useSaveAdminSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: { key: string; value: string }[]) => patchAdminSettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
        },
    });
}
