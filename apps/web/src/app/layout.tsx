import type React from "react";
import type { Metadata } from "next";
import { Geist_Mono, Crimson_Text } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

const crimsonText = Crimson_Text({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "TENXTEN — The Proving Ground",
	description: "A competence filter for 10x10 architects. Separate the prompt kiddies from the elite engineers.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistMono.variable} ${crimsonText.variable}`} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className="antialiased" suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
