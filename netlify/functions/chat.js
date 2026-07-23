exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userText, conversationHistory, systemInstruction } = JSON.parse(event.body);
        
        // Netlify securely injects these keys at runtime!
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        // --- 1. PRIMARY ENGINE: GEMINI ---
        if (GEMINI_API_KEY) {
            try {
                const activeGeminiModel = "models/gemini-3.5-flash";
                const payload = {
                    contents: [
                        { role: "user", parts: [{ text: "System Command: " + systemInstruction }] },
                        { role: "model", parts: [{ text: "Understood! I am online and ready to help." }] },
                        ...conversationHistory,
                        { role: "user", parts: [{ text: userText }] }
                    ]
                };

                const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${activeGeminiModel}:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const geminiData = await geminiRes.json();

                if (!geminiData.error && geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ reply: geminiData.candidates[0].content.parts[0].text })
                    };
                }
            } catch (err) {
                console.log("Gemini failed, routing to Groq fallback...");
            }
        }

        // --- 2. FALLBACK ENGINE: GROQ ---
        if (GROQ_API_KEY) {
            const activeGroqModel = "openai/gpt-oss-20b";
            const translateHistoryForGroq = (history) => history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts[0].text
            }));

            const groqMessages = [
                { role: "system", content: systemInstruction },
                ...translateHistoryForGroq(conversationHistory),
                { role: "user", content: userText }
            ];

            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: activeGroqModel, messages: groqMessages })
            });

            const groqData = await groqRes.json();
            
            if (groqData.choices?.[0]?.message?.content) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ reply: groqData.choices[0].message.content })
                };
            }
        }

        // --- 3. TOTAL FAILURE ---
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Both AI models failed or API keys are missing in Netlify." })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Serverless function crashed." })
        };
    }
};