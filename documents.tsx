import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Download, 
  Trash2, 
  Eye, 
  Clock, 
  Upload, 
  MoreHorizontal,
  AlertTriangle
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Documents() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("Central Pharmacy");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: documents, isLoading } = useQuery({
    queryKey: [`/api/documents/${selectedPharmacy}`],
  });
  
  // Function to handle document viewing
  const handleViewDocument = (doc: any) => {
    setViewingDocument(doc);
  };
  
  // Function to handle document downloading
  const handleDownloadDocument = (doc: any) => {
    // In a real application, this would trigger a download from the server
    // Here we'll simulate it with a toast notification
    toast({
      title: "Download Started",
      description: `${doc.filename} is being downloaded...`,
      variant: "default",
    });
    
    // Simulate a successful download after a short delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${doc.filename} has been downloaded successfully.`,
        variant: "default",
      });
    }, 1500);
  };
  
  // Function to handle document deletion
  const handleDeleteDocument = (id: number) => {
    setDocumentToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Mutation for document deletion
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/documents/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${selectedPharmacy}`] });
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
        variant: "default",
      });
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Function to confirm document deletion
  const confirmDeleteDocument = () => {
    if (documentToDelete === null) return;
    deleteDocumentMutation.mutate(documentToDelete);
  };
  
  const getDocumentIcon = (type: string, filename: string) => {
    if (filename.endsWith(".xlsx") || filename.endsWith(".csv")) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-500" />;
    } else if (filename.endsWith(".pdf")) {
      return <FileText className="h-8 w-8 text-red-600 dark:text-red-500" />;
    } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
      return <FileText className="h-8 w-8 text-blue-600 dark:text-blue-500" />;
    } else {
      return <FileCode className="h-8 w-8 text-purple-600 dark:text-purple-500" />;
    }
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Handle documents filtering with proper null checking
  const filteredDocuments = documents 
    ? Array.isArray(documents) ? documents.filter((doc: any) => {
        // Filter by tab type
        if (activeTab !== "all" && doc.type.toLowerCase() !== activeTab) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !doc.filename.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      }) : []
    : [];

  return (
    <>
      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={(open) => !open && setViewingDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingDocument?.title}</DialogTitle>
            <DialogDescription>
              {viewingDocument?.filename} • Version {viewingDocument?.version || "1.0"}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 min-h-[500px] overflow-hidden">
            {/* Document Viewer - Simple mockup instead of actual embed */}
            <div className="w-full h-[500px] flex flex-col">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b mb-4">
                <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  {viewingDocument?.filename.endsWith('.pdf') ? 'PDF Document' : 
                   viewingDocument?.filename.endsWith('.docx') || viewingDocument?.filename.endsWith('.doc') ? 'Word Document' :
                   viewingDocument?.filename.endsWith('.xlsx') || viewingDocument?.filename.endsWith('.csv') ? 'Excel Spreadsheet' : 
                   'Document'}
                </p>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                {viewingDocument?.filename.endsWith('.pdf') ? (
                  <div className="text-center w-full max-w-xl">
                    <FileText className="h-20 w-20 mx-auto text-red-500 mb-6" />
                    <h3 className="text-xl font-semibold mb-2">{viewingDocument?.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      PDF Document • {viewingDocument?.filename} • {viewingDocument?.version || "v1.0"}
                    </p>
                    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-800 dark:text-gray-200 text-left mb-2">Document Preview:</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm text-left mb-2">
                        {viewingDocument?.title}: This document outlines the procedures for {viewingDocument?.title.toLowerCase()}.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm text-left">
                        Required by USP {viewingDocument?.chapterId} regulations, this document details the safe practices for all pharmacy staff.
                      </p>
                    </div>
                    <Button onClick={() => handleDownloadDocument(viewingDocument)} size="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                ) : viewingDocument?.filename.endsWith('.docx') || viewingDocument?.filename.endsWith('.doc') ? (
                  <div className="text-center w-full max-w-xl">
                    <FileText className="h-20 w-20 mx-auto text-blue-500 mb-6" />
                    <h3 className="text-xl font-semibold mb-2">{viewingDocument?.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Word Document • {viewingDocument?.filename} • {viewingDocument?.version || "v1.0"}
                    </p>
                    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-800 dark:text-gray-200 text-left mb-2">Document Preview:</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm text-left mb-2">
                        {viewingDocument?.title}: This standard operating procedure provides guidance on {viewingDocument?.title.toLowerCase()}.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm text-left">
                        In accordance with USP {viewingDocument?.chapterId}, this document must be reviewed annually by pharmacy staff.
                      </p>
                    </div>
                    <Button onClick={() => handleDownloadDocument(viewingDocument)} size="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                ) : viewingDocument?.filename.endsWith('.xlsx') || viewingDocument?.filename.endsWith('.csv') ? (
                  <div className="text-center w-full max-w-xl">
                    <FileSpreadsheet className="h-20 w-20 mx-auto text-green-500 mb-6" />
                    <h3 className="text-xl font-semibold mb-2">{viewingDocument?.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Excel Spreadsheet • {viewingDocument?.filename} • {viewingDocument?.version || "v1.0"}
                    </p>
                    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-center font-medium">Date</div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-center font-medium">Metric</div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-center font-medium">Value</div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-center font-medium">Status</div>
                        
                        <div className="p-2 border text-xs">05/15/2023</div>
                        <div className="p-2 border text-xs">Temperature</div>
                        <div className="p-2 border text-xs">20.5°C</div>
                        <div className="p-2 border text-xs">✓ Pass</div>
                        
                        <div className="p-2 border text-xs">05/16/2023</div>
                        <div className="p-2 border text-xs">Humidity</div>
                        <div className="p-2 border text-xs">45%</div>
                        <div className="p-2 border text-xs">✓ Pass</div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs text-center">Spreadsheet preview (sample data)</p>
                    </div>
                    <Button onClick={() => handleDownloadDocument(viewingDocument)} size="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Spreadsheet
                    </Button>
                  </div>
                ) : (
                  <div className="text-center w-full max-w-xl">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{viewingDocument?.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">File type: {viewingDocument?.filename.split('.').pop()?.toUpperCase()}</p>
                    <p className="text-gray-500 dark:text-gray-500 max-w-md mb-4">This file type doesn't support preview in the browser.</p>
                    <Button onClick={() => handleDownloadDocument(viewingDocument)} size="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingDocument(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Document Repository</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage SOPs, policies, and compliance documentation</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select pharmacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Central Pharmacy">Central Pharmacy</SelectItem>
              <SelectItem value="Oncology Pharmacy">Oncology Pharmacy</SelectItem>
              <SelectItem value="Satellite Pharmacy">Satellite Pharmacy</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-1 h-4 w-4" />
                <span>Upload Document</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Document Title</label>
                  <Input id="title" placeholder="Enter document title" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">Document Type</label>
                  <Select defaultValue="sop">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sop">SOP</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="protocol">Protocol</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="version" className="text-sm font-medium">Version</label>
                  <Input id="version" placeholder="e.g. 1.0" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="chapter" className="text-sm font-medium">USP Chapter</label>
                  <Select defaultValue="795">
                    <SelectTrigger id="chapter">
                      <SelectValue placeholder="Select USP chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="795">USP 795</SelectItem>
                      <SelectItem value="797">USP 797</SelectItem>
                      <SelectItem value="800">USP 800</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="file" className="text-sm font-medium">Document File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, DOCX, XLSX, PPT (Max 10MB)</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button type="submit">Upload</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Document Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search documents by title or filename..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                <SelectItem value="795">USP 795</SelectItem>
                <SelectItem value="797">USP 797</SelectItem>
                <SelectItem value="800">USP 800</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="sop">SOPs</TabsTrigger>
              <TabsTrigger value="policy">Policies</TabsTrigger>
              <TabsTrigger value="form">Forms</TabsTrigger>
              <TabsTrigger value="protocol">Protocols</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Skeleton className="h-10 w-10 rounded" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-3/5" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc: any) => (
                      <Card key={doc.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getDocumentIcon(doc.type, doc.filename)}
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">{doc.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.filename}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewDocument(doc)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-danger-600 dark:text-danger-500" onClick={() => handleDeleteDocument(doc.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              {doc.type}
                            </Badge>
                            <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                              USP {doc.chapterId}
                            </Badge>
                            {doc.version && (
                              <Badge variant="outline">v{doc.version}</Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Updated {formatDate(doc.uploadedAt)}</span>
                            </div>
                            <span>by {doc.uploadedBy === 1 ? 'M. Chen' : doc.uploadedBy === 2 ? 'J. Wu' : 'R. Johnson'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-10">
                      <AlertTriangle className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No documents found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">Try adjusting your search or filters</p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Upload New Document
                      </Button>
                    </div>
                  )
                )}
              </div>
            </TabsContent>
            
            {["sop", "policy", "form", "protocol"].map((tab) => (
              <TabsContent key={tab} value={tab} className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {!isLoading && filteredDocuments.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-10">
                      <AlertTriangle className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No {tab}s found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">Try uploading some {tab} documents</p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Upload New {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Button>
                    </div>
                  )}
                  {/* Content will be filtered in the 'all' tab handler */}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Document Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : (
                <>
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">USP 797 Cleaning SOP Updated</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Today, 2:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Maria Chen uploaded a new version (v2.3)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                      <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">USP 795 Monthly Report Template</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">John Wu downloaded the document</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                      <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Outdated USP 800 Form</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Robert Johnson deleted the document</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</h4>
                      <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Document Types</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">16 SOPs</Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">12 Forms</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Recent</h4>
                      <span className="text-sm text-gray-900 dark:text-gray-100">USP 797 Cleaning SOP</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Documents by USP Chapter</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">USP 795</span>
                          <span className="text-xs">14 documents</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">USP 797</span>
                          <span className="text-xs">18 documents</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "43%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">USP 800</span>
                          <span className="text-xs">10 documents</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "24%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}