import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FilePreviewDialogProps {
  url: string;
  triggerText?: string;
}

export function FilePreviewDialog({ url, triggerText = "View Attachment" }: FilePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) != null || url.includes("image/upload");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = objectUrl;
      // Force .pdf extension if it's not an image to fix the download bug
      a.download = isImage ? "Attachment.png" : "Attachment.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed, using fallback:", error);
      // Fallback if fetch fails (e.g. CORS)
      let fallbackUrl = url;
      if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        fallbackUrl = url.replace("/upload/", "/upload/fl_attachment/");
      }
      window.open(fallbackUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-blue-500 hover:underline flex items-center cursor-pointer bg-transparent border-none p-0">
          {triggerText} <ExternalLink className="h-3 w-3 ml-1" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-6">
            <span className="flex items-center gap-2"><FileText className="h-5 w-5"/> File Preview</span>
            <Button size="sm" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              {downloading ? "Downloading..." : "Download File"}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full bg-muted/30 rounded-md overflow-hidden relative border mt-2">
          {isImage ? (
            <img src={url} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
              className="w-full h-full border-none" 
              title="File Preview"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
