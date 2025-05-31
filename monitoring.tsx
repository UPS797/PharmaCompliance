import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Clock, 
  Download, 
  Gauge, 
  LineChart, 
  Plus, 
  Search, 
  Thermometer, 
  Wind 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";

// Define environmental record form schema
const environmentalRecordSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  recordType: z.enum(["temperature", "pressure", "humidity"]),
  value: z.string().refine(
    (val) => !isNaN(parseFloat(val)), 
    { message: "Value must be a number" }
  ),
  unit: z.string().min(1, { message: "Unit is required" }),
  recordedAt: z.string().min(1, { message: "Date and time are required" }),
  notes: z.string().optional(),
});

type EnvironmentalRecordFormValues = z.infer<typeof environmentalRecordSchema>;

// Types
interface EnvironmentalRecord {
  id: number;
  location: string;
  recordType: "temperature" | "pressure" | "humidity";
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export default function Monitoring() {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { userInfo } = useAuth();
  
  const { data: records, isLoading } = useQuery<EnvironmentalRecord[]>({
    queryKey: ['/api/environmental-records'],
    // In a real application, this would fetch from an API
    queryFn: async () => {
      // For demo, return mock data
      return [
        {
          id: 1,
          location: "Clean Room",
          recordType: "temperature",
          value: 20.5,
          unit: "°C",
          status: "normal",
          recordedAt: "2024-05-20T08:00:00Z",
          recordedBy: "John Smith"
        },
        {
          id: 2,
          location: "Clean Room",
          recordType: "pressure",
          value: 0.03,
          unit: "inWC",
          status: "normal",
          recordedAt: "2024-05-20T08:00:00Z",
          recordedBy: "John Smith"
        },
        {
          id: 3,
          location: "Clean Room",
          recordType: "humidity",
          value: 42,
          unit: "%RH",
          status: "normal",
          recordedAt: "2024-05-20T08:00:00Z",
          recordedBy: "John Smith"
        },
        {
          id: 4,
          location: "Anteroom",
          recordType: "temperature",
          value: 22.1,
          unit: "°C",
          status: "normal",
          recordedAt: "2024-05-20T08:15:00Z",
          recordedBy: "Sarah Johnson"
        },
        {
          id: 5,
          location: "Anteroom",
          recordType: "pressure",
          value: 0.01,
          unit: "inWC",
          status: "warning",
          recordedAt: "2024-05-20T08:15:00Z",
          recordedBy: "Sarah Johnson",
          notes: "Pressure below recommended range. Check door seals."
        },
        {
          id: 6,
          location: "Anteroom",
          recordType: "humidity",
          value: 38,
          unit: "%RH",
          status: "warning",
          recordedAt: "2024-05-20T08:15:00Z",
          recordedBy: "Sarah Johnson",
          notes: "Humidity slightly below range."
        },
        {
          id: 7,
          location: "HD Storage",
          recordType: "temperature",
          value: 18.9,
          unit: "°C",
          status: "normal",
          recordedAt: "2024-05-20T08:30:00Z",
          recordedBy: "Mark Wilson"
        },
        {
          id: 8,
          location: "Med Refrigerator 1",
          recordType: "temperature",
          value: 9.2,
          unit: "°C",
          status: "critical",
          recordedAt: "2024-05-20T08:45:00Z",
          recordedBy: "Mark Wilson",
          notes: "Temperature too high! Check refrigerator function immediately."
        },
        {
          id: 9,
          location: "Med Refrigerator 2",
          recordType: "temperature",
          value: 4.1,
          unit: "°C",
          status: "normal",
          recordedAt: "2024-05-20T08:50:00Z",
          recordedBy: "Mark Wilson"
        },
        {
          id: 10,
          location: "Freezer",
          recordType: "temperature",
          value: -21.3,
          unit: "°C",
          status: "normal",
          recordedAt: "2024-05-20T08:55:00Z",
          recordedBy: "Mark Wilson"
        }
      ];
    }
  });

  // Create environmental record form
  const form = useForm<EnvironmentalRecordFormValues>({
    resolver: zodResolver(environmentalRecordSchema),
    defaultValues: {
      location: "",
      recordType: "temperature",
      value: "",
      unit: "",
      recordedAt: new Date().toISOString().slice(0, 16),
      notes: ""
    },
  });

  // Filter records based on selected filters and search query
  const filteredRecords = records?.filter(record => {
    // Filter by location
    if (selectedLocation !== "all" && record.location !== selectedLocation) {
      return false;
    }
    
    // Filter by record type
    if (selectedType !== "all" && record.recordType !== selectedType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !record.location.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.notes?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group records by type
  const temperatureRecords = filteredRecords?.filter(record => record.recordType === "temperature") || [];
  const pressureRecords = filteredRecords?.filter(record => record.recordType === "pressure") || [];
  const humidityRecords = filteredRecords?.filter(record => record.recordType === "humidity") || [];

  // Get unique locations for the select dropdown
  const locations = records ? [...new Set(records.map(record => record.location))] : [];
  
  // Get critical and warning records
  const criticalRecords = filteredRecords?.filter(record => record.status === "critical") || [];
  const warningRecords = filteredRecords?.filter(record => record.status === "warning") || [];

  // Handle record creation
  const onSubmit = (data: EnvironmentalRecordFormValues) => {
    console.log("Creating environmental record:", data);
    
    toast({
      title: "Record created",
      description: "The environmental record has been successfully logged"
    });
    
    form.reset();
    setIsCreateDialogOpen(false);
  };

  // Get appropriate unit for record type
  const getUnitForRecordType = (recordType: string) => {
    switch (recordType) {
      case "temperature":
        return "°C";
      case "pressure":
        return "inWC";
      case "humidity":
        return "%RH";
      default:
        return "";
    }
  };

  // Handle record type change to set the appropriate unit
  const handleRecordTypeChange = (type: string) => {
    form.setValue("unit", getUnitForRecordType(type));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Environmental Monitoring</h1>
          <p className="text-muted-foreground">
            Track and log temperature, pressure, and humidity for USP compliance
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-1">
              <Plus className="h-4 w-4" />
              New Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Log Environmental Record</DialogTitle>
              <DialogDescription>
                Record temperature, pressure, or humidity readings
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Clean Room">Clean Room</SelectItem>
                            <SelectItem value="Anteroom">Anteroom</SelectItem>
                            <SelectItem value="HD Storage">HD Storage</SelectItem>
                            <SelectItem value="Med Refrigerator 1">Med Refrigerator 1</SelectItem>
                            <SelectItem value="Med Refrigerator 2">Med Refrigerator 2</SelectItem>
                            <SelectItem value="Freezer">Freezer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recordType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Type</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRecordTypeChange(value);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="temperature">Temperature</SelectItem>
                            <SelectItem value="pressure">Pressure</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Enter value" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input readOnly {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="recordedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Any additional information" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include any relevant information about the reading
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit Record</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center">
              <Thermometer className="h-5 w-5 mr-2" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  temperatureRecords.length > 0 ? 
                  `${temperatureRecords[0].value} ${temperatureRecords[0].unit}` : 
                  "No data"
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                {isLoading ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  temperatureRecords.length > 0 ? 
                  `Latest reading from ${temperatureRecords[0].location}` : 
                  "No recent readings"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700 dark:text-blue-400 flex items-center">
              <Gauge className="h-5 w-5 mr-2" />
              Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  pressureRecords.length > 0 ? 
                  `${pressureRecords[0].value} ${pressureRecords[0].unit}` : 
                  "No data"
                )}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-500">
                {isLoading ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  pressureRecords.length > 0 ? 
                  `Latest reading from ${pressureRecords[0].location}` : 
                  "No recent readings"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-purple-700 dark:text-purple-400 flex items-center">
              <Wind className="h-5 w-5 mr-2" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  humidityRecords.length > 0 ? 
                  `${humidityRecords[0].value} ${humidityRecords[0].unit}` : 
                  "No data"
                )}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-500">
                {isLoading ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  humidityRecords.length > 0 ? 
                  `Latest reading from ${humidityRecords[0].location}` : 
                  "No recent readings"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {(criticalRecords.length > 0 || warningRecords.length > 0) && (
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-600 dark:text-red-400">
              Alerts
            </CardTitle>
            <CardDescription>
              The following readings require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalRecords.map(record => (
                <div 
                  key={record.id} 
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-red-700 dark:text-red-400">
                      Critical: {record.location} {record.recordType}
                    </h4>
                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700">
                      Critical
                    </Badge>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-500 mb-1">
                    Value: {record.value} {record.unit} | Recorded: {new Date(record.recordedAt).toLocaleString()}
                  </p>
                  {record.notes && (
                    <p className="text-sm text-red-600 dark:text-red-500">
                      Note: {record.notes}
                    </p>
                  )}
                </div>
              ))}
              
              {warningRecords.map(record => (
                <div 
                  key={record.id} 
                  className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-amber-700 dark:text-amber-400">
                      Warning: {record.location} {record.recordType}
                    </h4>
                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                      Warning
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-500 mb-1">
                    Value: {record.value} {record.unit} | Recorded: {new Date(record.recordedAt).toLocaleString()}
                  </p>
                  {record.notes && (
                    <p className="text-sm text-amber-600 dark:text-amber-500">
                      Note: {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monitoring Trends</CardTitle>
            <CardDescription>Environmental parameter trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Environmental monitoring trends would appear here</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Visualize temperature, pressure, and humidity over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Record Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="pressure">Pressure</SelectItem>
              <SelectItem value="humidity">Humidity</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="px-3">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environmental Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <RecordsLoadingSkeleton />
          ) : filteredRecords?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No records found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Recorded By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.location}</TableCell>
                      <TableCell>
                        {record.recordType === "temperature" ? (
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                            <span>Temperature</span>
                          </div>
                        ) : record.recordType === "pressure" ? (
                          <div className="flex items-center">
                            <Gauge className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                            <span>Pressure</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Wind className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                            <span>Humidity</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{record.value} {record.unit}</TableCell>
                      <TableCell>
                        {record.status === "normal" ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            Normal
                          </Badge>
                        ) : record.status === "warning" ? (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            Warning
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            Critical
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{new Date(record.recordedAt).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.recordedBy}</TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function RecordsLoadingSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-10 w-full" />
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}