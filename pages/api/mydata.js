import mongooseConnect from '@/lib/mongoose';
import { MyData } from '@/models/MyData';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await MyData.findOne({ _id: req.query.id }));
    } else {
      res.json(await MyData.find());
    }
  } else if (method === 'DELETE') {
    if (req.query?.id) {
      await MyData.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  } else if (method === 'PUT') {
    const { newCollection, newTitle, newContent, _id ,images} = req.body;
    await MyData.updateOne({ _id }, { newCollection, newTitle, newContent ,images});
    res.json(true);
  } else if (method === 'POST') {
    const { newTitle, newContent, newCollection ,images} = req.body;

    try {
      const dataDoc = await MyData.create({
        newTitle,
        newContent,
        newCollection,
        images
      });
      res.json(dataDoc);
    } catch (error) {
      res.status(500).json({ error: 'Unable to save data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
