import { Link, useLocation } from "react-router";
import { useUserContext } from "~/hooks/useUserContext";

export default function UserProfileDropdown(){
    const { user, logout } = useUserContext();
    const location = useLocation();

    let basePath = "/dashboard";
    if (location.pathname.startsWith("/cms")) {
        basePath = "/cms";
    } else if (location.pathname.startsWith("/admin")) {
        basePath = "/admin";
    }

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                <div className="w-9 lg:w-10 rounded-xl ring-2 ring-primary/20 ring-offset-base-100 ring-offset-2">
                    <img src="https://i.pravatar.cc/150?u=user" alt={user?.first_name || "User profile"} />
                </div>
            </label>
            <ul tabIndex={0} className="mt-4 z-50 p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-3xl w-60 border border-base-content/5 space-y-1">
                <li className="menu-title text-[10px] font-black uppercase opacity-30 px-4 py-2">
                    Account Node
                </li>
                <li>
                    <Link className="rounded-xl py-2.5 font-bold" to={`${basePath}/profile`}>Profile</Link>
                </li>
                <li>
                    <Link className="rounded-xl py-2.5 font-bold" to={`${basePath}/settings`}>Account Settings</Link>
                </li>
                {/* Corrected valid HTML for divider inside a list */}
                <li role="separator">
                    <div className="divider opacity-5 my-0 py-1" />
                </li>
                <li>
                    <button onClick={() => logout()} className="text-error font-black rounded-xl py-2.5 text-left w-full">Log Out</button>
                </li>
            </ul>
        </div>
    )
}