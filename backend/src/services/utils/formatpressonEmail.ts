type PressOnInquiry = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	instagram: string;
	length: string;
	shape: string;
	occasion: string;
	details: string;
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	}[character] ?? character));
}

export function formatPressOnEmail(inquiry: PressOnInquiry) {
	const name = `${inquiry.firstName} ${inquiry.lastName}`;
	return {
		subject: `New press-on inquiry: ${name}`,
		html: [
			"<p>A new custom press-on inquiry is waiting for review.</p>",
			`<p><strong>Customer:</strong> ${escapeHtml(name)}<br />`,
			`<strong>Email:</strong> ${escapeHtml(inquiry.email)}<br />`,
			`<strong>Phone:</strong> ${escapeHtml(inquiry.phone || "Not provided")}<br />`,
			`<strong>Instagram:</strong> ${escapeHtml(inquiry.instagram || "Not provided")}</p>`,
			`<p><strong>Length:</strong> ${escapeHtml(inquiry.length)}<br />`,
			`<strong>Shape:</strong> ${escapeHtml(inquiry.shape)}<br />`,
			`<strong>Occasion:</strong> ${escapeHtml(inquiry.occasion || "Not provided")}</p>`,
			`<p><strong>Additional details:</strong><br />${escapeHtml(inquiry.details || "None provided").replace(/\n/g, "<br />")}</p>`,
		].join(""),
	};
}
