const replaceImageHyperLinks = (message) => {
	// Regular expression to match the [image/png](https://cdn.discordapp.com/attachments...) pattern
	const regex =
		/\[image\/png\]\((https:\/\/cdn\.discordapp\.com\/attachments\/[^\)]+)\)/g;

	const files = [];

	// Replace the [image/png](link) pattern with an empty string and store the links
	// message.content = message.content.replace(regex, (match, p1) => {
	// 	files.push(p1);
	// 	// console.log(match);
	// 	// console.log(p1);
	// 	return "";
	// });

	// console.log(files);
	// message.files = files;
};

module.exports = { replaceImageHyperLinks };
