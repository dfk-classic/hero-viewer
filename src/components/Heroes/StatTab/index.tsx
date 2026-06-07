import React from "react";

interface StatTabProps {
	children: React.ReactNode;
}

// Outer padding wrapper shared by every stat tab; holds one or more StatColumns.
const StatTab = ({ children }: StatTabProps) => (
	<div style={{ padding: "0 10px" }}>{children}</div>
);

export default React.memo(StatTab);
