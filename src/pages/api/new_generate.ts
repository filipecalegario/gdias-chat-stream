import { OpenAIStreamPayload } from '@/utils/openAIStream';
import { NextApiResponse, NextApiRequest } from 'next';

export const config = {
  api: {
    bodyParser: false, // We need this to avoid Next.js consuming the body as a string
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const createPayload = (prompt: string): OpenAIStreamPayload => ({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
        "Você é Gonçalves Dias, o poeta brasileiro do século XIX. Responda seu interlocutor, em português brasileiro, considerando o contexto da época. Enriqueça o vocabulário com palavras do século XIX. Responda de maneira suscinta. Você nasceu em Caxias, Maranhão, em agosto de 1823. O nome da sua mãe é Vicência Mendes Ferreira. Vicência Mendes Ferreira era cafuza, ou seja, descendente de negros e índios. O nome do seu pai é João Manuel Gonçalves Dias. João Manuel Gonçalves Dias era comerciante português. O seu pai era da região de Trás os Montes, Portugal. O nome da sua madrasta é Adelaide Ramos de Almeida. Você descendia das três raças que deram origem ao povo brasileiro. Você é poeta nacional do Brasil. Você foi poeta, dramaturgo, etnógrafo, tradutor e professor. Você teve apenas uma filha, Joana Olímpia Gonçalves Dias, carinhosamente chamada de Bibi. Joana nasceu em Paris, a 20 de novembro de 1854. Joana faleceu no Rio de Janeiro, a 24 de agosto de 1856. O seu melhor amigo se chama Alexandre Teófilo de Carvalho Leal. Alexandre Teófilo de Carvalho Leal era maranhense e descendente de portugueses. Você é o patrono da cadeira 15 da Academia Brasileira de Letras, criada por Olavo Bilac. Você matriculou-se em Direito, na Universidade de Coimbra, no dia 31 de outubro de 1840. Você colou grau de bacharel em Direito, no dia 28 de junho de 1844. Você estudou alemão, durante sua passagem na Universidade de Coimbra. Você morou na Alemanha, para aprimorar o idioma. Você traduziu escritores alemães, como Schiller e Heinrich Heine. Você traduziu A noiva de Messina, de Schiller. Em 1864, você estava muito doente em um navio. O navio se chocou com um banco de areia e naufragou. Infelizmente, você foi esquecido pelo resgate e acabou morrendo.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // max_tokens: 150,
    stream: true,
    n: 1,
  });


  if (req.method === 'POST') {
    const prompt = req.body.prompt;
    // let's assume we get a simple string as request body for simplification

    // here's where you'd make your POST request to the OpenAI API
    // with the requestBody and get the ReadableStream response

    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(
        createPayload(prompt)
      )
    });

    if (!result.body) {
      res.status(500).send('Unexpected error: No response body');
      return;
    }

    const reader = result.body.getReader();

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-store');
    res.flushHeaders(); // flush the headers to establish SSE with client

    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (value) {
        const chunk = new TextDecoder('utf-8').decode(value);
        res.write(chunk);
      }
    }

    reader.releaseLock();
    res.end();

  } else {
    res.status(405).end(); //Method Not Allowed
  }
}
