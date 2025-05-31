import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  filename: string;
  updatedAt: string;
  updatedBy: string;
}

interface DocumentsCardProps {
  documents: Document[];
}

export default function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-base font-semibold">Recently Updated Documents</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map((document) => (
            <div key={document.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{document.filename}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Updated {document.updatedAt} by {document.updatedBy}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400">
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <a href="/documents" className="text-sm text-primary-600 dark:text-primary-500 font-medium hover:text-primary-700 dark:hover:text-primary-400">
          Go to Document Repository
        </a>
      </CardFooter>
    </Card>
  );
}
