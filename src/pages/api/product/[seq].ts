import { NextApiRequest, NextApiResponse } from "next";

export default function product(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ seq: req.query.seq });
}
