import { Request, Response } from "express";

export const generateDoc = (req: Request, res: Response) => {
  const { documentTo } = req.query;
  console.log("Request Body: ", req.body)
  // Validate the input
  if (!documentTo) {
    return res.status(400).json({ 
      success: false,
      error: "documentTo is required" 
    });
  }


  // Send the generated document as a response
  return res.status(200).json({ 
    success: true,
    message: `Document generated successfully for ${documentTo}`,
   });
}
