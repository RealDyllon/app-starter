import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

import { m } from "#/i18n/messages";

const HeaderUserClient = lazy(() => import("./header-user-client"));

function HeaderUserSignedOut() {
	return (
		<div className="flex items-center gap-2">
			<Link to="/login" search={{ redirect: undefined }} className="nav-link">
				{m.auth_log_in()}
			</Link>
			<Link
				to="/signup"
				search={{ redirect: undefined }}
				className="inline-cta m-0"
			>
				{m.auth_sign_up()}
			</Link>
		</div>
	);
}

export default function BetterAuthHeader() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <HeaderUserSignedOut />;
	}

	return (
		<Suspense fallback={<HeaderUserSignedOut />}>
			<HeaderUserClient />
		</Suspense>
	);
}
