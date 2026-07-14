import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.BASE_URL_OPENAI!,
  apiKey: 'not-needed',
});


export const generateSummary = async (documentContent:string):Promise<string>=>{
	try {
		const response = await client.chat.completions.create({
			model: process.env.OPENAI_MODEL!,
			messages: [
				{
					role: "system",
					content:
					"You are a helpful assistant that creates concise, accurate summaries of documents. Respond with only the summary.",
				},
				{
					role: "user",
					content: documentContent,
				},
			],
		})

		const choice = response.choices[0];

		if (!choice) {
			return "Sorry! It seems our AI service is down for the moment.";
		}

		return (
			choice.message.content ??
			"Sorry! I couldn't generate a summary for your document."
		);
		} catch (error) {
			console.error("Failed to generate summary:", error);
			return "Sorry! It seems our AI service is unavailable at the moment.";
		}
}