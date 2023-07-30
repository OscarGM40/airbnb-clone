"use client";
import { Toaster } from "react-hot-toast";

// NOTE tenemos que crear este file porque queremos que el Toaster sea solo del cliente(de echo parece que da error,obviamente es por estar en Next y no en React)
const ToasterProvider = () => {
  return <Toaster />;
};
export default ToasterProvider;
