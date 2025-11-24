import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { contactId } = req.params; 
  
  if (!isValidObjectId(contactId)) {
    return next(HttpError(400, `${contactId} is not a valid ID format`));
  }

  next(); 
};

export default isValidId;