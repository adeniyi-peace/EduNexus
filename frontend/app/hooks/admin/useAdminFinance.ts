// hooks/admin/useAdminFinance.ts
// TanStack Query hook for the Financial Overview

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminFinanceData } from "~/types/admin";

export interface FinanceParams {
    page?: number;
    page_size?: number;
}

async function fetchAdminFinance(params: FinanceParams = {}): Promise<AdminFinanceData> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const { data } = await api.get<AdminFinanceData>(`/users/admin/finance/?${query}`);
    return data;
}

export function useAdminFinance(params: FinanceParams = {}) {
    return useQuery({
        queryKey: ["admin", "finance", params],
        queryFn: () => fetchAdminFinance(params),
        placeholderData: (prev) => prev,
        staleTime: 60_000, // Finance data can be slightly stale — 1 minute
    });
}
