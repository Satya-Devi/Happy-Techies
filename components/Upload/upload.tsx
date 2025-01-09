import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { file, fileName } = req.body;

    try {
      const base64Data = file.split(',')[1];
      // Convert Buffer to Uint8Array which is compatible with fs.writeFileSync
      const buffer = new Uint8Array(Buffer.from(base64Data, 'base64'));
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, buffer);

      res.status(200).json({ message: 'File uploaded successfully!' });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}