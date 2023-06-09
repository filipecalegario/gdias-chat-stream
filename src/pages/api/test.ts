import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { input } = req.body;

  if (!input) {
    res.status(400).send('No input in the request');
    return;
  }

  const result = `Teste ${input}`;
  res.status(200).json({ result });
}