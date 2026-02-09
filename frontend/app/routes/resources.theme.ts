// app/routes/resources.theme.ts
import { createCookie } from "react-router";

export const themeCookie = createCookie("theme", {
    maxAge: 31_536_000, // 1 year
});

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const theme = formData.get("theme");

    return new Response("ok", {
        headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
        },
    });
}