import type { ReactNode } from "react";

import Footer from "#/components/app/footer";
import Header from "#/components/app/header";

export default function AppShell({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
