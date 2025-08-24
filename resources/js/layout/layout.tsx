import React, { useState } from "react";
import Dock from "@/component/dock";
import DarkModeToggle from "@/component/dark-mode-toggle";
import ScrollToTopButton from "@/component/scroll-to-up-button";
import BackButton from "@/component/back-button";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [activeTab, setActiveTab] = useState<string>("home");

    return (
        <div className="min-h-screen flex items-center relative">
            <div className="min-h-screen flex items-center relative">
                <div className="header-container fixed -top-1 left-0 w-full py-2 z-50 shadow-md">
                    <div className="header-inner flex items-center justify-center h-14 relative">
                        <img
                            src="/cns-black.png"
                            alt="Centralize News Logo"
                            width={90}
                            className="logo-fade logo-light"
                        />
                        <img
                            src="/cns-white.png"
                            alt="Centralize News Logo"
                            width={90}
                            className="logo-fade logo-dark"
                        />
                        <DarkModeToggle />
                        <BackButton />
                    </div>
                </div>
            </div>


            <main>{children}</main>
            <Dock /> {/* now Dock is inside Inertia */}
        </div>
    );
}
